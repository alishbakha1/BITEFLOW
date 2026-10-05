import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, MapPin, ShoppingBag, Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Restaurants", to: "/restaurants" },
  { label: "Track Order", to: "/tracking" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  const desktopLinkClass = ({ isActive }) =>
    `group relative text-sm font-medium transition-colors ${
      isActive ? "text-white" : "text-white/85 hover:text-white"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive ? "bg-white/10 text-white" : "text-white/85 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 bg-forest transition-shadow ${
        scrolled ? "shadow-lg shadow-black/20" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold font-display text-sm font-bold text-forest">
            B
          </span>
          <span className="font-display text-xl font-bold italic text-white">
            Bite<span className="not-italic text-gold">Flow</span>
          </span>
        </Link>

        {/* Delivery Location */}
        <button className="hidden items-center gap-1.5 text-sm text-white/80 transition-colors hover:text-white lg:flex">
          <MapPin size={16} className="text-gold" />
          <span>
            Deliver to <span className="font-medium text-white">Karachi</span>
          </span>
        </button>

        {/* Desktop Search */}
        <div className="hidden max-w-md flex-1 items-center gap-2 rounded-full bg-white/10 px-4 py-2 transition-colors focus-within:bg-white/15 md:flex">
          <Search size={17} className="shrink-0 text-white/60" />
          <input
            type="text"
            placeholder="Search restaurants or dishes"
            className="w-full bg-transparent text-sm text-white placeholder-white/50 outline-none"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.label} to={link.to} end={link.to === "/"} className={desktopLinkClass}>
              {link.label}
              <span className="absolute -bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-gold transition-all duration-300 group-hover:w-full" />
            </NavLink>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="relative flex items-center justify-center rounded-full p-2 text-white transition-colors hover:bg-white/10"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-forest">
                {totalItems}
              </span>
            )}
          </button>

          {/* Auth area */}
          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <User size={16} />
                {user.name?.split(" ")[0] || "Profile"}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-forest transition hover:brightness-95"
                aria-label="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-forest transition hover:brightness-95 sm:flex"
            >
              <User size={16} />
              Sign in
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center justify-center rounded-full p-2 text-white transition-colors hover:bg-white/10 lg:hidden"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "max-h-[32rem]" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-1 border-t border-white/10 bg-forest px-4 py-4">
          <div className="mb-2 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
            <Search size={17} className="text-white/60" />
            <input
              type="text"
              placeholder="Search restaurants or dishes"
              className="w-full bg-transparent text-sm text-white placeholder-white/50 outline-none"
            />
          </div>

          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === "/"}
              onClick={() => setMobileOpen(false)}
              className={mobileLinkClass}
            >
              {link.label}
            </NavLink>
          ))}

          <Link
            to="/cart"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            Cart {totalItems > 0 && `(${totalItems})`}
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-forest"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-forest"
            >
              <User size={16} />
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}