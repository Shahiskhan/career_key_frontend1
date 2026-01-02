import React, { useState, useEffect } from "react";
import degreeRequestService from "../../services/degreeRequestService";
import { FiLoader, FiCheckCircle, FiSearch, FiExternalLink } from "react-icons/fi";

const VerifiedRequests = () => {
    const [verifiedRequests, setVerifiedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchVerified = async () => {
            setLoading(true);
            try {
                // Fetch requests verified by HEC
                const response = await degreeRequestService.getRequestsByStatus("VERIFIED_BY_HEC");
                const content = response.data?.content || response.content || [];
                setVerifiedRequests(content);
            } catch (err) {
                console.error("Error fetching verified requests:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVerified();
    }, []);

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
                                    <th className="px-6 py-5 text-center text-xs font-bold text-emerald-900 uppercase tracking-widest">Status</th>
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
                                            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                                                <span>{req.txHash ? req.txHash.substring(0, 16) + '...' : 'BLOCKCHAIN_ID_00' + req.id.substring(0, 4)}</span>
                                                <FiExternalLink className="w-2.5 h-2.5" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest">
                                                <FiCheckCircle className="w-3 h-3" />
                                                Verified
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifiedRequests;
