import React from "react";

const menus = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "pending", icon: "🕒", label: "Request Status" },
    { id: "verified", icon: "✅", label: "Verified Requests" },
    { id: "logs", icon: "🗒️", label: "Audit Logs" },
    { id: "charts", icon: "📊", label: "Analytics" },
    { id: "register", icon: "🏫", label: "Register University" },
];

const Sidebar = ({ activeTab, setActiveTab }) => (
    <aside className="w-72 h-screen bg-gradient-to-b from-emerald-900 to-green-800 text-white shadow-2xl sticky top-0 flex flex-col">
        <div className="flex items-center gap-3 p-8 pb-2">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center font-bold text-xl">
                HEC
            </div>
            <div>
                <span className="font-semibold text-xl tracking-tight">CareerKey</span>
                <p className="text-xs text-emerald-300">HEC Portal</p>
            </div>
        </div>
        <nav className="px-4 py-6 space-y-2 flex-1">
            {menus.map(menu => (
                <button
                    key={menu.id}
                    onClick={() => setActiveTab(menu.id)}
                    className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition ${activeTab === menu.id ? "bg-white text-emerald-900 font-bold shadow-xl scale-105" : "text-emerald-100 hover:bg-emerald-700 hover:shadow"
                        }`}
                >
                    <span className="text-2xl">{menu.icon}</span>
                    <span className="text-lg">{menu.label}</span>
                </button>
            ))}
        </nav>
        <div className="text-xs text-emerald-300 p-6 mt-auto">
            &copy; 2025 CareerKey Blockchain Verified
        </div>
    </aside>
);

export default Sidebar;
