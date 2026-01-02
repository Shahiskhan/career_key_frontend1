import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiEye, FiCheckCircle, FiXCircle, FiLoader, FiDownload, FiInfo, FiX } from 'react-icons/fi';
import degreeRequestService from '../../services/degreeRequestService';
import { useAuth } from '../../contexts/AuthContext';

const DegreeRequestsView = () => {
    const { user, isLoading } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        if (user?.id) {
            fetchRequests();
        } else if (!isLoading) {
            setLoading(false);
        }
    }, [user?.id, isLoading]);

    const fetchRequests = async () => {
        console.log("Fetching requests using User ID from Context:", user?.id);

        if (!user?.id) {
            console.error("User ID is missing from AuthContext.");
            setError("Configuration Error: User ID not found in session.");
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const data = await degreeRequestService.getRequestsByUniversity(user.id);
            console.log("Degree requests response:", data);

            // Handle various response structures (ApiResponse wrapper or direct Page object)
            const content = data.data?.content || data.content || [];
            console.log("Extracted requests content:", content);
            const normalized = content.map((req) => ({
                ...req,
                id: req.id || req.degreeRequestId || req.requestId,
            }));
            setRequests(normalized);
            setError(null);
        } catch (err) {
            console.error("Error fetching requests:", err);
            if (err.response?.data?.message === "No degree requests found" || err.response?.status === 404) {
                setRequests([]);
                setError(null);
            } else {
                setError('Failed to fetch degree requests.');
            }
        } finally {
            setLoading(false);
        }
    };

    const isValidUuid = (value) => {
        if (!value || typeof value !== 'string') return false;
        // More relaxed regex for standard UUID format (8-4-4-4-12)
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
    };

    const handleVerify = async (requestId) => {
        console.log("Verifying degree request ID:", requestId);
        if (!isValidUuid(requestId)) {
            alert(`Error: Degree Request ID is missing or invalid (received: ${requestId}). Please refresh and try again.`);
            return;
        }

        if (!window.confirm("Are you sure you want to verify this degree request?")) return;

        try {
            setLoading(true);
            const response = await degreeRequestService.verifyByUniversity(requestId, user.id);
            if (response.success) {
                alert("Degree request verified successfully!");
                fetchRequests(); // Refresh the list
            }
        } catch (err) {
            console.error("Verification failed:", err);
            setError(err.response?.data?.message || "Failed to verify degree request.");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (requestId) => {
        console.log("Rejecting degree request ID:", requestId);
        if (!isValidUuid(requestId)) {
            alert(`Error: Degree Request ID is missing or invalid (received: ${requestId}). Please refresh and try again.`);
            return;
        }

        const remarks = window.prompt("Please provide a reason for rejection:");
        if (remarks === null) return; // Cancelled

        try {
            setLoading(true);
            const response = await degreeRequestService.rejectByUniversity(requestId, user.id, remarks);
            if (response.success) {
                alert("Degree request rejected successfully.");
                if (selectedRequest?.id === requestId) setSelectedRequest(null);
                fetchRequests(); // Refresh the list
            }
        } catch (err) {
            console.error("Rejection failed:", err);
            setError(err.response?.data?.message || "Failed to reject degree request.");
        } finally {
            setLoading(false);
        }
    };

    const handleView = (request) => {
        setSelectedRequest(request);
    };

    const handleViewDocument = (base64String, fileName = 'document.pdf') => {
        if (!base64String) {
            alert("No document content available.");
            return;
        }

        try {
            // Convert base64 to Blob
            const byteCharacters = atob(base64String);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            // We assume it's a PDF for degree requests, but it could be an image.
            // A more robust way would be to check the magic bytes.
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(blob);
            window.open(fileURL, '_blank');
        } catch (error) {
            console.error("Error opening document:", error);
            alert("Failed to open document. The content might be corrupted.");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'VERIFIED_BY_UNIVERSITY': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'VERIFIED_BY_HEC': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'REJECTED_BY_UNIVERSITY': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'REJECTED_BY_HEC': return 'bg-red-100 text-red-700 border-red-200';
            case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesFilter = filter === 'ALL' || req.status === filter;
        const matchesSearch =
            req.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.program?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Degree Requests</h2>
                    <p className="text-gray-500 text-sm">Manage student requests for official degree certificates.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by student, roll no..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none w-64 text-sm"
                        />
                    </div>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white"
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="VERIFIED_BY_UNIVERSITY">Verified by Uni</option>
                        <option value="VERIFIED_BY_HEC">Verified by HEC</option>
                        <option value="REJECTED_BY_UNIVERSITY">Rejected by Uni</option>
                        <option value="REJECTED_BY_HEC">Rejected by HEC</option>
                        <option value="COMPLETED">Completed</option>
                    </select>

                    <button
                        onClick={fetchRequests}
                        className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                        <FiLoader className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center">
                    <FiXCircle className="mr-2" /> {error}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-bottom border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student & Roll No</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Program</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">CGPA / Year</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <FiLoader className="inline-block animate-spin text-emerald-500 w-8 h-8 mb-2" />
                                        <p className="text-gray-400">Loading requests...</p>
                                    </td>
                                </tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FiInfo className="text-gray-300 w-8 h-8" />
                                        </div>
                                        <p className="text-gray-400">No requests found matching your criteria.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((req) => (
                                    <motion.tr
                                        key={req.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-800">{req.studentName}</div>
                                            <div className="text-xs text-gray-500">{req.rollNumber}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {req.program}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-700">{req.cgpa}</div>
                                            <div className="text-xs text-gray-400">{req.passingYear}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(req.requestDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleView(req)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-all text-xs font-medium"
                                                    title="View Full Details"
                                                >
                                                    <FiEye className="w-3.5 h-3.5" />
                                                    View
                                                </button>

                                                {req.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleVerify(req.id)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all text-xs font-medium"
                                                            title="Approve Request"
                                                            disabled={loading}
                                                        >
                                                            <FiCheckCircle className="w-3.5 h-3.5" />
                                                            Verify
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(req.id)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all text-xs font-medium"
                                                            title="Reject Request"
                                                            disabled={loading}
                                                        >
                                                            <FiXCircle className="w-3.5 h-3.5" />
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Request Detail Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
                    >
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Degree Request Details</h3>
                                <p className="text-sm text-gray-500">Review student information and documents.</p>
                            </div>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                            >
                                <FiX className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto max-h-[70vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <section className="space-y-4">
                                    <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Student Information</h4>
                                    <div className="space-y-3">
                                        <DetailItem label="Full Name" value={selectedRequest.studentName} />
                                        <DetailItem label="Roll Number" value={selectedRequest.rollNumber} />
                                        <DetailItem label="Program" value={selectedRequest.program} />
                                        <DetailItem label="CGPA" value={selectedRequest.cgpa} />
                                        <DetailItem label="Passing Year" value={selectedRequest.passingYear} />
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Request Status</h4>
                                    <div className="space-y-3">
                                        <DetailItem
                                            label="Current Status"
                                            value={
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(selectedRequest.status)}`}>
                                                    {selectedRequest.status}
                                                </span>
                                            }
                                        />
                                        <DetailItem label="Submission Date" value={new Date(selectedRequest.requestDate).toLocaleString()} />
                                        <DetailItem label="Stamped by HEC" value={selectedRequest.stampedByHec ? 'Yes' : 'No'} />
                                        {selectedRequest.remarks && (
                                            <DetailItem label="Remarks" value={selectedRequest.remarks} />
                                        )}
                                    </div>
                                </section>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4">Supporting Documents</h4>
                                {selectedRequest.documentBase64 || selectedRequest.documentPath ? (
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                                                <FiDownload className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-800">Academic Transcript / Degree</div>
                                                <div className="text-xs text-gray-500">
                                                    {selectedRequest.documentBase64 ? 'Digital Document' : 'Server File'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {selectedRequest.documentBase64 && (
                                                <button
                                                    onClick={() => handleViewDocument(selectedRequest.documentBase64)}
                                                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
                                                >
                                                    View Document
                                                </button>
                                            )}
                                            {selectedRequest.documentPath && !selectedRequest.documentBase64 && (
                                                <a
                                                    href={`http://localhost:9090${selectedRequest.documentPath}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
                                                >
                                                    View Original
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                        <p className="text-sm text-gray-400">No documents uploaded.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3">
                            {selectedRequest.status === 'PENDING' && (
                                <>
                                    <button
                                        onClick={() => handleReject(selectedRequest.id)}
                                        className="px-6 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
                                    >
                                        Reject Request
                                    </button>
                                    <button
                                        onClick={() => handleVerify(selectedRequest.id)}
                                        className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                                    >
                                        Approve & Verify
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

const DetailItem = ({ label, value }) => (
    <div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</div>
        <div className="text-sm font-medium text-gray-700">{value || 'N/A'}</div>
    </div>
);

export default DegreeRequestsView;
