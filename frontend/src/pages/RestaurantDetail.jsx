import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaStar, FaClock, FaHeart, FaShare,
  FaPlus, FaMinus, FaShoppingCart, FaMapMarkerAlt,
  FaPhone, FaChevronLeft, FaChevronRight,
  FaRegHeart, FaRegStar, FaStarHalfAlt
} from 'react-icons/fa';
import { MdDeliveryDining, MdRestaurant, MdAccessTime } from 'react-icons/md';
import { BsTruck } from 'react-icons/bs';
import FoodCard from '../components/FoodCard';
import { useCart } from '../context/CartContext';
import { getRestaurantById } from '../services/restaurantService';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const categoryRefs = useRef({});
  const menuRef = useRef(null);
  const { items: cartItems, addItem: addToCart, removeItem: removeFromCart, totalPrice: getTotalPriceValue } = useCart();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getRestaurantById(id)
      .then((res) => {
        if (cancelled) return;
        setRestaurantData(res.restaurant);
        setMenuItems(res.menuItems || []);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message || 'Failed to load restaurant');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  const restaurant = {
    id: restaurantData?._id,
    name: restaurantData?.name ?? 'Loading…',
    coverImage: restaurantData?.image || FALLBACK_IMG,
    logo: restaurantData?.logo || restaurantData?.image || FALLBACK_IMG,
    cuisine: restaurantData?.categories?.map(c => c.name).join(' • ') || '',
    rating: restaurantData?.rating ?? 0,
    reviewsCount: restaurantData?.numReviews ?? 0,
    deliveryTime: restaurantData?.deliveryTime ?? 30,
    deliveryFee: restaurantData?.deliveryFee ?? 0,
    minimumOrder: restaurantData?.minimumOrder ?? 0,
    isOpen: restaurantData?.isOpen ?? true,
    description: restaurantData?.description ?? '',
    address: restaurantData?.address ?? '',
    phone: '+92 300 0000000',
    openingHours: '11:00 AM - 11:00 PM',
  };

  // Build tabs from whatever categories actually exist on this restaurant's menu items
  const menuCategories = useMemo(() => {
    const names = new Set(menuItems.map(i => i.category?.name).filter(Boolean));
    return ['All', ...Array.from(names)];
  }, [menuItems]);

  const getFilteredItems = (category) =>
    category === 'All' ? menuItems : menuItems.filter(i => i.category?.name === category);

  const getTotalItems = () => cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const getTotalPrice = () => getTotalPriceValue;

  const scrollToCategory = (category) => {
    setActiveCategory(category);
    categoryRefs.current[category]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!menuRef.current) return;
      let active = menuCategories[0];
      for (const cat of menuCategories) {
        const ref = categoryRefs.current[cat];
        if (ref && ref.getBoundingClientRect().top <= 150) active = cat;
      }
      setActiveCategory(active);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuCategories]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={`full-${i}`} className="text-[#FFBA00] text-sm" />);
    if (hasHalfStar) stars.push(<FaStarHalfAlt key="half" className="text-[#FFBA00] text-sm" />);
    for (let i = stars.length; i < 5; i++) stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300 text-sm" />);
    return stars;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 font-body">Loading restaurant…</div>;
  }

  if (loadError || !restaurantData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-red-500 font-body">Couldn't load this restaurant{loadError ? `: ${loadError}` : '.'}</p>
        <button onClick={() => navigate('/restaurants')} className="px-6 py-2 bg-[#0C3B2E] text-white rounded-full font-body">
          Back to Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-24 left-4 md:left-8 z-50 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        aria-label="Go back"
      >
        <FaChevronLeft className="text-[#0C3B2E] text-xl" />
      </button>

      <section className="relative">
        <div className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
          <img src={restaurant.coverImage} alt={restaurant.name} className="w-full h-full object-cover"
               onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute top-6 right-4 md:right-8 flex gap-3 z-10">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              aria-label="Toggle favorite"
            >
              {isFavorite ? <FaHeart className="text-red-500 text-xl" /> : <FaRegHeart className="text-[#0C3B2E] text-xl" />}
            </button>
            <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110" aria-label="Share restaurant">
              <FaShare className="text-[#0C3B2E] text-xl" />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12 text-white">
            <div className="container mx-auto max-w-6xl">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-2xl border-4 border-white flex-shrink-0">
                  <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover"
                       onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold">{restaurant.name}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${restaurant.isOpen ? 'bg-green-500' : 'bg-red-500'}`}>
                      {restaurant.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                  </div>
                  <p className="text-white/80 text-base md:text-lg mb-2">{restaurant.cuisine}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-0.5">{renderStars(restaurant.rating)}</div>
                      <span className="font-medium ml-1">{restaurant.rating}</span>
                      <span className="text-white/60">({restaurant.reviewsCount} reviews)</span>
                    </div>
                    <span className="text-white/40">|</span>
                    <div className="flex items-center gap-1"><FaClock className="text-white/60" /><span>{restaurant.deliveryTime} min</span></div>
                    <span className="text-white/40">|</span>
                    <div className="flex items-center gap-1"><MdDeliveryDining className="text-white/60" /><span>Rs {restaurant.deliveryFee}</span></div>
                    <span className="text-white/40">|</span>
                    <div className="flex items-center gap-1"><MdRestaurant className="text-white/60" /><span>Min Rs {restaurant.minimumOrder}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md py-4 px-4 md:px-8">
          <div className="container mx-auto max-w-6xl">
            <p className="text-gray-600 font-body text-sm md:text-base">{restaurant.description}</p>
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-40 bg-white shadow-md border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center overflow-x-auto py-3 gap-2 scrollbar-hide">
            {menuCategories.map((category) => (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-300 ${
                  activeCategory === category ? 'bg-[#0C3B2E] text-white shadow-lg transform scale-105' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section ref={menuRef} className="container mx-auto max-w-6xl px-4 py-8">
        {menuCategories.map((category) => {
          const items = getFilteredItems(category);
          if (items.length === 0 || category === 'All') return null;
          return (
            <div key={category} ref={el => (categoryRefs.current[category] = el)} className="mb-12 scroll-mt-24">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0C3B2E] mb-6">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item) => {
                  const cartItem = cartItems.find(c => c.id === item._id);
                  return (
                    <div key={item._id} className="relative">
                      <FoodCard food={{ ...item, id: item._id }} onAddToCart={() => addToCart({ ...item, id: item._id })} />
                      {cartItem && (
                        <div className="absolute bottom-4 right-4 bg-white rounded-full shadow-lg border border-gray-200 flex items-center">
                          <button onClick={() => removeFromCart(item._id)} className="w-8 h-8 flex items-center justify-center text-[#0C3B2E] hover:bg-gray-100 rounded-l-full transition-colors" aria-label="Decrease quantity">
                            <FaMinus className="text-xs" />
                          </button>
                          <span className="w-8 text-center font-medium text-sm">{cartItem.quantity}</span>
                          <button onClick={() => addToCart({ ...item, id: item._id })} className="w-8 h-8 flex items-center justify-center text-[#0C3B2E] hover:bg-gray-100 rounded-r-full transition-colors" aria-label="Increase quantity">
                            <FaPlus className="text-xs" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {menuItems.length === 0 && (
          <p className="text-center text-gray-500 font-body py-12">This restaurant hasn't added menu items yet.</p>
        )}
      </section>

      <section className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0C3B2E] mb-8">Restaurant Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <MdAccessTime className="text-[#6D9773] text-2xl flex-shrink-0 mt-1" />
              <div><h4 className="font-body font-semibold text-[#0C3B2E]">Opening Hours</h4><p className="text-gray-600 text-sm">{restaurant.openingHours}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-[#6D9773] text-2xl flex-shrink-0 mt-1" />
              <div><h4 className="font-body font-semibold text-[#0C3B2E]">Address</h4><p className="text-gray-600 text-sm">{restaurant.address}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <FaPhone className="text-[#6D9773] text-2xl flex-shrink-0 mt-1" />
              <div><h4 className="font-body font-semibold text-[#0C3B2E]">Phone</h4><p className="text-gray-600 text-sm">{restaurant.phone}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <BsTruck className="text-[#6D9773] text-2xl flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-body font-semibold text-[#0C3B2E]">Delivery</h4>
                <p className="text-gray-600 text-sm">{restaurant.deliveryTime} min • Rs {restaurant.deliveryFee}<br />Min. Rs {restaurant.minimumOrder}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {cartItems.length > 0 && (
        <button onClick={() => setShowCart(!showCart)} className="fixed bottom-6 right-6 md:hidden z-50 bg-[#0C3B2E] text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110" aria-label="Open cart">
          <div className="relative">
            <FaShoppingCart className="text-2xl" />
            <span className="absolute -top-2 -right-2 bg-[#FFBA00] text-[#0C3B2E] text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">{getTotalItems()}</span>
          </div>
        </button>
      )}

      {showCart && cartItems.length > 0 && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCart(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6 max-h-[70vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-[#0C3B2E]">Your Order</h3>
              <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-700" aria-label="Close cart">
                <FaChevronRight className="text-xl" />
              </button>
            </div>
            <div className="space-y-4 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h4 className="font-body font-medium text-sm">{item.name}</h4>
                    <p className="text-[#0C3B2E] font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
                    <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 flex items-center justify-center text-[#0C3B2E] hover:bg-gray-200 rounded-full transition-colors"><FaMinus className="text-xs" /></button>
                    <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center text-[#0C3B2E] hover:bg-gray-200 rounded-full transition-colors"><FaPlus className="text-xs" /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-body font-semibold">Total</span>
                <span className="font-display text-2xl font-bold text-[#0C3B2E]">${getTotalPrice().toFixed(2)}</span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#FFBA00] text-[#0C3B2E] py-3 rounded-full font-body font-bold hover:bg-[#FFBA00]/90 transition-all duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="hidden md:block fixed bottom-8 right-8 z-40 bg-white rounded-2xl shadow-2xl p-6 min-w-[300px] max-w-[400px] border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-[#0C3B2E] flex items-center gap-2"><FaShoppingCart className="text-[#FFBA00]" />Your Order</h3>
            <span className="bg-[#0C3B2E] text-white px-3 py-1 rounded-full text-sm font-medium">{getTotalItems()} items</span>
          </div>
          <div className="max-h-[200px] overflow-y-auto space-y-3 mb-4">
            {cartItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.quantity}x {item.name}</span>
                <span className="text-[#0C3B2E] font-bold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            {cartItems.length > 3 && <p className="text-gray-500 text-sm">+{cartItems.length - 3} more items</p>}
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-body font-semibold">Total</span>
              <span className="font-display text-2xl font-bold text-[#0C3B2E]">${getTotalPrice().toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#FFBA00] text-[#0C3B2E] py-3 rounded-full font-body font-bold hover:bg-[#FFBA00]/90 transition-all duration-300 hover:scale-105 transform"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;