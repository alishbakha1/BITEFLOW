import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaClock, FaUtensils, FaLeaf, FaCoffee, FaPizzaSlice, FaHamburger, FaDrumstickBite, FaPepperHot, FaStore } from 'react-icons/fa';
import { MdDeliveryDining, MdRestaurant, MdSort } from 'react-icons/md';
import { HiOutlineEmojiSad } from 'react-icons/hi';
import RestaurantCard from '../components/RestaurantCard';
import SearchBar from '../components/SearchBar';
import { getRestaurants } from '../services/restaurantService';

const Restaurants = () => {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const categories = ['All', 'Pizza', 'Burger', 'Fast Food', 'Pakistani', 'Chinese', 'BBQ', 'Dessert', 'Healthy', 'Cafe'];

  const categoryIcons = {
    'All': <FaStore />,
    'Pizza': <FaPizzaSlice />,
    'Burger': <FaHamburger />,
    'Fast Food': <FaUtensils />,
    'Pakistani': <FaPepperHot />,
    'Chinese': <FaLeaf />,
    'BBQ': <FaDrumstickBite />,
    'Dessert': <FaCoffee />,
    'Healthy': <FaLeaf />,
    'Cafe': <FaCoffee />
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'highest-rated', label: 'Highest Rated' },
    { value: 'fastest', label: 'Fastest Delivery' },
    { value: 'lowest-fee', label: 'Lowest Delivery Fee' },
    { value: 'alphabetical', label: 'Alphabetical' }
  ];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getRestaurants({ limit: 100 })
      .then((res) => {
        if (!cancelled) setRestaurants(res.data || []);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message || 'Failed to load restaurants');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filteredRestaurants = useMemo(() => {
    let filtered = [...restaurants];

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(searchLower) ||
        (r.description || '').toLowerCase().includes(searchLower) ||
        (r.categories || []).some(c => c.name?.toLowerCase().includes(searchLower))
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(r => (r.categories || []).some(c => c.name === selectedCategory));
    }

    const sorted = [...filtered];
    switch (sortBy) {
      case 'highest-rated': sorted.sort((a, b) => b.rating - a.rating); break;
      case 'fastest': sorted.sort((a, b) => a.deliveryTime - b.deliveryTime); break;
      case 'lowest-fee': sorted.sort((a, b) => a.deliveryFee - b.deliveryFee); break;
      case 'alphabetical': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return sorted;
  }, [restaurants, searchTerm, selectedCategory, sortBy]);

  const statistics = useMemo(() => {
    const total = filteredRestaurants.length;
    const avgRating = total > 0 ? (filteredRestaurants.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : '0.0';
    const openNow = filteredRestaurants.filter(r => r.isOpen).length;
    const fastDelivery = filteredRestaurants.filter(r => r.deliveryTime <= 30).length;
    return { total, avgRating, openNow, fastDelivery };
  }, [filteredRestaurants]);

  const totalPages = Math.max(1, Math.ceil(filteredRestaurants.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const paginatedRestaurants = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRestaurants.slice(start, start + itemsPerPage);
  }, [filteredRestaurants, currentPage]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestaurantClick = (restaurantId) => navigate(`/restaurant/${restaurantId}`);

  const startRange = filteredRestaurants.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endRange = Math.min(currentPage * itemsPerPage, filteredRestaurants.length);

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <section className="relative bg-gradient-to-r from-[#0C3B2E] to-[#6D9773] pt-16 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFBA00] rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#6D9773] rounded-full blur-3xl opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl opacity-10"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center text-white">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              Discover Amazing <span className="text-[#FFBA00]">Flavors</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-6 max-w-2xl mx-auto font-body">
              Explore the best restaurants in your city. From local favorites to global cuisines.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <button
                onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 bg-[#FFBA00] text-[#0C3B2E] rounded-full font-body font-bold hover:bg-[#FFBA00]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                aria-label="Browse restaurants"
              >
                Browse Restaurants
              </button>
              <button
                onClick={() => document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full font-body font-medium hover:bg-white/30 transition-all duration-300 border border-white/30"
                aria-label="Partner with us"
              >
                Partner With Us
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-2">
                <MdRestaurant className="text-[#FFBA00] text-xl" />
                <span className="text-white font-medium">{statistics.total} Restaurants</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-2">
                <FaStar className="text-[#FFBA00] text-xl" />
                <span className="text-white font-medium">{statistics.avgRating} Avg Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="search-section" className="container mx-auto max-w-6xl px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-6">
            <SearchBar
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search by restaurant name, cuisine, or category..."
              className="w-full"
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => { setSelectedCategory(category); setCurrentPage(1); }}
                  className={`flex-shrink-0 px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === category
                      ? 'bg-[#0C3B2E] text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-label={`Filter by ${category}`}
                  title={`Show ${category} restaurants`}
                >
                  {categoryIcons[category] && <span className="text-current">{categoryIcons[category]}</span>}
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 font-body">
              <MdSort className="text-[#6D9773] text-xl" aria-hidden="true" />
              <label htmlFor="sort-select" className="sr-only">Sort by</label>
              <span>Sort by:</span>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="ml-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white focus:border-[#0C3B2E] focus:ring-2 focus:ring-[#0C3B2E]/20 outline-none transition-all duration-200"
                aria-label="Sort restaurants"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-500 font-body">
              {filteredRestaurants.length > 0
                ? `Showing ${startRange}–${endRange} of ${filteredRestaurants.length} restaurants`
                : 'No restaurants found'}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="bg-[#0C3B2E]/10 p-3 rounded-full"><MdRestaurant className="text-[#0C3B2E] text-2xl" /></div>
              <div><p className="text-sm text-gray-500 font-body">Total</p><p className="text-xl font-display font-bold text-[#0C3B2E]">{statistics.total}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="bg-[#FFBA00]/10 p-3 rounded-full"><FaStar className="text-[#FFBA00] text-2xl" /></div>
              <div><p className="text-sm text-gray-500 font-body">Avg Rating</p><p className="text-xl font-display font-bold text-[#0C3B2E]">{statistics.avgRating}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="bg-[#6D9773]/10 p-3 rounded-full"><FaClock className="text-[#6D9773] text-2xl" /></div>
              <div><p className="text-sm text-gray-500 font-body">Open Now</p><p className="text-xl font-display font-bold text-[#0C3B2E]">{statistics.openNow}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="bg-[#0C3B2E]/10 p-3 rounded-full"><MdDeliveryDining className="text-[#0C3B2E] text-2xl" /></div>
              <div><p className="text-sm text-gray-500 font-body">Fast Delivery</p><p className="text-xl font-display font-bold text-[#0C3B2E]">{statistics.fastDelivery}</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-12">
        {loading ? (
          <div className="text-center py-16 text-gray-500 font-body">Loading restaurants…</div>
        ) : loadError ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <p className="text-red-500 font-body">Couldn't load restaurants: {loadError}</p>
            <p className="text-gray-500 font-body text-sm mt-2">Make sure the backend is running on port 5000.</p>
          </div>
        ) : paginatedRestaurants.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} onClick={() => handleRestaurantClick(restaurant._id)} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-12" role="navigation" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-body text-sm font-medium transition-all duration-200 ${
                    currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-[#0C3B2E] hover:bg-[#0C3B2E] hover:text-white shadow-md hover:shadow-lg'
                  }`}
                  aria-label="Previous page"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  const isActive = page === currentPage;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-body text-sm font-medium transition-all duration-200 ${
                        isActive ? 'bg-[#0C3B2E] text-white shadow-lg transform scale-110' : 'bg-white text-[#0C3B2E] hover:bg-[#0C3B2E] hover:text-white shadow-md hover:shadow-lg'
                      }`}
                      aria-label={`Go to page ${page}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-body text-sm font-medium transition-all duration-200 ${
                    currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-[#0C3B2E] hover:bg-[#0C3B2E] hover:text-white shadow-md hover:shadow-lg'
                  }`}
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="flex justify-center mb-6">
              <div className="bg-[#0C3B2E]/5 p-8 rounded-full relative">
                <HiOutlineEmojiSad className="text-6xl text-[#0C3B2E] opacity-50" />
                <div className="absolute -bottom-2 -right-2 text-4xl">🍽️</div>
              </div>
            </div>
            <h3 className="font-display text-3xl font-bold text-[#0C3B2E] mb-3">No Restaurants Found</h3>
            <p className="text-gray-500 font-body max-w-md mx-auto mb-8 text-lg">
              We couldn't find any restaurants matching your criteria. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={resetFilters}
              className="px-8 py-3 bg-[#0C3B2E] text-white rounded-full font-body font-medium hover:bg-[#0C3B2E]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              aria-label="Reset all filters"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      <section id="cta-section" className="container mx-auto max-w-6xl px-4 pb-12">
        <div className="relative bg-gradient-to-r from-[#0C3B2E] to-[#6D9773] rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFBA00] rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 p-8 md:p-12 text-center text-white">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Become a <span className="text-[#FFBA00]">Restaurant Partner</span>
            </h2>
            <p className="text-white/90 font-body max-w-2xl mx-auto mb-6 text-lg">
              Join thousands of restaurants already growing their business with BiteFlow. Reach more customers and increase your revenue.
            </p>
            <button className="px-8 py-3 bg-[#FFBA00] text-[#0C3B2E] rounded-full font-body font-bold hover:bg-[#FFBA00]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105" aria-label="Partner with BiteFlow">
              Get Started Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Restaurants;