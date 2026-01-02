import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, User, LayoutDashboard } from "lucide-react";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

    const isVerifierPortal = location.pathname === '/verifier-portal';
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
    const isSimplifiedNav = isVerifierPortal || isAuthPage;

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        closeMobileMenu();
        navigate('/');
    };

    const getPortalLink = () => {
        // Debugging logs
        console.log("Navbar User:", user);
        console.log("Navbar Roles:", user?.roles);

        if (!user || !user.roles) return "/login";
        const roles = user.roles;

        // Check for specific roles
        if (roles.includes('ROLE_HEC') || roles.includes('HEC')) return "/hec-portal";
        if (roles.includes('ROLE_UNIVERSITY') || roles.includes('UNIVERSITY')) return "/university-portal";
        if (roles.includes('ROLE_STUDENT') || roles.includes('STUDENT')) return "/student-portal";

        console.warn("No matching role found, defaulting to login.");
        return "/login";
    };


    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md border border-emerald-100 rounded-none sm:rounded-2xl">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-2 sm:gap-3" onClick={closeMobileMenu}>
                    <img src={logo} alt="CareerKey logo" className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl object-cover shadow-md" />
                    <div>
                        <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent leading-tight">CareerKey</h1>
                        <p className="text-[10px] sm:text-[11px] text-gray-500 tracking-wide">Blockchain & AI • FYP</p>
                    </div>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-6">
                    <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-emerald-600 transition-colors">
                        Home
                    </Link>

                    {!isSimplifiedNav && (
                        <>
                            <a href="#features" className="text-sm font-semibold text-gray-700 hover:text-emerald-600 transition-colors">
                                Features
                            </a>

                            <a href="#how-it-works" className="text-sm font-semibold text-gray-700 hover:text-emerald-600 transition-colors">
                                How It Works
                            </a>

                            <Link to="/verifier-portal" className="text-sm font-semibold text-gray-700 hover:text-emerald-600 transition-colors">
                                Verify Degree
                            </Link>
                        </>
                    )}

                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link
                                to={getPortalLink()}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-100 hover:bg-emerald-100 transition-all"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                My Portal
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 hover:bg-red-100 transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="ml-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm font-bold shadow-md hover:shadow-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-300 hover:scale-105 transform"
                        >
                            LOGIN / PORTALS
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMobileMenu}
                    className="md:hidden p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition"
                    aria-label="Toggle mobile menu"
                >
                    <svg
                        className={`w-6 h-6 text-emerald-700 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {isMobileMenuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-4 pb-4 pt-2 space-y-3 bg-white/95 backdrop-blur-md border-t border-emerald-100">
                    <Link
                        to="/"
                        className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        onClick={closeMobileMenu}
                    >
                        🏠 Home
                    </Link>

                    {!isSimplifiedNav && (
                        <>
                            <a
                                href="#features"
                                className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                onClick={closeMobileMenu}
                            >
                                ✨ Features
                            </a>

                            <a
                                href="#how-it-works"
                                className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                onClick={closeMobileMenu}
                            >
                                🔄 How It Works
                            </a>

                            <Link
                                to="/verifier-portal"
                                className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                onClick={closeMobileMenu}
                            >
                                🔍 Verify Degree
                            </Link>
                        </>
                    )}

                    {isAuthenticated ? (
                        <>
                            <Link
                                to={getPortalLink()}
                                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                                onClick={closeMobileMenu}
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                My Portal
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="block px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm font-bold shadow-md text-center hover:from-emerald-700 hover:to-green-700 transition-all duration-300"
                            onClick={closeMobileMenu}
                        >
                            🚀 LOGIN / PORTALS
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;



