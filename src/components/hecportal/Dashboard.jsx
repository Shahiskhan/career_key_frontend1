import React, { useState, useEffect } from "react";
import StatCard from "./StatCard";
import ChartsOverview from "./ChartsOverview";
import { hecService } from "../../services/hecService";
import { useAuth } from "../../contexts/AuthContext";

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState([
        { icon: "🕒", label: "Pending Requests", value: 0, type: "pending" },
        { icon: "✅", label: "Verified", value: 0, type: "verified" },
        { icon: "⛓️", label: "Blockchain Attested", value: 0, type: "blockchain" },
        { icon: "❌", label: "Rejected", value: 0, type: "rejected" },
    ]);
    const [recent, setRecent] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHecDashboard = async () => {
            if (!user?.id) return;

            try {
                setIsLoading(true);
                const data = await hecService.getHecDashboard(user.id);

                // Fallback to local storage for requests if backend only returns basic stats
                const requests = JSON.parse(localStorage.getItem("attestationRequests") || "[]");

                const pending = data.pendingRequests ?? requests.filter(r => r.status === "Pending HEC").length;
                const verified = data.verifiedRequests ?? requests.filter(r => r.status === "Verified").length;
                const rejected = data.rejectedRequests ?? requests.filter(r => r.status === "Rejected by HEC").length;

                setStats([
                    { icon: "🕒", label: "Pending Requests", value: pending, type: "pending" },
                    { icon: "✅", label: "Verified", value: verified, type: "verified" },
                    { icon: "⛓️", label: "Blockchain Attested", value: verified, type: "blockchain" },
                    { icon: "❌", label: "Rejected", value: rejected, type: "rejected" },
                ]);

                // Filter activities relevant to HEC
                const hecRelated = requests.filter(r =>
                    r.status === "Pending HEC" || r.status === "Verified" || r.status === "Rejected by HEC"
                );

                const recentActivities = [...hecRelated]
                    .sort((a, b) => b.id - a.id)
                    .slice(0, 5)
                    .map(req => ({
                        action: `Request from ${req.name}: ${req.status}`,
                        time: req.date
                    }));

                setRecent(recentActivities);
            } catch (error) {
                console.error("HEC Dashboard fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHecDashboard();
    }, [user]);

    return (
        <section>
            <h2 className="font-bold text-2xl mb-6 text-gray-900">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                {stats.map((stat, idx) => <StatCard key={idx} {...stat} />)}
            </div>
            <ChartsOverview />
            <div className="mt-10 bg-white rounded-2xl shadow p-6">
                <h3 className="text-lg font-bold mb-4 text-indigo-900">Recent Activity</h3>
                <ul className="divide-y divide-indigo-50">
                    {recent.length === 0 ? (
                        <li className="py-2 text-gray-500 text-sm">No recent HEC activity.</li>
                    ) : (
                        recent.map((ev, i) => (
                            <li key={i} className="flex justify-between py-2 text-gray-700 text-sm">
                                <span>{ev.action}</span>
                                <span className="text-indigo-400">{ev.time}</span>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </section>
    );
};

export default Dashboard;
