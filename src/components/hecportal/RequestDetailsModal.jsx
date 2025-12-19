import React from "react";

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
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="px-8 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex justify-between items-center">
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
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Student Details Section */}
                        <div className="space-y-6">
                            <section>
                                <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-4 border-b border-emerald-100 pb-2">Student Information</h4>
                                <div className="grid grid-cols-1 gap-4">
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
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${request.status === "Verified" ? "bg-green-100 text-green-700" :
                                            request.status === "Pending HEC" ? "bg-amber-100 text-amber-700" :
                                                request.status === "Rejected by HEC" ? "bg-red-100 text-red-700" :
                                                    "bg-blue-100 text-blue-700"
                                        }`}>
                                        {request.status}
                                    </span>
                                    {request.remarks && (
                                        <p className="text-xs text-gray-500 italic">"{request.remarks}"</p>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Document View Section */}
                        <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-emerald-200 p-4 flex flex-col min-h-[400px]">
                            <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-4 text-center">Document Preview</h4>

                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-3xl">
                                    📄
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-700">{request.documentName || "Degree_Certificate.pdf"}</p>
                                    <p className="text-xs text-gray-400">Blockchain Verified Hash: {request.txHash ? request.txHash.substring(0, 16) + "..." : "0x74a...8b2e"}</p>
                                </div>

                                {/* Mock Document Preview */}
                                <div className="w-full bg-white border rounded-lg p-6 shadow-inner mt-4">
                                    <div className="border-4 border-emerald-600 p-4 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-600/5 rotate-45 transform translate-x-10 -translate-y-10"></div>
                                        <div className="text-center mb-4">
                                            <h5 className="text-lg font-serif font-bold text-gray-800">{request.university}</h5>
                                            <p className="text-[10px] text-gray-500 uppercase">Degree Verification Document</p>
                                        </div>
                                        <div className="space-y-2 text-left">
                                            <p className="text-[10px]"><span className="font-bold">STUDENT:</span> {request.name}</p>
                                            <p className="text-[10px]"><span className="font-bold">DEGREE:</span> {request.degree}</p>
                                            <p className="text-[10px]"><span className="font-bold">ROLL NO:</span> {request.rollNo}</p>
                                        </div>
                                        <div className="mt-6 flex justify-between items-end">
                                            <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-[8px] text-gray-400 border border-dashed">QR Code</div>
                                            <div className="text-right">
                                                <p className="text-[8px] italic font-serif">Registrar Signature</p>
                                                <div className="h-0.5 w-16 bg-gray-300 mt-1 ml-auto"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full mt-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition">
                                        ⬇ Download Original Document
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-6 bg-gray-50 border-t flex justify-end gap-3">
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
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-semibold text-gray-800">{value}</span>
    </div>
);

export default RequestDetailsModal;
