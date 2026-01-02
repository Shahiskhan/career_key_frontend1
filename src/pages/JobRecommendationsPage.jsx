import React, { useState } from "react";
import StudentNavbar from "../components/studentportal/StudentNavbar";
import JobRecommendations from "../components/studentportal/JobRecommendations";
import { jobService } from "../services/jobService";

const JobRecommendationsPage = ({ onNavigate }) => {
    const [keywords, setKeywords] = useState("");
    const [lastSearchedKeyword, setLastSearchedKeyword] = useState("");
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!keywords.trim()) return;

        setLoading(true);
        setError("");

        try {
            const data = await jobService.fetchJobs(keywords);
            setJobs(data.jobs || []);
            setLastSearchedKeyword(keywords);
            setHasSearched(true);
        } catch (err) {
            console.error("Error fetching jobs:", err);
            setError("Failed to fetch jobs. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-green-50">
            <div className="sticky top-0 z-50 pb-2 bg-gradient-to-br from-white/90 via-emerald-50/90 to-green-50/90 backdrop-blur-sm transition-all shadow-sm">
                <div className="container mx-auto px-4 pt-4">
                    <StudentNavbar activeSection="jobs" onNavigate={onNavigate} />
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Dream Job</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Search for the latest opportunities tailored to your skills and career goals.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-12">
                    <form onSubmit={handleSearch} className="relative">
                        <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 p-2 focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
                            <span className="pl-4 text-gray-400">🔍</span>
                            <input
                                type="text"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                placeholder="Search by job title, skills, or keywords (e.g., Software Engineer, React)"
                                className="w-full px-4 py-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-full hover:shadow-lg transition hover:from-emerald-700 hover:to-green-700 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? "Searching..." : "Search"}
                            </button>
                        </div>
                    </form>
                    {error && (
                        <p className="text-red-500 text-sm mt-3 text-center bg-red-50 py-2 px-4 rounded-lg inline-block w-full border border-red-100">
                            {error}
                        </p>
                    )}
                </div>

                {/* Results Section */}
                {hasSearched && (
                    <JobRecommendations
                        jobs={jobs}
                        title={`Results for "${lastSearchedKeyword}"`}
                    />
                )}

                {!hasSearched && (
                    <div className="text-center py-20 text-gray-400">
                        <div className="text-6xl mb-4 opacity-50">💼</div>
                        <p className="text-lg">Start searching to see job listings</p>
                    </div>
                )}
            </div>

            <footer className="py-6 text-center text-gray-500 text-sm border-t mt-16">
                © 2025 CareerKey – All Rights Reserved.
            </footer>
        </div>
    );
};

export default JobRecommendationsPage;
