import React, { useState, useEffect } from "react";
import degreeRequestService from "../../services/degreeRequestService";
import { FiLoader, FiCheckCircle, FiSearch, FiExternalLink } from "react-icons/fi";
import RequestDetailsModal from "./RequestDetailsModal";

const VerifiedRequests = () => {
    const [verifiedRequests, setVerifiedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null);

    const fetchVerified = async () => {
        setLoading(true);
        try {
            const response = await degreeRequestService.getRequestsByStatus("VERIFIED_BY_HEC");
            const content = response.data?.content || response.content || [];
            setVerifiedRequests(content);

            // SYNC MODAL
            if (selectedRequest) {
                const updatedItem = content.find(r => r.id === selectedRequest.id);
                if (updatedItem) {
                    setSelectedRequest(updatedItem);
                }
            }
        } catch (err) {
            console.error("Error fetching verified requests:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVerified();
    }, []);

    const handleUpdateRequest = (updatedRequest) => {
        setVerifiedRequests(prev => prev.map(req => req.id === updatedRequest.id ? { ...req, ...updatedRequest } : req));
        if (selectedRequest && selectedRequest.id === updatedRequest.id) {
            setSelectedRequest(prev => ({ ...prev, ...updatedRequest }));
        }
    };

    const filteredRequests = verifiedRequests.filter(req =>
        req.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.universityName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="font-bold text-2xl text-gray-900 border-l-4 border-emerald-500 pl-4 uppercase tracking-wider">
                    Blockchain Verified Records
                </h2>

                <div className="relative w-full md:w-80">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search student, roll no or uni..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-emerald-50">
                {loading ? (
                    <div className="text-center py-20">
                        <FiLoader className="inline-block animate-spin text-emerald-500 w-10 h-10 mb-4" />
                        <p className="text-gray-400 font-medium">Loading blockchain records...</p>
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📜</div>
                        <p className="text-gray-500 font-medium">No verified records found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-emerald-50/30">
                                <tr>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-emerald-900 uppercase tracking-widest">Student Details</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-emerald-900 uppercase tracking-widest">University</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-emerald-900 uppercase tracking-widest">Program</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-emerald-900 uppercase tracking-widest">Verification</th>
                                    <th className="px-6 py-5 text-center text-xs font-bold text-emerald-900 uppercase tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50/50">
                                {filteredRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-emerald-50/10 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900">{req.studentName}</div>
                                            <div className="text-[10px] text-gray-400 font-mono italic">{req.rollNumber}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{req.universityName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{req.program}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-gray-500 mb-1">{new Date(req.requestDate).toLocaleDateString()}</div>
                                            <div className="flex flex-col gap-1">
                                                <span className={`text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border fill-current w-fit ${req.documentStatus === 'BLOCKCHAIN_ANCHORED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                                                    }`}>
                                                    {req.documentStatus?.replace(/_/g, ' ') || 'VERIFIED'}
                                                </span>
                                                <div className="flex items-center gap-1 text-[9px] text-gray-400 font-mono">
                                                    <span>{req.txHash ? req.txHash.substring(0, 16) + '...' : 'PENDING_ANCHOR'}</span>
                                                    {req.txHash && <FiExternalLink className="w-2 h-2" />}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => setSelectedRequest(req)}
                                                className="px-4 py-2 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                            >
                                                View Document
                                            </button>
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
                    onUpdate={handleUpdateRequest}
                    onRefresh={fetchVerified}
                    onApprove={() => { }}
                    onReject={() => { }}
                />
            )}
        </div>
    );
}

export default VerifiedRequests;
