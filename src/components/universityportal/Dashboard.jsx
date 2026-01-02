import React, { useState, useEffect } from "react";
import { universityService } from "../../services/universityService";
import { useAuth } from "../../contexts/AuthContext";

const StatCard = ({ icon, title, value, color, bgColor }) => (
    <div className={`${bgColor} p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition`}>
        <div className="flex items-center justify-between mb-3">
            <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center text-2xl shadow`}>
                {icon}
            </div>
            <span className="text-3xl font-bold text-gray-800">{value}</span>
        </div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [statsData, setStatsData] = useState({
        totalStudents: 0,
        pending: 0,
        forwarded: 0,
        rejected: 0
    });
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.id) return;

            try {
                setIsLoading(true);
                const data = await universityService.getUniversityDashboard(user.id);
                // Assuming backend returns stats in some format, 
                // but let's map what we can or use defaults if not available yet
                // For now, if the API isn't fully returning stats, we fallback to local calculations
                // but we primarily try to use the 'data' from API.

                // If the backend DTO has these fields, use them:
                // Otherwise fallback to local storage for demo if needed, 
                // but the user wants me to use the ID in the request.

                // Fetching actual requests to calculate stats if dashboard DTO is just profile
                const students = JSON.parse(localStorage.getItem("universityStudents") || "[]");
                const requests = JSON.parse(localStorage.getItem("attestationRequests") || "[]");

                const pending = requests.filter(r => r.status === "Pending University").length;
                const forwarded = requests.filter(r => r.status === "Pending HEC" || r.status === "Verified").length;
                const rejected = requests.filter(r => r.status.includes("Rejected")).length;

                setStatsData({
                    totalStudents: data.totalStudents || students.length,
                    pending: data.pendingRequests || pending,
                    forwarded: data.forwardedRequests || forwarded,
                    rejected: data.rejectedRequests || rejected
                });

                // Generate recent activities
                const recent = [...requests]
                    .sort((a, b) => b.id - a.id)
                    .slice(0, 5)
                    .map(req => ({
                        text: `Request from ${req.name} (${req.degree}): ${req.status}`,
                        time: req.date
                    }));
                setActivities(recent);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    const stats = [
        { icon: "👥", title: "Total Students", value: statsData.totalStudents, color: "bg-blue-100 text-blue-600", bgColor: "bg-blue-50" },
        { icon: "⏳", title: "Pending Requests", value: statsData.pending, color: "bg-yellow-100 text-yellow-600", bgColor: "bg-yellow-50" },
        { icon: "🚀", title: "Forwarded to HEC", value: statsData.forwarded, color: "bg-indigo-100 text-indigo-600", bgColor: "bg-indigo-50" },
        { icon: "❌", title: "Rejected", value: statsData.rejected, color: "bg-red-100 text-red-600", bgColor: "bg-red-50" },
    ];

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Recent Activities</h3>
                <div className="space-y-3">
                    {activities.length === 0 ? (
                        <p className="text-gray-500 text-sm">No recent activity.</p>
                    ) : (
                        activities.map((activity, index) => (
                            <ActivityItem key={index} text={activity.text} time={activity.time} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const ActivityItem = ({ text, time }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
        <p className="text-sm text-gray-700">{text}</p>
        <span className="text-xs text-gray-500">{time}</span>
    </div>
);

export default Dashboard;
