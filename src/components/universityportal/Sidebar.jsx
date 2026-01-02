import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { id: "dashboard", icon: "📊", label: "Dashboard" },
        { id: "students", icon: "👥", label: "Students" },
        { id: "attestations", icon: "📝", label: "Attestations" },
        { id: "degree-requests", icon: "📜", label: "Degree Requests" },
        { id: "degree-issuance", icon: "🎓", label: "Degree Issuance" },
        { id: "verification", icon: "✅", label: "Verification" },
        { id: "reports", icon: "📄", label: "Reports" },
        { id: "settings", icon: "⚙️", label: "Settings" },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <aside className="w-64 bg-gradient-to-b from-emerald-900 to-green-800 text-white h-screen sticky top-0 shadow-xl flex flex-col">
            <div className="p-6 border-b border-emerald-700">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center font-bold text-xl">
                        CK
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">CareerKey</h2>
                        <p className="text-xs text-emerald-300">University Portal</p>
                    </div>
                </div>
            </div>
            <nav className="p-4 space-y-2 flex-grow">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === item.id
                            ? "bg-white text-emerald-900 font-semibold shadow-lg"
                            : "text-emerald-100 hover:bg-white/10"
                            }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-sm">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-emerald-700">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-200 hover:bg-red-500/20 transition-all font-semibold"
                >
                    <span className="text-xl">🚪</span>
                    <span className="text-sm">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
