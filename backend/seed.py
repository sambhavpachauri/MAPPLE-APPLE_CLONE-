"""
Database seed script for MAPPLE technology e-commerce application.
Populates:
- Admin and demo customer accounts
- Categories
- 20 realistic fictional MAPPLE products across all categories
- Color variants, configurations, detailed specifications, and gallery images
- Discount codes
"""
import sys
import os

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.session import engine, SessionLocal, Base
from app.core.security import get_password_hash
from app.models.user import User
from app.models.category import Category
from app.models.product import Product, ProductImage, ProductColor, ProductConfig, ProductSpec
from app.models.discount import DiscountCode
from app.models.address import Address


def seed_database():
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Users
        admin = db.query(User).filter(User.email == "admin@mapple.com").first()
        if not admin:
            admin = User(
                email="admin@mapple.com",
                hashed_password=get_password_hash("MappleAdmin2026!"),
                full_name="MAPPLE System Administrator",
                phone="+91 98765 43210",
                role="admin",
                is_active=True,
            )
            db.add(admin)
            print("Created Admin: admin@mapple.com / MappleAdmin2026!")

        demo_user = db.query(User).filter(User.email == "alex@mapple.com").first()
        if not demo_user:
            demo_user = User(
                email="alex@mapple.com",
                hashed_password=get_password_hash("MappleCustomer2026!"),
                full_name="Alex Mercer",
                phone="+91 98111 22334",
                role="customer",
                is_active=True,
            )
            db.add(demo_user)
            db.flush()

            # Seed default address for Alex
            addr = Address(
                user_id=demo_user.id,
                full_name="Alex Mercer",
                street_line1="Apartment 402, Titanium Tower",
                street_line2="Cyber City, Phase II",
                city="Bengaluru",
                state="Karnataka",
                postal_code="560100",
                country="India",
                phone="+91 98111 22334",
                is_default=True,
            )
            db.add(addr)
            print("Created Customer: alex@mapple.com / MappleCustomer2026!")

        # 2. Seed Discount Codes
        discounts = [
            {
                "code": "MAPPLE10",
                "description": "10% off on all flagship orders above ₹10,000",
                "discount_type": "percentage",
                "discount_value": 10,
                "min_order_paise": 1000000,
                "max_discount_paise": 1500000,  # Max ₹15,000 discount
            },
            {
                "code": "WELCOME5000",
                "description": "Flat ₹5,000 off on your first major upgrade over ₹50,000",
                "discount_type": "fixed_paise",
                "discount_value": 500000,
                "min_order_paise": 5000000,
                "max_discount_paise": 500000,
            },
            {
                "code": "STUDENTPRO",
                "description": "Special 5% education savings across Mac and iPad",
                "discount_type": "percentage",
                "discount_value": 5,
                "min_order_paise": 2000000,
                "max_discount_paise": 1000000,
            },
        ]
        for d in discounts:
            if not db.query(DiscountCode).filter(DiscountCode.code == d["code"]).first():
                db.add(DiscountCode(**d))

        # 3. Seed Categories
        categories_data = [
            {
                "name": "Smartphones",
                "slug": "iphone",
                "tagline": "Titanium elegance. Unprecedented Neural Engine.",
                "description": "Experience aerospace-grade titanium construction, next-generation optical zoom, and our fastest mobile processor ever built.",
                "hero_image": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80",
                "sort_order": 1,
            },
            {
                "name": "Mac",
                "slug": "mac",
                "tagline": "Mind-blowing architecture. Unrivaled battery life.",
                "description": "Engineered for creators, developers, and visionaries with custom unified silicon architecture and Liquid Retina XDR displays.",
                "hero_image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
                "sort_order": 2,
            },
            {
                "name": "Tablets",
                "slug": "ipad",
                "tagline": "Ultra-thin design. Infinite canvas for genius.",
                "description": "Ultra Retina Tandem OLED displays, M-Series desktop-class silicon, and whisper-quiet power at your fingertips.",
                "hero_image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80",
                "sort_order": 3,
            },
            {
                "name": "Watch",
                "slug": "watch",
                "tagline": "Precision health. Extreme adventure endurance.",
                "description": "Cellular freedom, aerospace titanium casings, surgical-grade health metrics, and up to 72 hours of multi-day endurance.",
                "hero_image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
                "sort_order": 4,
            },
            {
                "name": "Audio",
                "slug": "audio",
                "tagline": "Acoustic transcendence. Computational sound.",
                "description": "Spatial Audio with dynamic head tracking, active noise cancellation up to 2x more powerful, and pristine studio-grade acoustics.",
                "hero_image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
                "sort_order": 5,
            },
            {
                "name": "Accessories",
                "slug": "accessories",
                "tagline": "Precision designed to seamlessly connect.",
                "description": "Crafted from fine-woven textiles, forged alloys, and inductive wireless architecture tailored specifically for your setup.",
                "hero_image": "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80",
                "sort_order": 6,
            },
        ]

        cat_map = {}
        for c in categories_data:
            existing_cat = db.query(Category).filter(Category.slug == c["slug"]).first()
            if not existing_cat:
                existing_cat = Category(**c)
                db.add(existing_cat)
                db.flush()
            cat_map[c["slug"]] = existing_cat.id

        # 4. Seed Products
        products_catalog = [
            # 1. MAPPLE Phone Pro
            {
                "category_slug": "iphone",
                "name": "MAPPLE Phone Pro",
                "slug": "mapple-phone-pro",
                "short_description": "Forged in Grade 5 Titanium with the groundbreaking M-Titan Chip and 120Hz ProMotion display.",
                "full_description": "MAPPLE Phone Pro represents the peak of our smartphone engineering. Featuring a micro-blasted titanium frame, customizable Action Button, 48MP computational triple-lens array with 5x optical telephoto, and all-day battery efficiency powered by the 3nm M-Titan Chip.",
                "price_paise": 13490000,  # ₹1,34,900
                "original_price_paise": 14490000,
                "stock_quantity": 45,
                "is_featured": True,
                "is_new": True,
                "badge": "Pro Flagship",
                "rating": 4.9,
                "review_count": 128,
                "images": [
                    {"image_url": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
                    {"image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80", "is_primary": False},
                    {"image_url": "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80", "is_primary": False},
                ],
                "colors": [
                    {"name": "Natural Titanium", "hex_code": "#8A8682"},
                    {"name": "Deep Midnight", "hex_code": "#1C1D21"},
                    {"name": "White Ceramic", "hex_code": "#F2F2F2"},
                    {"name": "Desert Blue", "hex_code": "#415A77"},
                ],
                "configs": [
                    {"config_type": "storage", "label": "256GB", "value": "256GB", "price_delta_paise": 0},
                    {"config_type": "storage", "label": "512GB", "value": "512GB", "price_delta_paise": 2000000},
                    {"config_type": "storage", "label": "1TB", "value": "1TB", "price_delta_paise": 4000000},
                ],
                "specs": [
                    {"group_name": "Display", "spec_name": "Screen Size", "spec_value": "6.7-inch Super Retina XDR OLED", "sort_order": 1},
                    {"group_name": "Display", "spec_name": "Refresh Rate", "spec_value": "1-120Hz ProMotion Adaptive", "sort_order": 2},
                    {"group_name": "Chip", "spec_name": "Processor", "spec_value": "M-Titan Silicon 3nm (6-core CPU, 6-core GPU)", "sort_order": 3},
                    {"group_name": "Camera", "spec_name": "Main System", "spec_value": "48MP Main + 48MP Ultra Wide + 12MP 5x Telephoto", "sort_order": 4},
                    {"group_name": "Battery", "spec_name": "Playback Time", "spec_value": "Up to 29 hours video playback", "sort_order": 5},
                    {"group_name": "Connectivity", "spec_name": "Cellular", "spec_value": "5G Gigabit with Satellite SOS", "sort_order": 6},
                ],
            },
            # 2. MAPPLE Phone
            {
                "category_slug": "iphone",
                "name": "MAPPLE Phone",
                "slug": "mapple-phone",
                "short_description": "Aerospace aluminum with color-infused back glass and Dynamic Island intelligence.",
                "full_description": "The quintessential MAPPLE smartphone. Vivid color-infused glass, Super Retina XDR display, dual-camera system with 2x optical-quality telephoto, and ultra-durable Ceramic Shield front cover.",
                "price_paise": 7990000,  # ₹79,900
                "original_price_paise": 8490000,
                "stock_quantity": 60,
                "is_featured": True,
                "is_new": True,
                "badge": "Popular",
                "rating": 4.8,
                "review_count": 94,
                "images": [
                    {"image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
                    {"image_url": "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80", "is_primary": False},
                ],
                "colors": [
                    {"name": "Starlight", "hex_code": "#FAF7F2"},
                    {"name": "Midnight", "hex_code": "#1A1A1E"},
                    {"name": "Pastel Mint", "hex_code": "#C9E4DE"},
                    {"name": "Electric Azure", "hex_code": "#64B5F6"},
                ],
                "configs": [
                    {"config_type": "storage", "label": "128GB", "value": "128GB", "price_delta_paise": 0},
                    {"config_type": "storage", "label": "256GB", "value": "256GB", "price_delta_paise": 1000000},
                    {"config_type": "storage", "label": "512GB", "value": "512GB", "price_delta_paise": 3000000},
                ],
                "specs": [
                    {"group_name": "Display", "spec_name": "Screen Size", "spec_value": "6.1-inch Super Retina XDR", "sort_order": 1},
                    {"group_name": "Chip", "spec_name": "Processor", "spec_value": "M-Bionic 4nm Architecture", "sort_order": 2},
                    {"group_name": "Camera", "spec_name": "Rear Setup", "spec_value": "48MP Dual Camera with 2x Telephoto", "sort_order": 3},
                    {"group_name": "Battery", "spec_name": "Playback Time", "spec_value": "Up to 22 hours video playback", "sort_order": 4},
                ],
            },
            # 3. MAPPLE Phone Air
            {
                "category_slug": "iphone",
                "name": "MAPPLE Phone Air",
                "slug": "mapple-phone-air",
                "short_description": "Our thinnest, lightest smartphone yet. Ultra-slim profile without compromising battery.",
                "full_description": "Engineered for minimalists who demand maximum elegance. At just 6.4mm thin, the MAPPLE Phone Air slips effortlessly into your pocket while packing cutting-edge silicon and full 5G connectivity.",
                "price_paise": 6490000,  # ₹64,900
                "original_price_paise": 6990000,
                "stock_quantity": 30,
                "is_featured": False,
                "is_new": True,
                "badge": "New",
                "rating": 4.7,
                "review_count": 48,
                "images": [
                    {"image_url": "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
                ],
                "colors": [
                    {"name": "Silver Cloud", "hex_code": "#E2E4E9"},
                    {"name": "Obsidian", "hex_code": "#111215"},
                    {"name": "Blush Coral", "hex_code": "#E8A598"},
                ],
                "configs": [
                    {"config_type": "storage", "label": "128GB", "value": "128GB", "price_delta_paise": 0},
                    {"config_type": "storage", "label": "256GB", "value": "256GB", "price_delta_paise": 1000000},
                ],
                "specs": [
                    {"group_name": "Display", "spec_name": "Screen Size", "spec_value": "6.3-inch OLED edge-to-edge", "sort_order": 1},
                    {"group_name": "Chip", "spec_name": "Processor", "spec_value": "M-Air Silicon Ultra Efficiency", "sort_order": 2},
                    {"group_name": "Dimensions", "spec_name": "Thickness", "spec_value": "6.4 mm ultra-slim", "sort_order": 3},
                ],
            },
            # 4. MAPPLE MacBook Pro
            {
                "category_slug": "mac",
                "name": "MAPPLE MacBook Pro",
                "slug": "mapple-macbook-pro",
                "short_description": "Mind-bending computational power with M3 Max Silicon and Liquid Retina XDR display.",
                "full_description": "Built for creative powerhouses, software engineers, and 3D artists. Features a 16.2-inch Liquid Retina XDR display with 1600 nits peak brightness, up to 128GB unified memory, 22 hours of battery life, and studio-quality 6-speaker array with force-cancelling woofers.",
                "price_paise": 19990000,  # ₹1,99,900
                "original_price_paise": 21990000,
                "stock_quantity": 25,
                "is_featured": True,
                "is_new": True,
                "badge": "Pro Performance",
                "rating": 5.0,
                "review_count": 87,
                "images": [
                    {"image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
                    {"image_url": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80", "is_primary": False},
                ],
                "colors": [
                    {"name": "Space Black", "hex_code": "#2E2F32"},
                    {"name": "Silver Alloy", "hex_code": "#E1E2E5"},
                ],
                "configs": [
                    {"config_type": "memory", "label": "36GB RAM / 512GB SSD", "value": "36GB-512GB", "price_delta_paise": 0},
                    {"config_type": "memory", "label": "48GB RAM / 1TB SSD", "value": "48GB-1TB", "price_delta_paise": 4000000},
                    {"config_type": "memory", "label": "64GB RAM / 2TB SSD", "value": "64GB-2TB", "price_delta_paise": 8000000},
                ],
                "specs": [
                    {"group_name": "Display", "spec_name": "Screen Size", "spec_value": "16.2-inch Liquid Retina XDR 120Hz", "sort_order": 1},
                    {"group_name": "Chip", "spec_name": "Processor", "spec_value": "M-Compute Pro 16-Core CPU 40-Core GPU", "sort_order": 2},
                    {"group_name": "Battery", "spec_name": "Battery Life", "spec_value": "Up to 22 hours web and compilation", "sort_order": 3},
                    {"group_name": "Connectivity", "spec_name": "Ports", "spec_value": "3x Thunderbolt 4, HDMI, SDXC, MagCharge", "sort_order": 4},
                ],
            },
            # 5. MAPPLE MacBook Air
            {
                "category_slug": "mac",
                "name": "MAPPLE MacBook Air",
                "slug": "mapple-macbook-air",
                "short_description": "Strikingly thin, ridiculously fast, and completely fanless silent operation.",
                "full_description": "The world's most beloved laptop, supercharged. At less than half an inch thin, MacBook Air effortlessly handles everyday productivity, photo editing, and creative coding with zero fan noise and up to 18 hours of battery.",
                "price_paise": 11490000,  # ₹1,14,900
                "original_price_paise": 12490000,
                "stock_quantity": 55,
                "is_featured": True,
                "is_new": False,
                "badge": "Best Seller",
                "rating": 4.9,
                "review_count": 142,
                "images": [
                    {"image_url": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
                    {"image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80", "is_primary": False},
                ],
                "colors": [
                    {"name": "Midnight Blue", "hex_code": "#191C24"},
                    {"name": "Starlight Champagne", "hex_code": "#F4EFE6"},
                    {"name": "Space Gray", "hex_code": "#53565A"},
                    {"name": "Pure Silver", "hex_code": "#DFE1E5"},
                ],
                "configs": [
                    {"config_type": "memory", "label": "16GB RAM / 256GB SSD", "value": "16GB-256GB", "price_delta_paise": 0},
                    {"config_type": "memory", "label": "16GB RAM / 512GB SSD", "value": "16GB-512GB", "price_delta_paise": 2000000},
                    {"config_type": "memory", "label": "24GB RAM / 1TB SSD", "value": "24GB-1TB", "price_delta_paise": 5000000},
                ],
                "specs": [
                    {"group_name": "Display", "spec_name": "Screen Size", "spec_value": "13.6-inch Liquid Retina Display", "sort_order": 1},
                    {"group_name": "Chip", "spec_name": "Processor", "spec_value": "M-Compute 8-core CPU 10-core GPU", "sort_order": 2},
                    {"group_name": "Battery", "spec_name": "Battery Life", "spec_value": "Up to 18 hours", "sort_order": 3},
                    {"group_name": "Dimensions", "spec_name": "Weight", "spec_value": "1.24 kg ultralight", "sort_order": 4},
                ],
            },
            # 6. MAPPLE Studio
            {
                "category_slug": "mac",
                "name": "MAPPLE Studio",
                "slug": "mapple-studio",
                "short_description": "Unprecedented desktop workstation silicon in a stunningly compact modular enclosure.",
                "full_description": "Astonishing performance and extensive connectivity in an impossibly compact form factor that fits right on your desk. MAPPLE Studio transforms any creative workspace into a professional production suite.",
                "price_paise": 24990000,  # ₹2,49,900
                "original_price_paise": None,
                "stock_quantity": 18,
                "is_featured": False,
                "is_new": True,
                "badge": "Workstation",
                "rating": 4.9,
                "review_count": 31,
                "images": [
                    {"image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
                ],
                "colors": [
                    {"name": "Anodized Silver", "hex_code": "#D1D5DB"},
                ],
                "configs": [
                    {"config_type": "memory", "label": "64GB RAM / 1TB SSD", "value": "64GB-1TB", "price_delta_paise": 0},
                    {"config_type": "memory", "label": "128GB RAM / 2TB SSD", "value": "128GB-2TB", "price_delta_paise": 8000000},
                ],
                "specs": [
                    {"group_name": "Chip", "spec_name": "Processor", "spec_value": "M-Compute Ultra 24-core CPU 76-core GPU", "sort_order": 1},
                    {"group_name": "Connectivity", "spec_name": "Front Ports", "spec_value": "2x Thunderbolt 4, SDXC Slot", "sort_order": 2},
                    {"group_name": "Connectivity", "spec_name": "Rear Ports", "spec_value": "4x Thunderbolt 4, 10Gb Ethernet, HDMI", "sort_order": 3},
                ],
            },
            # 7. MAPPLE iPad Pro
            {
                "category_slug": "ipad",
                "name": "MAPPLE iPad Pro",
                "slug": "mapple-ipad-pro",
                "short_description": "Ultra Retina Tandem OLED display and razor-thin 5.1mm aluminum enclosure.",
                "full_description": "The ultimate tablet experience. Powered by the groundbreaking M-Series chip, Tandem OLED display technology delivering groundbreaking contrast and brightness, and seamless support for MAPPLE Precision Stylus.",
                "price_paise": 9990000,  # ₹99,900
                "original_price_paise": 10990000,
                "stock_quantity": 40,
                "is_featured": True,
                "is_new": True,
                "badge": "OLED Flagship",
                "rating": 4.9,
                "review_count": 76,
                "images": [
                    {"image_url": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
                ],
                "colors": [
                    {"name": "Space Black", "hex_code": "#232428"},
                    {"name": "Silver Mist", "hex_code": "#E4E5E8"},
                ],
                "configs": [
                    {"config_type": "storage", "label": "256GB / Wi-Fi", "value": "256GB-WIFI", "price_delta_paise": 0},
                    {"config_type": "storage", "label": "512GB / Wi-Fi + 5G", "value": "512GB-CELL", "price_delta_paise": 3000000},
                    {"config_type": "storage", "label": "1TB / Nano-Texture", "value": "1TB-NANO", "price_delta_paise": 7000000},
                ],
                "specs": [
                    {"group_name": "Display", "spec_name": "Screen Size", "spec_value": "13-inch Ultra Retina XDR Tandem OLED", "sort_order": 1},
                    {"group_name": "Chip", "spec_name": "Silicon", "spec_value": "M-Compute 10-core Next Gen Architecture", "sort_order": 2},
                    {"group_name": "Dimensions", "spec_name": "Thickness", "spec_value": "5.1 mm impossibly thin", "sort_order": 3},
                ],
            },
            # 8. MAPPLE iPad Air
            {
                "category_slug": "ipad",
                "name": "MAPPLE iPad Air",
                "slug": "mapple-ipad-air",
                "short_description": "Fresh vibrant colors, Liquid Retina display, and pro performance within reach.",
                "full_description": "Turbocharged by desktop-class silicon architecture, iPad Air lets you unleash creativity, multitask across high-demand apps, and game with console-grade graphics everywhere.",
                "price_paise": 5990000,  # ₹59,900
                "original_price_paise": 6490000,
                "stock_quantity": 42,
                "is_featured": False,
                "is_new": False,
                "badge": "Popular",
                "rating": 4.8,
                "review_count": 63,
                "images": [
                    {"image_url": "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
                ],
                "colors": [
                    {"name": "Space Gray", "hex_code": "#4E5156"},
                    {"name": "Sky Blue", "hex_code": "#A0C4E2"},
                    {"name": "Lavender", "hex_code": "#D0BCD5"},
                    {"name": "Starlight", "hex_code": "#EAE5DB"},
                ],
                "configs": [
                    {"config_type": "storage", "label": "128GB", "value": "128GB", "price_delta_paise": 0},
                    {"config_type": "storage", "label": "256GB", "value": "256GB", "price_delta_paise": 1000000},
                ],
                "specs": [
                    {"group_name": "Display", "spec_name": "Display Type", "spec_value": "11-inch Liquid Retina True Tone", "sort_order": 1},
                    {"group_name": "Chip", "spec_name": "Silicon", "spec_value": "M-Compute 8-core CPU", "sort_order": 2},
                ],
            },
            # 9. MAPPLE iPad Mini
            {
                "category_slug": "ipad",
                "name": "MAPPLE iPad Mini",
                "slug": "mapple-ipad-mini",
                "short_description": "Mega power. Mini size. The ultimate pocketable digital notebook.",
                "full_description": "Fits right in the palm of your hand. Featuring an 8.3-inch edge-to-edge Liquid Retina display, USB-C fast charging, and full stylus support for notes, sketches, and reading on the go.",
                "price_paise": 4990000,  # ₹49,900
                "original_price_paise": 5490000,
                "stock_quantity": 38,
                "is_featured": False,
                "is_new": False,
                "badge": "Compact",
                "rating": 4.7,
                "review_count": 52,
                "images": [
                    {"image_url": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
                ],
                "colors": [
                    {"name": "Space Gray", "hex_code": "#43464B"},
                    {"name": "Purple Dawn", "hex_code": "#B8A9C9"},
                    {"name": "Pink Pearl", "hex_code": "#F4C2C2"},
                ],
                "configs": [
                    {"config_type": "storage", "label": "128GB", "value": "128GB", "price_delta_paise": 0},
                    {"config_type": "storage", "label": "256GB", "value": "256GB", "price_delta_paise": 1000000},
                ],
                "specs": [
                    {"group_name": "Display", "spec_name": "Screen Size", "spec_value": "8.3-inch Liquid Retina Display", "sort_order": 1},
                    {"group_name": "Dimensions", "spec_name": "Weight", "spec_value": "293 grams featherweight", "sort_order": 2},
                ],
            },
            # 10. MAPPLE Watch Ultra
            {
                "category_slug": "watch",
                "name": "MAPPLE Watch Ultra",
                "slug": "mapple-watch-ultra",
                "short_description": "Rugged aerospace titanium, dual-frequency precision GPS, and 72-hour battery life.",
                "full_description": "Engineered for extreme environments, athletes, and endurance adventurers. 49mm titanium case, 3000 nits brightest display, customizable Action Button, water resistance to 100m, and dual-frequency L1/L5 GPS.",
                "price_paise": 8990000,  # ₹89,900
                "original_price_paise": 9490000,
                "stock_quantity": 32,
                "is_featured": True,
                "is_new": True,
                "badge": "Adventure Edition",
                "rating": 5.0,
                "review_count": 69,
                "images": [
                    {"image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
                ],
                "colors": [
                    {"name": "Natural Titanium / Orange Trail", "hex_code": "#D2691E"},
                    {"name": "Titanium Black / Ocean Band", "hex_code": "#1F2937"},
                ],
                "configs": [
                    {"config_type": "size", "label": "49mm Case (GPS + Cellular)", "value": "49mm-CELL", "price_delta_paise": 0},
                ],
                "specs": [
                    {"group_name": "Display", "spec_name": "Brightness", "spec_value": "Up to 3,000 nits sapphire crystal", "sort_order": 1},
                    {"group_name": "Battery", "spec_name": "Endurance", "spec_value": "Up to 72 hours in Low Power Mode", "sort_order": 2},
                    {"group_name": "Durability", "spec_name": "Water Resistance", "spec_value": "100m water resistant / EN13319 dive certified", "sort_order": 3},
                ],
            },
            # 11. MAPPLE Watch Series
            {
                "category_slug": "watch",
                "name": "MAPPLE Watch Series",
                "slug": "mapple-watch-series",
                "short_description": "Advanced health sensors, ECG, blood oxygen tracking, and gesture double-tap control.",
                "full_description": "Your ultimate personal companion for fitness, wellness, and connectivity. Featuring edge-to-edge Always-On Retina display, temperature sensing for cycle tracking, and seamless hands-free double tap navigation.",
                "price_paise": 4490000,  # ₹44,900
                "original_price_paise": 4790000,
                "stock_quantity": 48,
                "is_featured": True,
                "is_new": False,
                "badge": "Best Seller",
                "rating": 4.8,
                "review_count": 115,
                "images": [
                    {"image_url": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
                ],
                "colors": [
                    {"name": "Midnight Jet", "hex_code": "#1A1A1D"},
                    {"name": "Starlight Gold", "hex_code": "#F2E8DC"},
                    {"name": "Silver Aluminum", "hex_code": "#DDE0E5"},
                    {"name": "Crimson Edition", "hex_code": "#C92A2A"},
                ],
                "configs": [
                    {"config_type": "size", "label": "41mm Case", "value": "41mm", "price_delta_paise": 0},
                    {"config_type": "size", "label": "45mm Case", "value": "45mm", "price_delta_paise": 400000},
                ],
                "specs": [
                    {"group_name": "Display", "spec_name": "Screen", "spec_value": "Always-On Retina OLED 2000 nits", "sort_order": 1},
                    {"group_name": "Sensors", "spec_name": "Health", "spec_value": "ECG, Blood Oxygen, Skin Temperature", "sort_order": 2},
                ],
            },
            # 12. MAPPLE Watch SE
            {
                "category_slug": "watch",
                "name": "MAPPLE Watch SE",
                "slug": "mapple-watch-se",
                "short_description": "Essential safety, fitness tracking, and emergency crash detection at an accessible price.",
                "full_description": "All the essentials to keep you motivated, active, connected, and safe. Heart rate monitoring, Activity rings, Fall Detection, and swim-proof 50m water resistance.",
                "price_paise": 2990000,  # ₹29,900
                "original_price_paise": 3290000,
                "stock_quantity": 50,
                "is_featured": False,
                "is_new": False,
                "badge": "Value",
                "rating": 4.7,
                "review_count": 82,
                "images": [
                    {"image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
                ],
                "colors": [
                    {"name": "Midnight", "hex_code": "#1F2024"},
                    {"name": "Starlight", "hex_code": "#EFECE6"},
                    {"name": "Silver", "hex_code": "#E2E4E8"},
                ],
                "configs": [
                    {"config_type": "size", "label": "40mm Case", "value": "40mm", "price_delta_paise": 0},
                    {"config_type": "size", "label": "44mm Case", "value": "44mm", "price_delta_paise": 300000},
                ],
                "specs": [
                    {"group_name": "Display", "spec_name": "Screen", "spec_value": "Retina LTPO OLED Display", "sort_order": 1},
                    {"group_name": "Water Resistance", "spec_name": "Rating", "spec_value": "50 meters swimproof", "sort_order": 2},
                ],
            },
            # 13. MAPPLE Pods Pro
            {
                "category_slug": "audio",
                "name": "MAPPLE Pods Pro",
                "slug": "mapple-pods-pro",
                "short_description": "Pro-level Active Noise Cancellation with Transparency Mode and Personalized Spatial Audio.",
                "full_description": "Acoustic engineering elevated to an art form. Next-generation H-Audio silicon delivers up to 2x more active noise cancellation, Adaptive Audio that tailors sound to your environment, and touch volume controls right on the stem.",
                "price_paise": 2490000,  # ₹24,900
                "original_price_paise": 2690000,
                "stock_quantity": 70,
                "is_featured": True,
                "is_new": True,
                "badge": "Flagship Audio",
                "rating": 4.9,
                "review_count": 184,
                "images": [
                    {"image_url": "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
                    {"image_url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80", "is_primary": False},
                ],
                "colors": [
                    {"name": "Gloss White", "hex_code": "#FAFAFA"},
                    {"name": "Matte Stealth Black", "hex_code": "#1A1A1A"},
                ],
                "configs": [
                    {"config_type": "case", "label": "MagCharge Wireless Case (USB-C)", "value": "USB-C", "price_delta_paise": 0},
                ],
                "specs": [
                    {"group_name": "Audio", "spec_name": "ANC", "spec_value": "2x Active Noise Cancellation with Adaptive Audio", "sort_order": 1},
                    {"group_name": "Battery", "spec_name": "Listening Time", "spec_value": "6 hours on single charge / 30 hours with case", "sort_order": 2},
                    {"group_name": "Resistance", "spec_name": "Rating", "spec_value": "IP54 dust, sweat, and water resistant", "sort_order": 3},
                ],
            },
            # 14. MAPPLE Pods
            {
                "category_slug": "audio",
                "name": "MAPPLE Pods",
                "slug": "mapple-pods",
                "short_description": "Effortless setup, rich acoustic bass, crystal-clear beamforming microphones.",
                "full_description": "Pure listening simplicity. Automatically turns on and connects the moment you open the case. Engineered with contoured tips for all-day comfort and deep, punchy low-end clarity.",
                "price_paise": 1490000,  # ₹14,900
                "original_price_paise": 1690000,
                "stock_quantity": 65,
                "is_featured": False,
                "is_new": False,
                "badge": "Best Seller",
                "rating": 4.7,
                "review_count": 92,
                "images": [
                    {"image_url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
                ],
                "colors": [
                    {"name": "Pure White", "hex_code": "#FFFFFF"},
                ],
                "configs": [
                    {"config_type": "case", "label": "Standard Charging Case", "value": "Standard", "price_delta_paise": 0},
                ],
                "specs": [
                    {"group_name": "Audio", "spec_name": "Drivers", "spec_value": "Custom high-excursion MAPPLE driver", "sort_order": 1},
                    {"group_name": "Battery", "spec_name": "Battery Life", "spec_value": "Up to 24 hours total listening time", "sort_order": 2},
                ],
            },
            # 15. MAPPLE Max Headphones
            {
                "category_slug": "audio",
                "name": "MAPPLE Max Headphones",
                "slug": "mapple-max-headphones",
                "short_description": "Over-ear luxury with custom 40mm dynamic drivers and precision aluminum earcups.",
                "full_description": "The definitive over-ear acoustic masterpiece. Breathable mesh canopy, memory foam ear cushions with acoustically engineered fabric, digital crown tactile control, and high-fidelity lossless audio via USB-C.",
                "price_paise": 5990000,  # ₹59,900
                "original_price_paise": 6490000,
                "stock_quantity": 25,
                "is_featured": True,
                "is_new": False,
                "badge": "Audiophile",
                "rating": 4.9,
                "review_count": 58,
                "images": [
                    {"image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
                ],
                "colors": [
                    {"name": "Space Gray", "hex_code": "#383A3F"},
                    {"name": "Silver Cloud", "hex_code": "#E8E9EC"},
                    {"name": "Midnight Indigo", "hex_code": "#2B3A42"},
                    {"name": "Desert Rose", "hex_code": "#DDA7A5"},
                ],
                "configs": [
                    {"config_type": "connectivity", "label": "Wireless Bluetooth 5.4 + USB-C Lossless", "value": "Lossless", "price_delta_paise": 0},
                ],
                "specs": [
                    {"group_name": "Audio", "spec_name": "Driver Size", "spec_value": "40mm custom dynamic acoustic drivers", "sort_order": 1},
                    {"group_name": "Battery", "spec_name": "Playback", "spec_value": "20 hours with ANC & Spatial Audio enabled", "sort_order": 2},
                ],
            },
            # 16. MAPPLE MagCharge
            {
                "category_slug": "accessories",
                "name": "MAPPLE MagCharge",
                "slug": "mapple-magcharge",
                "short_description": "Effortless magnetic snap-on wireless fast charging up to 25W with braided cable.",
                "full_description": "Perfect magnetic alignment every single time. Designed with brushed aluminum and a durable 1.5m braided nylon cable that delivers up to 25W peak fast-charging to compatible MAPPLE devices.",
                "price_paise": 450000,  # ₹4,500
                "original_price_paise": 490000,
                "stock_quantity": 90,
                "is_featured": False,
                "is_new": True,
                "badge": "Essential",
                "rating": 4.8,
                "review_count": 89,
                "images": [
                    {"image_url": "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
                ],
                "colors": [
                    {"name": "Silver / White", "hex_code": "#EEEEEE"},
                    {"name": "Midnight Black", "hex_code": "#222222"},
                ],
                "configs": [
                    {"config_type": "cable_length", "label": "1.5 Meter Braided Cable", "value": "1.5m", "price_delta_paise": 0},
                    {"config_type": "cable_length", "label": "2.5 Meter Braided Cable", "value": "2.5m", "price_delta_paise": 100000},
                ],
                "specs": [
                    {"group_name": "Power", "spec_name": "Output", "spec_value": "Up to 25W fast wireless inductive charging", "sort_order": 1},
                    {"group_name": "Connectivity", "spec_name": "Port", "spec_value": "USB-C standard input", "sort_order": 2},
                ],
            },
            # 17. MAPPLE Keyboard
            {
                "category_slug": "accessories",
                "name": "MAPPLE Keyboard",
                "slug": "mapple-keyboard",
                "short_description": "Scissor mechanism keys, built-in Touch ID biometric sensor, and woven USB-C cord.",
                "full_description": "Delivers a remarkably comfortable, responsive typing experience. Features an extended layout with document navigation controls, full-size arrow keys, numeric keypad, and integrated biometric fingerprint authentication.",
                "price_paise": 1290000,  # ₹12,900
                "original_price_paise": 1490000,
                "stock_quantity": 50,
                "is_featured": False,
                "is_new": False,
                "badge": "Touch ID",
                "rating": 4.8,
                "review_count": 41,
                "images": [
                    {"image_url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
                ],
                "colors": [
                    {"name": "Silver / White Keys", "hex_code": "#F0F0F0"},
                    {"name": "Space Black / Black Keys", "hex_code": "#1C1C1F"},
                ],
                "configs": [
                    {"config_type": "layout", "label": "Standard QWERTY Layout", "value": "Standard", "price_delta_paise": 0},
                ],
                "specs": [
                    {"group_name": "Security", "spec_name": "Biometrics", "spec_value": "Touch ID biometric sensor", "sort_order": 1},
                    {"group_name": "Battery", "spec_name": "Longevity", "spec_value": "Over 1 month between charges", "sort_order": 2},
                ],
            },
            # 18. MAPPLE Smart Speaker
            {
                "category_slug": "audio",
                "name": "MAPPLE Smart Speaker",
                "slug": "mapple-smart-speaker",
                "short_description": "Room-filling 360-degree high-fidelity acoustics with intelligent voice assistance.",
                "full_description": "Boundless sound packed into a compact sphere. Seamlessly pairs with other MAPPLE speakers for multi-room audio and stereo soundstage, while functioning as a secure smart home hub with Thread and Matter protocols.",
                "price_paise": 990000,  # ₹9,900
                "original_price_paise": 1090000,
                "stock_quantity": 44,
                "is_featured": False,
                "is_new": True,
                "badge": "Smart Home",
                "rating": 4.7,
                "review_count": 67,
                "images": [
                    {"image_url": "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
                ],
                "colors": [
                    {"name": "Charcoal Black", "hex_code": "#2A2A2E"},
                    {"name": "Chalk White", "hex_code": "#F5F5F7"},
                    {"name": "Solar Orange", "hex_code": "#FF6B35"},
                ],
                "configs": [
                    {"config_type": "pack", "label": "Single Speaker", "value": "Single", "price_delta_paise": 0},
                    {"config_type": "pack", "label": "Stereo Pair (2 Speakers)", "value": "StereoPair", "price_delta_paise": 850000},
                ],
                "specs": [
                    {"group_name": "Acoustics", "spec_name": "Architecture", "spec_value": "Full-range driver and dual passive radiators", "sort_order": 1},
                    {"group_name": "Smart Hub", "spec_name": "Protocols", "spec_value": "Matter and Thread border router support", "sort_order": 2},
                ],
            },
            # 19. MAPPLE Studio Display
            {
                "category_slug": "accessories",
                "name": "MAPPLE Studio Display",
                "slug": "mapple-studio-display",
                "short_description": "27-inch 5K Retina screen, 12MP Center Stage camera, and 6-speaker spatial audio system.",
                "full_description": "A sight to behold. 14.7 million pixels of breathtaking 5K clarity, P3 wide color gamut, 600 nits brightness, studio-quality three-microphone array, and 96W power delivery to charge your notebook with a single cable.",
                "price_paise": 15990000,  # ₹1,59,900
                "original_price_paise": 16990000,
                "stock_quantity": 15,
                "is_featured": False,
                "is_new": False,
                "badge": "5K Retina",
                "rating": 4.9,
                "review_count": 28,
                "images": [
                    {"image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
                ],
                "colors": [
                    {"name": "Silver Anodized Aluminum", "hex_code": "#E0E2E6"},
                ],
                "configs": [
                    {"config_type": "glass", "label": "Standard Glass / Tilt Stand", "value": "Standard", "price_delta_paise": 0},
                    {"config_type": "glass", "label": "Nano-Texture Glass / Tilt & Height Stand", "value": "NanoTexture", "price_delta_paise": 4000000},
                ],
                "specs": [
                    {"group_name": "Display", "spec_name": "Resolution", "spec_value": "5K 5120 x 2880 at 218 ppi", "sort_order": 1},
                    {"group_name": "Camera", "spec_name": "Optics", "spec_value": "12MP Ultra Wide with Center Stage framing", "sort_order": 2},
                ],
            },
            # 20. MAPPLE Precision Stylus
            {
                "category_slug": "accessories",
                "name": "MAPPLE Precision Stylus",
                "slug": "mapple-precision-stylus",
                "short_description": "Pixel-perfect precision, tilt and pressure sensitivity, haptic feedback, and magnetic pairing.",
                "full_description": "Transforms your tablet into a responsive studio canvas. Equipped with rotation sensing, squeeze gestures for quick tool palette switching, sub-millimeter precision, and imperceptible latency.",
                "price_paise": 1190000,  # ₹11,900
                "original_price_paise": 1290000,
                "stock_quantity": 80,
                "is_featured": False,
                "is_new": True,
                "badge": "Precision Tool",
                "rating": 4.8,
                "review_count": 73,
                "images": [
                    {"image_url": "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80", "is_primary": True},
                ],
                "colors": [
                    {"name": "Matte White", "hex_code": "#FFFFFF"},
                ],
                "configs": [
                    {"config_type": "tip", "label": "Standard Fine Tip + 2 Replacements", "value": "Standard", "price_delta_paise": 0},
                ],
                "specs": [
                    {"group_name": "Sensors", "spec_name": "Haptics", "spec_value": "Custom haptic actuator feedback", "sort_order": 1},
                    {"group_name": "Charging", "spec_name": "Method", "spec_value": "Magnetic inductive attach and charge", "sort_order": 2},
                ],
            },
        ]

        for p_data in products_catalog:
            existing_prod = db.query(Product).filter(Product.slug == p_data["slug"]).first()
            if existing_prod:
                continue

            category_id = cat_map.get(p_data["category_slug"])
            product = Product(
                category_id=category_id,
                name=p_data["name"],
                slug=p_data["slug"],
                short_description=p_data["short_description"],
                full_description=p_data["full_description"],
                price_paise=p_data["price_paise"],
                original_price_paise=p_data.get("original_price_paise"),
                stock_quantity=p_data["stock_quantity"],
                is_featured=p_data.get("is_featured", False),
                is_new=p_data.get("is_new", False),
                is_active=True,
                badge=p_data.get("badge"),
                rating=p_data.get("rating", 4.8),
                review_count=p_data.get("review_count", 50),
            )
            db.add(product)
            db.flush()

            # Add images
            for idx, img in enumerate(p_data.get("images", [])):
                p_img = ProductImage(
                    product_id=product.id,
                    image_url=img["image_url"],
                    alt_text=f"{product.name} photo {idx + 1}",
                    is_primary=img.get("is_primary", idx == 0),
                    sort_order=idx,
                )
                db.add(p_img)

            # Add colors
            for c in p_data.get("colors", []):
                p_col = ProductColor(
                    product_id=product.id,
                    name=c["name"],
                    hex_code=c["hex_code"],
                )
                db.add(p_col)

            # Add configs
            for conf in p_data.get("configs", []):
                p_conf = ProductConfig(
                    product_id=product.id,
                    config_type=conf["config_type"],
                    label=conf["label"],
                    value=conf["value"],
                    price_delta_paise=conf.get("price_delta_paise", 0),
                )
                db.add(p_conf)

            # Add specs
            for sp in p_data.get("specs", []):
                p_spec = ProductSpec(
                    product_id=product.id,
                    group_name=sp["group_name"],
                    spec_name=sp["spec_name"],
                    spec_value=sp["spec_value"],
                    sort_order=sp.get("sort_order", 0),
                )
                db.add(p_spec)

        db.commit()
        print("Database successfully seeded with 20 MAPPLE products, categories, specs, discounts, and users!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
