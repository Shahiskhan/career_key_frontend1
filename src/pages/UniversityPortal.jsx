import React, { useState } from "react";
import Sidebar from "../components/universityportal/Sidebar";
import Header from "../components/universityportal/Header";
import Dashboard from "../components/universityportal/Dashboard";
import Students from "../components/universityportal/Students";
import Attestations from "../components/universityportal/Attestations";
import DegreeIssuance from "../components/universityportal/DegreeIssuance";
import Verification from "../components/universityportal/Verification";
import Reports from "../components/universityportal/Reports";
import Settings from "../components/universityportal/Settings";
import DegreeRequestsView from "../components/universityportal/DegreeRequestsView";

const UniversityPortal = () => {
    const [activeTab, setActiveTab] = useState("dashboard");

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard": return <Dashboard />;
            case "students": return <Students />;
            case "attestations": return <Attestations />;
            case "degree-requests": return <DegreeRequestsView />;
            case "degree-issuance": return <DegreeIssuance />;
            case "verification": return <Verification />;
            case "reports": return <Reports />;
            case "settings": return <Settings />;
            default: return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gradient-to-br from-white via-emerald-50 to-green-50">
            {/* Sidebar stays fixed on the left */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen">
                {/* Header stays fixed at the top */}
                <Header title={activeTab.replace("-", " ").toUpperCase()} universityName="University of Mianwali" />

                {/* Scrollable Content */}
                <div className="flex-1 overflow-auto p-8 relative">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default UniversityPortal;
