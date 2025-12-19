import React, { useState, useEffect } from "react";
import RequestDetailsModal from "./RequestDetailsModal";

const RequestStatus = () => {
    const [allRequests, setAllRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [activeFilter, setActiveFilter] = useState("All");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Load all requests from localStorage
        const requests = JSON.parse(localStorage.getItem("attestationRequests") || "[]");
        setAllRequests(requests);
        setFilteredRequests(requests);
    }, []);

    useEffect(() => {
        let filtered = allRequests;

        // Apply Status Filter
        if (activeFilter === "Pending") {
            filtered = filtered.filter(req => req.status === "Pending HEC");
        } else if (activeFilter === "In Progress") {
            filtered = filtered.filter(req => req.status === "In Progress");
        } else if (activeFilter === "Completed") {
            filtered = filtered.filter(req => req.status === "Verified" || req.status === "Completed");
        } else if (activeFilter === "Rejected") {
            filtered = filtered.filter(req => req.status === "Rejected by HEC");
        }

        // Apply Search Filter (University or Roll No)
        if (searchTerm.trim() !== "") {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(req =>
                (req.university && req.university.toLowerCase().includes(term)) ||
                (req.rollNo && req.rollNo.toLowerCase().includes(term))
            );
        }

        setFilteredRequests(filtered);
    }, [activeFilter, allRequests, searchTerm]);

    const updateRequestStatus = (id, newStatus, remarks) => {
        const updatedAll = allRequests.map(req =>
            req.id === id ? { ...req, status: newStatus, remarks: `HEC: ${remarks}` } : req
        );
        setAllRequests(updatedAll);
        localStorage.setItem("attestationRequests", JSON.stringify(updatedAll));
    };

    const handleApprove = (id) => {
        const remarks = prompt("Enter HEC verification remarks (optional):", "Verified by HEC.");
        if (remarks !== null) {
            updateRequestStatus(id, "Verified", remarks);
            alert("Request successfully verified by HEC!");
        }
    };

    const handleReject = (id) => {
        const remarks = prompt("Enter reason for rejection:", "Document discrepancy.");
        if (remarks) {
            updateRequestStatus(id, "Rejected by HEC", remarks);
            alert("Request rejected by HEC.");
        }
    };

    const filters = ["All", "Pending", "In Progress", "Completed", "Rejected"];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="font-bold text-2xl text-gray-900 border-l-4 border-emerald-500 pl-4">Request Status</h2>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500">
                            🔍
                        </span>
                        <input
                            type="text"
                            placeholder="Search by University or Roll No..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-emerald-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2 bg-emerald-50 p-1.5 rounded-2xl shadow-sm border border-emerald-100 self-start">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${activeFilter === filter
                                ? "bg-emerald-600 text-white shadow-md scale-105"
                                : "text-emerald-700 hover:bg-emerald-100"
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-50">
                {filteredRequests.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📂</div>
                        <p className="text-gray-500 text-lg">
                            {searchTerm ? `No results found for "${searchTerm}"` : `No ${activeFilter.toLowerCase()} requests found.`}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-emerald-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">Student Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">Roll No</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">University</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">Degree</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-emerald-900 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50">
                                {filteredRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-emerald-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-gray-900">{req.name}</div>
                                            <div className="text-xs text-gray-500">{req.cnic}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-mono">{req.rollNo}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{req.university}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{req.degree}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{req.date}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${req.status === "Verified" ? "bg-green-100 text-green-700" :
                                                req.status === "Pending HEC" ? "bg-amber-100 text-amber-700" :
                                                    req.status === "Rejected by HEC" ? "bg-red-100 text-red-700" :
                                                        "bg-blue-100 text-blue-700"
                                                }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => setSelectedRequest(req)}
                                                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition flex items-center gap-1"
                                                >
                                                    👁️ View
                                                </button>
                                                {req.status === "Pending HEC" && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-emerald-700 transition"
                                                            onClick={() => handleApprove(req.id)}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-rose-700 transition"
                                                            onClick={() => handleReject(req.id)}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Request Details Modal */}
            {selectedRequest && (
                <RequestDetailsModal
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}
        </div>
    );
};

export default RequestStatus;
