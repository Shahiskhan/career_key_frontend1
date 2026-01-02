

import React, { useState, useEffect } from "react";
import StudentNavbar from "../components/studentportal/StudentNavbar";
import StudentHero from "../components/studentportal/StudentHero";
import DashboardStats from "../components/studentportal/DashboardStats";
import MyDocuments from "../components/studentportal/MyDocuments";

import JobRecommendationsPage from "./JobRecommendationsPage";
import ProfilePage from "./ProfilePage";
import DegreeRequestForm from "../components/studentportal/DegreeRequestForm";
import { useAuth } from "../contexts/AuthContext";
import { studentService } from "../services/studentService";

const StudentPortal = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const { user } = useAuth();

    const [stats, setStats] = useState({ documents: 0, verified: 0, pending: 0, jobs: 12 });
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            if (!user?.id) return;

            try {
                setIsLoading(true);
                const data = await studentService.getStudentDashboard(user.id);

                // Fetch requests from localStorage for now to show real-time changes
                const allRequests = JSON.parse(localStorage.getItem("attestationRequests") || "[]");
                const currentEmail = user?.email;

                // Filter requests for the current student only
                const requests = allRequests.filter(req => req.studentEmail === currentEmail);

                // Calculate stats
                const totalDocs = data.totalDocuments ?? requests.length;
                const verifiedDocs = data.verifiedDocuments ?? requests.filter(req => req.status === "Verified").length;
                const pendingDocs = data.pendingDocuments ?? requests.filter(req => req.status !== "Verified" && req.status !== "Rejected" && req.status !== "Rejected by HEC").length;

                setStats(prev => ({
                    ...prev,
                    documents: totalDocs,
                    verified: verifiedDocs,
                    pending: pendingDocs,
                    jobs: data.jobMatches ?? 12
                }));

                // Map requests to document format
                const docsList = requests.map(req => ({
                    name: req.degree || "Degree Certificate",
                    status: req.status === "Verified" ? "Verified" :
                        req.status.includes("Rejected") ? "Rejected" : "Pending",
                    date: req.date,
                    hash: req.txHash || null,
                    details: req
                }));
                setDocuments(docsList);
            } catch (error) {
                console.error("Student dashboard fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudentData();
    }, [activeSection, user]);

    const profile = {
        name: user?.name || "Student",
        email: user?.email || "",
        // Other fields like university, degree can be fetched from user.roles if roles are more complex 
        // or from a separate student object if backend provides it in user
    };

    const handleNavigate = (section) => {
        setActiveSection(section);
    };



    if (activeSection === 'jobs') {
        return <JobRecommendationsPage onNavigate={handleNavigate} />;
    }

    if (activeSection === 'profile') {
        return <ProfilePage onNavigate={handleNavigate} />;
    }

    if (activeSection === 'degree-request') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-green-50">
                <div className="sticky top-0 z-50 pb-2 bg-gradient-to-br from-white/90 via-emerald-50/90 to-green-50/90 backdrop-blur-sm transition-all shadow-sm">
                    <div className="container mx-auto px-4 pt-4">
                        <StudentNavbar activeSection={activeSection} onNavigate={handleNavigate} />
                    </div>
                </div>
                <div className="container mx-auto px-4 py-8 mt-4">
                    <DegreeRequestForm
                        onBack={() => setActiveSection('dashboard')}
                        onSuccess={() => setActiveSection('dashboard')}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-green-50">
            <div className="sticky top-0 z-50 pb-2 bg-gradient-to-br from-white/90 via-emerald-50/90 to-green-50/90 backdrop-blur-sm transition-all shadow-sm">
                <div className="container mx-auto px-4 pt-4">
                    <StudentNavbar activeSection={activeSection} onNavigate={handleNavigate} />
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 mt-4">
                <div id="dashboard">
                    <StudentHero studentName={profile.name} />
                    <DashboardStats stats={stats} />
                </div>

                <MyDocuments documents={documents} />
            </div>

            <footer className="py-6 text-center text-gray-500 text-sm border-t mt-16">
                © 2025 CareerKey – All Rights Reserved.
            </footer>
        </div>
    );
};

export default StudentPortal;

