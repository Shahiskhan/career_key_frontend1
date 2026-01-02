import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { useAuth } from "../../contexts/AuthContext";

const StudentNavbar = ({ activeSection, onNavigate }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-md border border-emerald-100">
            <div className="flex items-center gap-3">
                <img src={logo} alt="CareerKey logo" className="w-11 h-11 rounded-xl object-cover shadow-md" />
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent leading-tight">CareerKey</h1>
                    <p className="text-[11px] text-gray-500 tracking-wide uppercase">Student Portal</p>
                </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
                <button
                    onClick={() => onNavigate('dashboard')}
                    className={`text-sm font-semibold transition-colors ${activeSection === 'dashboard' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
                >
                    Dashboard
                </button>
                <button
                    onClick={() => onNavigate('degree-request')}
                    className={`text-sm font-semibold transition-colors ${activeSection === 'degree-request' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
                >
                    Degree Request
                </button>
                <button
                    onClick={() => onNavigate('jobs')}
                    className={`text-sm font-semibold transition-colors ${activeSection === 'jobs' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
                >
                    Job Recommendations
                </button>
                <button
                    onClick={() => onNavigate('documents')}
                    className={`text-sm font-semibold transition-colors ${activeSection === 'documents' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
                >
                    My Documents
                </button>
                <button
                    onClick={() => onNavigate('profile')}
                    className={`text-sm font-semibold transition-colors ${activeSection === 'profile' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
                >
                    Profile
                </button>
                <button
                    onClick={handleLogout}
                    className="ml-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm font-bold shadow-md hover:shadow-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-300 hover:scale-105 transform"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default StudentNavbar;
