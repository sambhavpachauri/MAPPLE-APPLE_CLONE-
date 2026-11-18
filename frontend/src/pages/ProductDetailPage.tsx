import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  ArrowRight,
  Maximize2,
  X,
  Share2,
  Package,
} from 'lucide-react';
import { api } from '../services/api';
import { ProductDetail, ProductListItem } from '../types';
import { formatINR } from '../lib/utils';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';
import { ProductCard } from '../components/product/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [recommendations, setRecommendations] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selections
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedConfig, setSelectedConfig] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'overview' | 'box'>('specs');

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const data = await api.get<{ product: ProductDetail; recommendations: ProductListItem[] }>(`/products/${slug}`);
        setProduct(data.product);
        setRecommendations(data.recommendations || []);

        // Defaults
        if (data.product.colors?.length > 0) {
          setSelectedColor(data.product.colors[0].name);
        }
        if (data.product.configs?.length > 0) {
          setSelectedConfig(data.product.configs[0].label);
        }
        setSelectedImageIndex(0);
        setQuantity(1);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="py-16 max-w-6xl mx-auto px-4 animate-pulse space-y-8">
        <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-neutral-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-10 bg-neutral-200 rounded w-3/4"></div>
            <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
            <div className="h-24 bg-neutral-100 rounded"></div>
            <div className="h-12 bg-neutral-200 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold text-neutral-900">Product Not Found</h2>
        <p className="text-sm text-neutral-500 mt-2">The requested MAPPLE device is unavailable.</p>
        <Link
          to="/store"
          className="mt-6 inline-block px-6 py-2.5 rounded-full bg-[#0071e3] text-white text-xs font-semibold"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  // Calculate dynamic price
  const basePrice = product.price_paise;
  let configDelta = 0;
  if (selectedConfig && product.configs) {
    const activeConf = product.configs.find((c) => c.label === selectedConfig || c.value === selectedConfig);
    if (activeConf) {
      configDelta = activeConf.price_delta_paise;
    }
  }
  const currentPricePaise = basePrice + configDelta;
  const isSaved = isInWishlist(product.id);

  const images = product.images?.length > 0
    ? product.images.map((i) => i.image_url)
    : [product.primary_image || ''];

  const handleAddToCart = async () => {
    await addItem(product.id, quantity, selectedColor, selectedConfig);
  };

  const handleBuyNow = async () => {
    await addItem(product.id, quantity, selectedColor, selectedConfig);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      success('Link Copied', 'Product link copied to clipboard.');
    }
  };

  return (
    <div className="py-8 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-neutral-500 flex items-center space-x-2">
        <Link to="/" className="hover:text-neutral-900">Home</Link>
        <span>/</span>
        <Link to="/store" className="hover:text-neutral-900">Store</Link>
        <span>/</span>
        {product.category_slug && (
          <>
            <Link to={`/store/${product.category_slug}`} className="hover:text-neutral-900">
              {product.category_name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-neutral-900 font-medium truncate">{product.name}</span>
      </nav>

      {/* Main Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Gallery (Left: 7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Showcase Image */}
          <div className="relative aspect-square sm:aspect-[4/3] bg-white rounded-3xl p-8 border border-neutral-200/60 shadow-sm flex items-center justify-center overflow-hidden group">
            <img
              src={images[selectedImageIndex] || ''}
              alt={product.name}
              className="max-h-[85%] max-w-[85%] object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
            />

            <button
              onClick={() => setIsZoomOpen(true)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors shadow-sm"
              title="Enlarge view"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl p-2 bg-white border transition-all shrink-0 flex items-center justify-center overflow-hidden ${
                    selectedImageIndex === idx
                      ? 'border-[#0071e3] ring-2 ring-[#0071e3]/20'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Configuration & Purchase Controls (Right: 5 Cols) */}
        <div className="lg:col-span-5 space-y-8 bg-white rounded-3xl p-8 border border-neutral-200/60 shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider font-bold text-blue-600">
                {product.badge || 'MAPPLE Certified'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
                  title="Share product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2 rounded-full transition-colors ${
                    isSaved ? 'text-rose-500 bg-rose-50' : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100'
                  }`}
                  title={isSaved ? 'Saved to wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
              {product.name}
            </h1>
            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              {product.short_description}
            </p>

            {/* Dynamic Price Display */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#1d1d1f] tracking-tight">
                {formatINR(currentPricePaise)}
              </span>
              {product.original_price_paise && (
                <span className="text-sm text-neutral-400 line-through">
                  {formatINR(product.original_price_paise + configDelta)}
                </span>
              )}
              <span className="text-xs text-neutral-500 font-normal">
                (Incl. of all taxes)
              </span>
            </div>

            {/* Stock status indicator */}
            <div className="mt-3 flex items-center gap-2 text-xs">
              {product.stock_quantity > 0 ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-emerald-700 font-medium">
                    {product.stock_quantity <= 5
                      ? `Only ${product.stock_quantity} units remaining in stock`
                      : 'In Stock • Ready to dispatch'}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span className="text-rose-600 font-medium">Currently Backordered</span>
                </>
              )}
            </div>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-neutral-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-neutral-900">Finish:</span>
                <span className="text-neutral-500 font-medium">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center p-0.5 transition-all ${
                      selectedColor === c.name ? 'ring-2 ring-offset-2 ring-blue-600' : 'hover:scale-105'
                    }`}
                    title={c.name}
                  >
                    <span
                      className="w-full h-full rounded-full border border-black/10 shadow-inner"
                      style={{ backgroundColor: c.hex_code }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Configuration Selection */}
          {product.configs && product.configs.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-neutral-100">
              <span className="block text-xs font-semibold text-neutral-900">
                Select Configuration:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.configs.map((conf) => (
                  <button
                    key={conf.id}
                    onClick={() => setSelectedConfig(conf.label)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      selectedConfig === conf.label
                        ? 'border-blue-600 bg-blue-50/40 text-blue-900 font-semibold shadow-sm'
                        : 'border-neutral-200 hover:border-neutral-300 text-neutral-800'
                    }`}
                  >
                    <p className="text-xs font-semibold">{conf.label}</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {conf.price_delta_paise === 0
                        ? 'Standard'
                        : `+${formatINR(conf.price_delta_paise)}`}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
            <span className="text-xs font-semibold text-neutral-900">Quantity</span>
            <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-200 transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 text-xs font-semibold text-neutral-900">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(Math.min(10, product.stock_quantity), q + 1))}
                className="px-3 py-1.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-200 transition-colors"
                disabled={quantity >= Math.min(10, product.stock_quantity)}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity <= 0}
              className="w-full py-4 px-6 rounded-2xl bg-[#0071e3] text-white text-sm font-semibold hover:bg-[#0077ed] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock_quantity <= 0}
              className="w-full py-4 px-6 rounded-2xl bg-[#1d1d1f] text-white text-sm font-semibold hover:bg-neutral-800 transition-all text-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
            >
              Buy Now with Instant Checkout
            </button>
          </div>

          {/* Customer Trust Badges */}
          <div className="pt-4 border-t border-neutral-100 space-y-2.5 text-xs text-neutral-500">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Complimentary express delivery directly to your door</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
              <span>14-day hassle-free returns on eligible hardware</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
              <span>1-Year MAPPLE Care hardware warranty included</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Overview Tabs */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/60 shadow-sm">
        <div className="flex items-center gap-6 border-b border-neutral-200 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('specs')}
            className={`text-sm font-semibold pb-2 border-b-2 transition-all ${
              activeTab === 'specs'
                ? 'border-[#0071e3] text-[#0071e3]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`text-sm font-semibold pb-2 border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-[#0071e3] text-[#0071e3]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveTab('box')}
            className={`text-sm font-semibold pb-2 border-b-2 transition-all ${
              activeTab === 'box'
                ? 'border-[#0071e3] text-[#0071e3]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            What's in the Box
          </button>
        </div>

        {activeTab === 'specs' && (
          <div className="divide-y divide-neutral-100">
            {product.specs && product.specs.length > 0 ? (
              product.specs.map((spec) => (
                <div key={spec.id} className="py-4 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    {spec.group_name} • {spec.spec_name}
                  </span>
                  <span className="md:col-span-2 text-sm font-medium text-neutral-900">
                    {spec.spec_value}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-500 py-4">Standard MAPPLE flagship specifications apply.</p>
            )}
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="prose max-w-none text-neutral-700 text-sm leading-relaxed space-y-4">
            <p>{product.full_description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-[#fbfbfd] p-5 rounded-2xl border border-neutral-100">
                <h4 className="font-semibold text-neutral-900 text-xs uppercase tracking-wider">Materials</h4>
                <p className="text-xs text-neutral-500 mt-1">Aerospace-grade alloys, ceramic shield glass, and sustainable recycled elements.</p>
              </div>
              <div className="bg-[#fbfbfd] p-5 rounded-2xl border border-neutral-100">
                <h4 className="font-semibold text-neutral-900 text-xs uppercase tracking-wider">Acoustic & Haptic</h4>
                <p className="text-xs text-neutral-500 mt-1">Precision linear vibration actuators and high-dynamic-range soundstages.</p>
              </div>
              <div className="bg-[#fbfbfd] p-5 rounded-2xl border border-neutral-100">
                <h4 className="font-semibold text-neutral-900 text-xs uppercase tracking-wider">Privacy & Silicon</h4>
                <p className="text-xs text-neutral-500 mt-1">On-device neural processing ensures customer telemetry and biometric data remain strictly private.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'box' && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" /> Standard In-Box Package
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" /> 1x {product.name} ({selectedColor || 'Device'})
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" /> 1x High-speed braided USB-C charging cord (1m)
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" /> 1x MAPPLE Quick-Start Documentation and Warranty Card
              </li>
            </ul>
          </div>
        )}
      </section>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">
              Recommended Companions
            </h2>
            <Link to="/store" className="text-xs text-[#0071e3] font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((rec) => (
              <ProductCard key={rec.id} product={rec} />
            ))}
          </div>
        </section>
      )}

      {/* Enlarged Zoom Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={images[selectedImageIndex] || ''}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
