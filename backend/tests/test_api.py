import pytest
from fastapi.testclient import TestClient
from app.main import app as fastapi_app
from app.db.session import engine, Base
from seed import seed_database

# Ensure database tables and initial seed data exist for tests
Base.metadata.create_all(bind=engine)
seed_database()

client = TestClient(fastapi_app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["brand"] == "MAPPLE"


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_get_categories():
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    categories = response.json()
    assert len(categories) >= 6
    slugs = [c["slug"] for c in categories]
    assert "iphone" in slugs
    assert "mac" in slugs
    assert "ipad" in slugs
    assert "watch" in slugs
    assert "audio" in slugs
    assert "accessories" in slugs


def test_get_products_list_and_filter():
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 18
    assert len(data["items"]) > 0

    # Test category filter
    resp_cat = client.get("/api/v1/products?category=iphone")
    assert resp_cat.status_code == 200
    items = resp_cat.json()["items"]
    assert len(items) >= 3
    for it in items:
        assert it["category_slug"] == "iphone"


def test_get_single_product_detail():
    response = client.get("/api/v1/products/mapple-phone-pro")
    assert response.status_code == 200
    data = response.json()
    product = data["product"]
    assert product["name"] == "MAPPLE Phone Pro"
    assert len(product["colors"]) >= 1
    assert len(product["configs"]) >= 1
    assert len(product["specs"]) >= 1
    assert "recommendations" in data


def test_compare_products():
    response = client.get("/api/v1/products/compare?slugs=mapple-phone-pro,mapple-phone")
    assert response.status_code == 200
    data = response.json()
    assert len(data["products"]) == 2
    assert "spec_groups" in data


def test_auth_and_protected_flow():
    # 1. Login with demo user
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "alex@mapple.com", "password": "MappleCustomer2026!"},
    )
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Access /auth/me
    me_resp = client.get("/api/v1/auth/me", headers=headers)
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == "alex@mapple.com"

    # 3. Access customer addresses
    addr_resp = client.get("/api/v1/addresses", headers=headers)
    assert addr_resp.status_code == 200
    assert len(addr_resp.json()) >= 1


def test_cart_and_checkout_flow():
    guest_headers = {"X-Guest-Token": "test_guest_session_123"}

    # 1. Add item to cart
    add_resp = client.post(
        "/api/v1/cart/items",
        json={
            "product_id": 1,
            "quantity": 1,
            "selected_color": "Natural Titanium",
            "selected_config": "256GB",
        },
        headers=guest_headers,
    )
    assert add_resp.status_code == 200
    cart_data = add_resp.json()
    assert cart_data["total_items"] == 1
    assert cart_data["subtotal_paise"] > 0

    # 2. Get checkout quote with discount code
    quote_resp = client.post(
        "/api/v1/checkout/quote",
        json={"guest_token": "test_guest_session_123", "discount_code": "MAPPLE10"},
        headers=guest_headers,
    )
    assert quote_resp.status_code == 200
    quote = quote_resp.json()
    assert quote["discount_paise"] > 0
    assert quote["total_paise"] < quote["subtotal_paise"] + quote["tax_paise"]

    # 3. Create order
    order_payload = {
        "customer_email": "testbuyer@mapple.com",
        "customer_name": "Test Buyer",
        "customer_phone": "+91 9988776655",
        "shipping_address": {
            "full_name": "Test Buyer",
            "street_line1": "12 Tech Boulevard",
            "city": "Mumbai",
            "state": "Maharashtra",
            "postal_code": "400001",
            "country": "India",
            "phone": "+91 9988776655",
        },
        "delivery_method": "standard",
        "payment_method": "mock_gateway",
        "discount_code": "MAPPLE10",
        "guest_token": "test_guest_session_123",
    }
    order_resp = client.post("/api/v1/orders", json=order_payload, headers=guest_headers)
    assert order_resp.status_code == 201
    order = order_resp.json()
    assert order["id"].startswith("MPL-")
    assert order["payment_status"] == "paid"
    assert len(order["items"]) == 1

    # 4. Verify customer cannot access random order without credentials
    forbidden_resp = client.get(f"/api/v1/orders/{order['id']}")
    assert forbidden_resp.status_code == 401

    # 5. Verify guest can access with guest email
    allowed_resp = client.get(f"/api/v1/orders/{order['id']}?guest_email=testbuyer@mapple.com")
    assert allowed_resp.status_code == 200
    assert allowed_resp.json()["id"] == order["id"]
