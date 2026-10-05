import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Star,
  Clock,
  Heart,
  Bike,
  Pizza as PizzaIcon,
  Truck,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Quote,
  Apple,
  PlayCircle,
  Navigation,
  X,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Temporary data — will be replaced by GET /api/categories, /api/restaurants,
// /api/deals, /api/testimonials once the Express backend is connected.
// ---------------------------------------------------------------------------

const categories = [
  { id: 1, name: "Pizza", icon: "🍕" },
  { id: 2, name: "Burgers", icon: "🍔" },
  { id: 3, name: "Sushi", icon: "🍣" },
  { id: 4, name: "Biryani", icon: "🍛" },
  { id: 5, name: "Desserts", icon: "🍰" },
  { id: 6, name: "Healthy", icon: "🥗" },
  { id: 7, name: "Drinks", icon: "🥤" },
  { id: 8, name: "Asian", icon: "🥡" },
];

const restaurants = [
  {
    id: 1,
    name: "Nonna's Table",
    cuisine: "Italian · Pizza",
    rating: 4.9,
    distance: "1.2 km",
    time: "20-30 min",
    price: "$$",
    promo: "20% OFF",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Smoke & Bun",
    cuisine: "American · Burgers",
    rating: 4.8,
    distance: "0.8 km",
    time: "15-25 min",
    price: "$$",
    promo: "Free Delivery",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Sakura House",
    cuisine: "Japanese · Sushi",
    rating: 4.9,
    distance: "2.4 km",
    time: "25-35 min",
    price: "$$$",
    promo: null,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Spice Route",
    cuisine: "Desi · Biryani",
    rating: 4.7,
    distance: "1.6 km",
    time: "20-30 min",
    price: "$",
    promo: "Buy 1 Get 1",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
  },
];

const deals = [
  {
    id: 1,
    title: "20% OFF",
    subtitle: "On your first three orders",
    gradient: "from-[#0C3B2E] via-[#12513F] to-[#1B6B52]",
    icon: "🍕",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Free Delivery",
    subtitle: "On orders above $25 all week",
    gradient: "from-[#FFBA00] via-[#FFA800] to-[#FF8A00]",
    icon: "🛵",
    image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Buy 1 Get 1",
    subtitle: "Selected restaurants near you",
    gradient: "from-[#1B6B52] via-[#0C3B2E] to-[#08251C]",
    icon: "🍔",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
  },
];

const nearYou = [
  {
    id: 1,
    name: "Green Bowl Co.",
    tag: "Salads & Bowls",
    time: "10 min",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "Dumpling Bar",
    tag: "Chinese",
    time: "18 min",
    image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "Taco Fiesta",
    tag: "Mexican",
    time: "22 min",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "Le Croissant",
    tag: "Bakery & Cafe",
    time: "12 min",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
  },
];

const testimonials = [
  {
    id: 1,
    name: "Amelia Cross",
    role: "Verified Customer",
    quote:
      "Every order arrives hot, fast, and exactly as pictured. BiteFlow completely changed how our family eats on busy nights.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 2,
    name: "Daniel Osei",
    role: "Verified Customer",
    quote:
      "The live tracking is scarily accurate and the app feels genuinely premium. It's the only delivery app I keep on my home screen.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 3,
    name: "Priya Nair",
    role: "Verified Customer",
    quote:
      "Restaurant quality is consistently excellent. I've discovered so many hidden gems in my neighborhood I never knew existed.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  },
];

const CITY_SUGGESTIONS = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan"];

// ---------------------------------------------------------------------------

function SectionEyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#0C3B2E]/10 bg-[#0C3B2E]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#0C3B2E]">
      {children}
    </span>
  );
}

export default function Home() {
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [locating, setLocating] = useState(false);
  const navigate = useNavigate();

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const city =
            data?.address?.city || data?.address?.town || data?.address?.state || "Current location";
          setLocation(city);
        } catch {
          setLocation("Current location");
        } finally {
          setLocating(false);
          setShowLocationPopup(false);
        }
      },
      () => {
        setLocating(false);
      }
    );
  };

  const handleFindFood = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (location.trim()) params.set("location", location.trim());
    navigate(`/restaurants?${params.toString()}`);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F4] text-[#0C3B2E] font-sans antialiased overflow-x-hidden selection:bg-[#FFBA00]/40">
      {/* ================= SECTION 1 — HERO ================= */}
      <section className="relative isolate overflow-hidden pt-28 pb-24 md:pt-36 md:pb-32">
        {/* background blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-32 h-[32rem] w-[32rem] rounded-full bg-[#0C3B2E]/20 blur-[110px]" />
          <div className="absolute top-10 -right-40 h-[36rem] w-[36rem] rounded-full bg-[#FFBA00]/25 blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full bg-[#1B6B52]/15 blur-[100px]" />
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2 md:px-10">
          {/* Left */}
          <div className="relative z-10 animate-[fadeUp_0.9s_ease_forwards] opacity-0" style={{ animationDelay: "0.1s" }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0C3B2E]/10 bg-white/60 px-4 py-2 text-sm font-medium text-[#0C3B2E] shadow-sm backdrop-blur-md">
              <Sparkles size={16} className="text-[#FFBA00]" />
              Now delivering in 40+ cities
            </div>

            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-[#0C3B2E] sm:text-6xl lg:text-7xl">
              Deliver Happiness,
              <br />
              Not Just{" "}
              <span className="bg-gradient-to-r from-[#FFBA00] via-[#FFD166] to-[#FFBA00] bg-clip-text text-transparent">
                Food.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#0C3B2E]/70">
              From your favorite neighborhood spot to the city's best-kept secrets —
              order in seconds and watch it arrive, fresh and fast, right to your door.
            </p>

            {/* search bar */}
            <div className="mt-10 rounded-[28px] border border-white/60 bg-white/70 p-3 shadow-[0_20px_60px_-15px_rgba(12,59,46,0.25)] backdrop-blur-xl relative">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex flex-1 items-center gap-3 rounded-2xl bg-[#FAF8F4] px-4 py-3.5">
                  <MapPin size={18} className="shrink-0 text-[#FFBA00]" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onFocus={() => setShowLocationPopup(true)}
                    placeholder="Delivery location"
                    className="w-full bg-transparent text-sm font-medium text-[#0C3B2E] placeholder:text-[#0C3B2E]/40 focus:outline-none"
                  />

                  {showLocationPopup && (
                    <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 rounded-2xl border border-black/5 bg-white p-4 shadow-2xl">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#0C3B2E]">Choose delivery location</span>
                        <button
                          onClick={() => setShowLocationPopup(false)}
                          className="text-[#0C3B2E]/40 hover:text-[#0C3B2E]"
                          aria-label="Close"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <button
                        onClick={handleUseCurrentLocation}
                        disabled={locating}
                        className="mb-3 flex w-full items-center gap-2 rounded-xl bg-[#0C3B2E]/5 px-3 py-2.5 text-sm font-medium text-[#0C3B2E] hover:bg-[#0C3B2E]/10 disabled:opacity-60"
                      >
                        <Navigation size={15} className="text-[#FFBA00]" />
                        {locating ? "Locating…" : "Use my current location"}
                      </button>

                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#0C3B2E]/40">
                        Popular cities
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {CITY_SUGGESTIONS.map((city) => (
                          <button
                            key={city}
                            onClick={() => {
                              setLocation(city);
                              setShowLocationPopup(false);
                            }}
                            className="rounded-full border border-[#0C3B2E]/10 px-3 py-1.5 text-xs font-medium text-[#0C3B2E] hover:bg-[#0C3B2E]/5"
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="hidden h-8 w-px bg-[#0C3B2E]/10 sm:block" />
                <div className="flex flex-1 items-center gap-3 rounded-2xl bg-[#FAF8F4] px-4 py-3.5">
                  <Search size={18} className="shrink-0 text-[#0C3B2E]/40" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleFindFood()}
                    placeholder="Search dishes, cuisines..."
                    className="w-full bg-transparent text-sm font-medium text-[#0C3B2E] placeholder:text-[#0C3B2E]/40 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleFindFood}
                  className="group flex items-center justify-center gap-2 rounded-2xl bg-[#0C3B2E] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#0a2f24] hover:shadow-[0_10px_30px_-8px_rgba(12,59,46,0.6)] active:scale-95"
                >
                  Find Food
                  <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* badges */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 rounded-2xl border border-white/60 bg-white/60 px-4 py-2.5 text-sm font-medium shadow-sm backdrop-blur-md">
                <Clock size={16} className="text-[#0C3B2E]" />
                Avg. 25 min delivery
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-white/60 bg-white/60 px-4 py-2.5 text-sm font-medium shadow-sm backdrop-blur-md">
                <Star size={16} className="fill-[#FFBA00] text-[#FFBA00]" />
                4.8 rating
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-white/60 bg-white/60 px-4 py-2.5 text-sm font-medium shadow-sm backdrop-blur-md">
                <ShieldCheck size={16} className="text-[#0C3B2E]" />
                50k+ orders delivered
              </div>
            </div>
          </div>

          {/* Right — floating image composition */}
          <div className="relative z-10 h-[520px] w-full">
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#FFBA00]/30 to-[#0C3B2E]/20 blur-3xl" />

            {/* heroPizza */}
            <div className="absolute left-2 top-6 w-44 rotate-[-8deg] animate-[float_6s_ease-in-out_infinite] overflow-hidden rounded-[28px] border border-white/60 bg-white/50 p-2 shadow-2xl backdrop-blur-md">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80"
                alt="Pizza"
                className="aspect-square w-full rounded-[22px] object-cover"
              />
            </div>

            {/* heroBurger */}
            <div
              className="absolute right-0 top-16 w-40 rotate-[10deg] animate-[float_7s_ease-in-out_infinite] overflow-hidden rounded-[26px] border border-white/60 bg-white/50 p-2 shadow-2xl backdrop-blur-md"
              style={{ animationDelay: "0.6s" }}
            >
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80"
                alt="Burger"
                className="aspect-square w-full rounded-[20px] object-cover"
              />
            </div>

            {/* heroSushi */}
            <div
              className="absolute left-10 bottom-24 w-36 rotate-[6deg] animate-[float_8s_ease-in-out_infinite] overflow-hidden rounded-[24px] border border-white/60 bg-white/50 p-2 shadow-2xl backdrop-blur-md"
              style={{ animationDelay: "1.1s" }}
            >
              <img
                src="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=400&q=80"
                alt="Sushi"
                className="aspect-square w-full rounded-[18px] object-cover"
              />
            </div>

            {/* heroBiryani */}
            <div
              className="absolute right-4 bottom-6 w-48 rotate-[-6deg] animate-[float_6.5s_ease-in-out_infinite] overflow-hidden rounded-[28px] border border-white/60 bg-white/50 p-2 shadow-2xl backdrop-blur-md"
              style={{ animationDelay: "0.3s" }}
            >
              <img
                src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80"
                alt="Biryani"
                className="aspect-square w-full rounded-[22px] object-cover"
              />
            </div>

            {/* heroDessert */}
            <div
              className="absolute left-1/2 top-1/2 w-32 -translate-x-1/2 -translate-y-1/2 rotate-[3deg] animate-[float_9s_ease-in-out_infinite] overflow-hidden rounded-[22px] border border-white/70 bg-white/60 p-2 shadow-2xl backdrop-blur-md"
              style={{ animationDelay: "1.5s" }}
            >
              <img
                src="https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=300&q=80"
                alt="Dessert"
                className="aspect-square w-full rounded-[16px] object-cover"
              />
            </div>

            {/* decorative floating icons */}
            <div className="absolute -left-4 bottom-1/3 flex h-12 w-12 animate-[float_5s_ease-in-out_infinite] items-center justify-center rounded-2xl bg-[#0C3B2E] text-white shadow-xl">
              <Bike size={20} />
            </div>
            <div
              className="absolute right-8 top-4 flex h-11 w-11 animate-[float_6s_ease-in-out_infinite] items-center justify-center rounded-2xl bg-[#FFBA00] text-[#0C3B2E] shadow-xl"
              style={{ animationDelay: "0.8s" }}
            >
              <MapPin size={18} />
            </div>
            <div
              className="absolute bottom-2 left-1/3 flex h-10 w-10 animate-[float_7s_ease-in-out_infinite] items-center justify-center rounded-xl bg-white text-[#0C3B2E] shadow-xl"
              style={{ animationDelay: "1.2s" }}
            >
              <PizzaIcon size={16} />
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2 — CATEGORIES ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <SectionEyebrow>Browse</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              What are you craving?
            </h2>
          </div>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-4 lg:grid-cols-8 md:overflow-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/restaurants?category=${encodeURIComponent(cat.name)}`)}
              className="group flex min-w-[130px] flex-col items-center gap-3 rounded-[26px] border border-[#0C3B2E]/8 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#FFBA00]/40 hover:shadow-[0_20px_40px_-12px_rgba(12,59,46,0.25)]"
            >
              <span className="text-4xl transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6">
                {cat.icon}
              </span>
              <span className="text-sm font-semibold text-[#0C3B2E]">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ================= SECTION 3 — POPULAR RESTAURANTS ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <SectionEyebrow>Handpicked</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Popular restaurants
            </h2>
          </div>
          <button
            onClick={() => navigate("/restaurants")}
            className="hidden items-center gap-1 text-sm font-semibold text-[#0C3B2E] transition hover:text-[#FFBA00] sm:flex"
          >
            View all <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {restaurants.map((r) => (
            <div
              key={r.id}
              className="group overflow-hidden rounded-[28px] border border-[#0C3B2E]/8 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(12,59,46,0.3)]"
            >
              <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#0C3B2E]/10 to-[#FFBA00]/20">
                <img
                  src={r.image}
                  alt={r.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 transition-opacity duration-500 group-hover:opacity-80" />

                {r.promo && (
                  <span className="absolute left-0 top-4 rounded-r-full bg-[#FFBA00] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#0C3B2E] shadow-md">
                    {r.promo}
                  </span>
                )}

                <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#0C3B2E] backdrop-blur-md transition hover:bg-white hover:text-[#FF4D4D]">
                  <Heart size={16} />
                </button>

                <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-[#0C3B2E] shadow backdrop-blur-md">
                  <Star size={12} className="fill-[#FFBA00] text-[#FFBA00]" />
                  {r.rating}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-[#0C3B2E]">{r.name}</h3>
                <p className="mt-1 text-sm text-[#0C3B2E]/60">{r.cuisine}</p>
                <div className="mt-4 flex items-center justify-between text-xs font-medium text-[#0C3B2E]/70">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} /> {r.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} /> {r.time}
                  </span>
                  <span>{r.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SECTION 4 — TODAY'S DEALS ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <SectionEyebrow>Limited time</SectionEyebrow>
        <h2 className="mt-4 mb-10 text-3xl font-semibold tracking-tight sm:text-4xl">
          Today's deals
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className={`group relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br ${deal.gradient} p-8 shadow-[0_25px_50px_-15px_rgba(12,59,46,0.4)] transition-transform duration-500 hover:scale-[1.02]`}
            >
              <img
                src={deal.image}
                alt={deal.title}
                className="absolute inset-0 h-full w-full object-cover opacity-25 transition-transform duration-700 group-hover:scale-110"
              />
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl transition-transform duration-700 group-hover:scale-125" />
              <div className="relative z-10 flex h-40 flex-col justify-between text-white">
                <span className="text-4xl">{deal.icon}</span>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">{deal.title}</h3>
                  <p className="mt-1 text-sm text-white/80">{deal.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SECTION 5 — WHY BITEFLOW ================= */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#0C3B2E]/5 via-transparent to-transparent" />
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-14 text-center">
            <SectionEyebrow>Why us</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Why BiteFlow
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: Truck,
                title: "Fast delivery",
                desc: "Optimized routes and nearby couriers get your order to you in record time, every time.",
              },
              {
                icon: MapPin,
                title: "Live tracking",
                desc: "Watch your order move in real time, from the kitchen to your doorstep, down to the minute.",
              },
              {
                icon: Sparkles,
                title: "Best restaurants",
                desc: "A curated network of the city's most loved kitchens, vetted for quality and consistency.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="group rounded-[28px] border border-[#0C3B2E]/8 bg-white/70 p-8 shadow-sm backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_-15px_rgba(12,59,46,0.25)]"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0C3B2E] text-[#FFBA00] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-semibold text-[#0C3B2E]">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#0C3B2E]/65">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 6 — POPULAR NEAR YOU ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <SectionEyebrow>Nearby</SectionEyebrow>
        <h2 className="mt-4 mb-10 text-3xl font-semibold tracking-tight sm:text-4xl">
          Popular near you
        </h2>

        <div className="flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {nearYou.map((item, i) => (
            <div
              key={item.id}
              className={`group relative min-w-[260px] shrink-0 overflow-hidden rounded-[26px] border border-[#0C3B2E]/8 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${
                i % 2 === 0 ? "sm:min-w-[280px]" : "sm:min-w-[260px] sm:mt-6"
              }`}
            >
              <div className="relative h-36 overflow-hidden bg-gradient-to-br from-[#1B6B52]/20 to-[#FFBA00]/25">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#0C3B2E]">{item.name}</h3>
                <div className="mt-1 flex items-center justify-between text-xs text-[#0C3B2E]/60">
                  <span>{item.tag}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {item.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SECTION 7 — TESTIMONIALS ================= */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute -left-32 top-10 -z-10 h-96 w-96 rounded-full bg-[#0C3B2E]/10 blur-[100px]" />
        <div className="pointer-events-none absolute -right-32 bottom-10 -z-10 h-96 w-96 rounded-full bg-[#FFBA00]/20 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-14 text-center">
            <SectionEyebrow>Loved by thousands</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              What people are saying
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="rounded-[28px] border border-white/60 bg-white/60 p-8 shadow-[0_20px_50px_-20px_rgba(12,59,46,0.3)] backdrop-blur-xl transition-transform duration-500 hover:-translate-y-1"
              >
                <Quote size={28} className="mb-4 text-[#FFBA00]" />
                <p className="text-sm leading-relaxed text-[#0C3B2E]/80">{t.quote}</p>

                <div className="mt-6 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#0C3B2E]">{t.name}</p>
                    <p className="text-xs text-[#0C3B2E]/50">{t.role}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={13} className="fill-[#FFBA00] text-[#FFBA00]" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ================= SECTION 9 — FOOTER CTA ================= */}
      <section className="relative overflow-hidden px-6 pb-24 md:px-10">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-[#FAF8F4] p-14 text-center shadow-[0_30px_70px_-25px_rgba(12,59,46,0.35)]">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#FFBA00]/30 to-[#0C3B2E]/20 blur-[110px]" />
          </div>

          <span className="text-5xl">🍽️</span>
          <h2 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Hungry? Let's order something amazing.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[#0C3B2E]/60">
            Thousands of dishes, hundreds of restaurants, one tap away.
          </p>

          <button
            onClick={() => navigate("/restaurants")}
            className="group mt-10 inline-flex items-center gap-2 rounded-2xl bg-[#0C3B2E] px-8 py-4 text-base font-semibold text-white shadow-[0_15px_40px_-10px_rgba(12,59,46,0.6)] transition-all duration-300 hover:shadow-[0_20px_50px_-10px_rgba(12,59,46,0.7)] active:scale-95"
          >
            Order Now
            <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}