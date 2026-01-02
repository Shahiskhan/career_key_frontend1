import React, { useState, useEffect } from "react";
import RequestDetailsModal from "./RequestDetailsModal";
import degreeRequestService from "../../services/degreeRequestService";
import { universityService } from "../../services/universityService";
import { FiSearch, FiFilter, FiLoader, FiInfo, FiCheckCircle, FiXCircle, FiEye } from "react-icons/fi";

const RequestStatus = () => {
    const [allRequests, setAllRequests] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState("All");
    const [activeFilter, setActiveFilter] = useState("VERIFIED_BY_UNIVERSITY");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUniversities();
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [activeFilter, selectedUniversity]);

    const fetchUniversities = async () => {
        try {
            const data = await universityService.getAllUniversities();
            // Data might be wrapped in ApiResponse
            const unis = data.data || data || [];
            setUniversities(unis);
        } catch (err) {
            console.error("Error fetching universities:", err);
        }
    };

    const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            let response;
            const uniObj = universities.find(u => u.name === selectedUniversity);

            if (selectedUniversity !== "All" && uniObj) {
                // Fetch by University (optionally with status if backend supports it)
                if (activeFilter === "All") {
                    response = await degreeRequestService.getRequestsByUniversity(uniObj.id);
                } else {
                    response = await degreeRequestService.getRequestsByUniversityAndStatus(uniObj.id, activeFilter);
                }
            } else {
                // Fetch by Status for all universities
                if (activeFilter === "All") {
                    // For now default to VERIFIED_BY_UNIVERSITY if 'All' is selected for all universities
                    response = await degreeRequestService.getRequestsByStatus("VERIFIED_BY_UNIVERSITY");
                } else {
                    response = await degreeRequestService.getRequestsByStatus(activeFilter);
                }
            }

            let content = response.data?.content || response.content || [];
            setAllRequests(content);
        } catch (err) {
            console.error("Error fetching requests:", err);
            setError("Failed to load degree requests.");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm("Are you sure you want to verify this degree request as HEC?")) return;

        try {
            setLoading(true);
            const response = await degreeRequestService.verifyByHec(id);
            if (response.success) {
                alert("Request successfully verified by HEC!");
                fetchRequests();
                setSelectedRequest(null);
            }
        } catch (err) {
            console.error("HEC verification failed:", err);
            alert(err.response?.data?.message || "Failed to verify request.");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (id) => {
        const remarks = prompt("Enter reason for rejection:");
        if (remarks === null) return;

        try {
            setLoading(true);
            // Assuming HEC rejection uses a similar endpoint or we use the university one with HEC role
            // If there's no specific HEC reject endpoint mentioned in the snippet, we might need to add it
            // or use the university one if backend allows.
            // For now, let's use a generic reject if available, otherwise just log.
            alert("HEC Rejection feature coming soon or use general rejection if available.");
            // const response = await degreeRequestService.rejectByUniversity(id, 'HEC_ADMIN', remarks);
        } catch (err) {
            console.error("HEC rejection failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredRequests = allRequests.filter(req =>
        req.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.universityName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filters = [
        { label: "All", value: "All" },
        { label: "Pending Uni", value: "PENDING" },
        { label: "Pending HEC", value: "VERIFIED_BY_UNIVERSITY" },
        { label: "Verified HEC", value: "VERIFIED_BY_HEC" },
        { label: "Rejected Uni", value: "REJECTED_BY_UNIVERSITY" },
        { label: "Rejected HEC", value: "REJECTED_BY_HEC" },
        { label: "Completed", value: "COMPLETED" }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="font-bold text-2xl text-gray-900 border-l-4 border-emerald-500 pl-4">Degree Verification Requests</h2>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* University Filter */}
                        <div className="relative">
                            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                            <select
                                value={selectedUniversity}
                                onChange={(e) => setSelectedUniversity(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white border border-emerald-100 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                            >
                                <option value="All">All Universities</option>
                                {universities.map(uni => (
                                    <option key={uni.id} value={uni.name}>{uni.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-64">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                            <input
                                type="text"
                                placeholder="Search student or roll no..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-emerald-100 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2 bg-emerald-50/50 p-1.5 rounded-2xl border border-emerald-50 self-start">
                    {filters.map(f => (
                        <button
                            key={f.value}
                            onClick={() => setActiveFilter(f.value)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${activeFilter === f.value
                                ? "bg-emerald-600 text-white shadow-lg scale-105"
                                : "text-emerald-700 hover:bg-emerald-100"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-50">
                {loading && allRequests.length === 0 ? (
                    <div className="text-center py-20">
                        <FiLoader className="inline-block animate-spin text-emerald-500 w-10 h-10 mb-4" />
                        <p className="text-gray-400">Loading requests...</p>
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="text-center py-20">
                        <FiInfo className="inline-block text-gray-300 w-12 h-12 mb-4" />
                        <p className="text-gray-500">
                            {searchTerm ? `No results found for "${searchTerm}"` : "No requests found."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-emerald-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">Student & ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">University</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">Program</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-emerald-900 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50">
                                {filteredRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-emerald-50/10 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900">{req.studentName}</div>
                                            <div className="text-[10px] text-gray-500 font-mono uppercase">{req.rollNumber}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{req.universityName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{req.program}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(req.requestDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${req.status === 'VERIFIED_BY_HEC' || req.status === 'COMPLETED' ? "bg-green-100 text-green-700" :
                                                        req.status === 'VERIFIED_BY_UNIVERSITY' ? "bg-blue-100 text-blue-700" :
                                                            req.status === 'PENDING' ? "bg-amber-100 text-amber-700" :
                                                                "bg-red-100 text-red-700"
                                                    }`}>
                                                    {req.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedRequest(req)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <FiEye className="w-5 h-5" />
                                                </button>
                                                {req.status === "VERIFIED_BY_UNIVERSITY" && (
                                                    <>
                                                        <button
                                                            onClick={() => { handleReject(req.id); }} // Removed onClose as it's not in this component's scope
                                                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                            title="HEC Reject"
                                                        >
                                                            <FiXCircle className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => { handleApprove(req.id); }} // Removed onClose as it's not in this component's scope
                                                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                            title="HEC Verify"
                                                        >
                                                            <FiCheckCircle className="w-5 h-5" />
                                                        </button>
                                                    </>
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
