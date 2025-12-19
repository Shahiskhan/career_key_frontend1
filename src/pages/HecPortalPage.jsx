import React, { useState } from "react";
import Navbar from "../components/hecportal/Navbar";
import Sidebar from "../components/hecportal/Sidebar";
import Dashboard from "../components/hecportal/Dashboard";
import RequestStatus from "../components/hecportal/RequestStatus";
import VerifiedRequests from "../components/hecportal/VerifiedRequests";
import AuditLogs from "../components/hecportal/AuditLogs";
import ChartsOverview from "../components/hecportal/ChartsOverview";
import UniversityRegistration from "../components/hecportal/UniversityRegistration";

const admin = { name: "HEC Admin" };

const HecPortalPage = () => {
    const [activeTab, setActiveTab] = useState("dashboard");

    return (
        <div className="flex h-screen overflow-hidden bg-gradient-to-br from-white via-emerald-50 to-green-50">
            {/* Sidebar stays fixed on the left */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen">
                {/* Navbar stays fixed at the top */}
                <Navbar admin={admin} />

                {/* Scrollable Content */}
                <div className="flex-1 overflow-auto flex flex-col relative">
                    <main className="flex-1 p-8">
                        {activeTab === "dashboard" && <Dashboard />}
                        {activeTab === "pending" && <RequestStatus />}
                        {activeTab === "verified" && <VerifiedRequests />}
                        {activeTab === "logs" && <AuditLogs />}
                        {activeTab === "charts" && <ChartsOverview />}
                        {activeTab === "register" && <UniversityRegistration />}
                    </main>
                    <footer className="py-5 bg-white text-center text-sm text-emerald-700 shadow-md mt-auto">
                        © 2025 CareerKey • Blockchain Verified Attestations
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default HecPortalPage;
