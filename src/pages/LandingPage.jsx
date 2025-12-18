import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import FeatureCard from "../components/FeatureCard.jsx";
import StepCard from "../components/StepCard.jsx";
import TestimonialCard from "../components/TestimonialCard.jsx";



const LandingPage = () => (

    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-green-50">
        {/* Background shapes with green theme */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 -left-40 w-80 h-80 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-emerald-100 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 pb-8">

            <Navbar />

            {/* Hero Section - Enhanced */}
            <div className="py-12 sm:py-16 md:py-24 text-center px-2">
                <div className="mb-4 sm:mb-6 inline-block">
                    <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs sm:text-sm font-semibold">
                        🚀 Powered by Blockchain Technology
                    </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-4">
                    Secure Your Academic<br className="hidden sm:block" />
                    <span className="sm:hidden"> </span>Future with{" "}
                    <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        CareerKey
                    </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
                    Revolutionizing degree verification through blockchain technology.
                    <br className="hidden sm:block" />
                    <span className="text-emerald-600 font-semibold">Secure, transparent, and instant</span> verification for students and employers.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center items-center px-4">
                    <Link to="/login"
                        className="w-full sm:w-auto group px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl font-bold hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform">
                        <span className="flex items-center justify-center gap-2">
                            Get Started
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                    </Link>
                    <Link to="/verifier-portal"
                        className="w-full sm:w-auto group px-8 sm:px-10 py-4 sm:py-5 bg-white text-emerald-700 rounded-2xl font-bold hover:bg-emerald-50 transition-all duration-300 shadow-xl hover:shadow-2xl border-2 border-emerald-200 hover:border-emerald-300 hover:scale-105 transform">
                        <span className="flex items-center justify-center gap-2">
                            🔍 Verify a Degree
                        </span>
                    </Link>
                </div>

                {/* Stats Section */}
                <div className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto px-4">
                    <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl shadow-lg border border-emerald-100">
                        <div className="text-3xl sm:text-4xl font-bold text-emerald-600">10K+</div>
                        <div className="text-sm sm:text-base text-gray-600 mt-2">Verified Degrees</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl shadow-lg border border-emerald-100">
                        <div className="text-3xl sm:text-4xl font-bold text-emerald-600">500+</div>
                        <div className="text-sm sm:text-base text-gray-600 mt-2">Partner Institutions</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl shadow-lg border border-emerald-100">
                        <div className="text-3xl sm:text-4xl font-bold text-emerald-600">99.9%</div>
                        <div className="text-sm sm:text-base text-gray-600 mt-2">Accuracy Rate</div>
                    </div>
                </div>
            </div>

            {/* Features Section - Enhanced */}
            <div id="features" className="py-12 sm:py-16 md:py-24 px-4">
                <div className="text-center mb-10 sm:mb-12 md:mb-16">
                    <span className="text-emerald-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">Features</span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-3 mb-3 sm:mb-4 px-4">Why Choose CareerKey?</h2>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                        Experience the future of credential verification with our cutting-edge platform
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    <FeatureCard
                        title="Blockchain Security"
                        description="Your academic credentials are secured by cutting-edge blockchain technology, ensuring tamper-proof verification"
                        icon="🔒"
                    />
                    <FeatureCard
                        title="Instant Verification"
                        description="Verify degrees in seconds, not days or weeks. Save time and reduce friction in the hiring process"
                        icon="⚡"
                    />
                    <FeatureCard
                        title="AI-Powered"
                        description="Smart validation and fraud detection using artificial intelligence and machine learning algorithms"
                        icon="🤖"
                    />
                </div>
            </div>

            {/* How It Works Section - Enhanced */}
            <div id="how-it-works" className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-emerald-50 to-white rounded-2xl sm:rounded-3xl px-4 sm:px-6 md:px-8">
                <div className="text-center mb-10 sm:mb-12 md:mb-16">
                    <span className="text-emerald-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">Process</span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-3 mb-3 sm:mb-4 px-4">How It Works</h2>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                        Get started in three simple steps
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    <StepCard
                        step="1"
                        title="Register"
                        description="Create your account with your academic institution details and complete the quick verification process"
                    />
                    <StepCard
                        step="2"
                        title="Upload"
                        description="Submit your degree for blockchain verification. Our AI system validates it in real-time"
                    />
                    <StepCard
                        step="3"
                        title="Share"
                        description="Share your verified credentials with employers instantly via a secure blockchain-verified link"
                    />
                </div>
            </div>

            {/* Testimonials - Enhanced */}
            <div className="py-12 sm:py-16 md:py-24 px-4">
                <div className="text-center mb-10 sm:mb-12 md:mb-16">
                    <span className="text-emerald-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">Testimonials</span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-3 mb-3 sm:mb-4 px-4">What People Say</h2>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                        Join thousands of satisfied users who trust CareerKey
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
                    <TestimonialCard
                        name="Sarah Johnson"
                        role="Recent Graduate"
                        text="CareerKey made sharing my verified credentials with employers so much easier! I landed my dream job within weeks of graduation."
                    />
                    <TestimonialCard
                        name="Michael Chen"
                        role="HR Manager"
                        text="This platform has streamlined our verification process significantly. We've reduced our hiring time by 60% and eliminated fraud completely."
                    />
                </div>
            </div>

            {/* CTA Section - New */}
            <div className="py-12 sm:py-16 md:py-20 text-center px-4">
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 lg:p-16 shadow-2xl">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-emerald-50 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
                        Join the future of credential verification today. Secure, fast, and reliable.
                    </p>
                    <Link to="/login"
                        className="inline-block w-full sm:w-auto px-8 sm:px-10 md:px-12 py-4 sm:py-5 bg-white text-emerald-600 rounded-2xl font-bold hover:bg-emerald-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform">
                        Create Your Account Now
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    </div>
);

export default LandingPage;
