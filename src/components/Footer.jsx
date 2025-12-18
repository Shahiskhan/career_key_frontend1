import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";

const Footer = () => (
    <div className="mt-8 sm:mt-12 px-4 sm:px-6 md:px-8 py-8 sm:py-10 bg-gradient-to-br from-emerald-50 to-white rounded-2xl sm:rounded-3xl shadow-lg border border-emerald-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
            <div className="flex items-center gap-3 sm:gap-4">
                <img src={logo} alt="CareerKey logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover shadow-md" />
                <div>
                    <h3 className="font-bold text-base sm:text-lg bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">CareerKey</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500">Blockchain & AI — FYP</p>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                <Link className="text-xs sm:text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors" to="/">Home</Link>
                <a className="text-xs sm:text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors" href="#features">Features</a>
                <a className="text-xs sm:text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors" href="#how-it-works">How It Works</a>
                <Link className="text-xs sm:text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors" to="/verifier-portal">Verify Degree</Link>
                <Link className="text-xs sm:text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors" to="/student/login">Student Portal</Link>
            </div>

            <div className="text-xs sm:text-sm text-gray-600 text-center md:text-right">
                <div className="font-semibold">© {new Date().getFullYear()} CareerKey</div>
                <div className="text-[10px] sm:text-xs mt-1 text-emerald-600">Final Year Project (BCS)</div>
                <div className="text-[10px] sm:text-xs mt-1">Built with React, Tailwind & Blockchain</div>
            </div>
        </div>
    </div>
);

export default Footer;

