import React from "react";
import degreeImage from "../../assets/images/buy-college-degree-from-the-riphah-international-university.jpg";

const RequestDetailsModal = ({ request, onClose, onApprove, onReject }) => {
    if (!request) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-emerald-950/40 backdrop-blur-md transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="px-8 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-2xl font-bold">Document Verification</h3>
                        <p className="text-emerald-50 text-sm italic">Request ID: #{request.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                        <span className="text-xl">✕</span>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Student Details Section */}
                        <div className="lg:col-span-4 space-y-6">
                            <section>
                                <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-4 border-b border-emerald-100 pb-2">Student Information</h4>
                                <div className="grid grid-cols-1 gap-4 bg-emerald-50/30 p-4 rounded-2xl">
                                    <DetailItem label="Full Name" value={request.name} />
                                    <DetailItem label="Roll Number" value={request.rollNo} />
                                    <DetailItem label="CNIC" value={request.cnic} />
                                    <DetailItem label="University" value={request.university} />
                                    <DetailItem label="Degree" value={request.degree} />
                                    <DetailItem label="Request Date" value={request.date} />
                                </div>
                            </section>

                            <section>
                                <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-4 border-b border-emerald-100 pb-2">Application Status</h4>
                                <div className="bg-white border border-emerald-100 p-4 rounded-2xl shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${request.status === "Verified" ? "bg-green-100 text-green-700" :
                                                request.status === "Pending HEC" ? "bg-amber-100 text-amber-700" :
                                                    request.status === "Rejected by HEC" ? "bg-red-100 text-red-700" :
                                                        "bg-blue-100 text-blue-700"
                                            }`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    {request.remarks && (
                                        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100 italic text-xs text-gray-600">
                                            "{request.remarks}"
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Document View Section */}
                        <div className="lg:col-span-8 flex flex-col h-full">
                            <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-4 border-b border-emerald-100 pb-2">Official Document Preview</h4>

                            <div className="flex-1 bg-gray-900 rounded-2xl overflow-hidden shadow-inner flex flex-col relative group">
                                {/* Action Overlay for Image */}
                                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a
                                        href={degreeImage}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 shadow-xl hover:bg-white transition"
                                    >
                                        🔍 Open Full Size
                                    </a>
                                </div>

                                {/* Actual Image Display */}
                                <div className="flex-1 overflow-auto bg-gray-800 flex items-center justify-center p-4">
                                    <img
                                        src={degreeImage}
                                        alt="Degree Certificate"
                                        className="max-w-full h-auto shadow-2xl rounded-sm transition-transform duration-500 hover:scale-[1.01]"
                                    />
                                </div>

                                {/* Document Footer Info */}
                                <div className="bg-emerald-900 text-emerald-100 px-6 py-3 flex justify-between items-center text-[10px] font-mono tracking-wider">
                                    <span>MD5: {request.txHash ? request.txHash.substring(0, 16) : "B82F...E9D1"}</span>
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                        BLOCKCHAIN VERIFIED
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-6 bg-gray-50 border-t flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 transition"
                    >
                        Close
                    </button>
                    {request.status === "Pending HEC" && (
                        <>
                            <button
                                onClick={() => { onReject(request.id); onClose(); }}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                            >
                                Reject Request
                            </button>
                            <button
                                onClick={() => { onApprove(request.id); onClose(); }}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition"
                            >
                                Approve & Verify
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-[10px] font-bold text-emerald-600/50 uppercase tracking-widest leading-none mb-1">{label}</span>
        <span className="text-sm font-semibold text-gray-800">{value}</span>
    </div>
);

export default RequestDetailsModal;
