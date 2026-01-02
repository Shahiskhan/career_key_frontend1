import React, { useState } from "react";
import degreeRequestService from "../../services/degreeRequestService";
import degreeImage from "../../assets/images/buy-college-degree-from-the-riphah-international-university.jpg";
import { FiLoader, FiCheckCircle, FiClock, FiShield } from "react-icons/fi";

const RequestDetailsModal = ({ request, onClose, onApprove, onReject }) => {
    const [isStamping, setIsStamping] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isStamped, setIsStamped] = useState(request.stampedByHec || false);
    const [ipfsHash, setIpfsHash] = useState(request.ipfsHash || null);
    const [currentDocumentBase64, setCurrentDocumentBase64] = useState(request.documentBase64 || null);
    const [currentDocumentType, setCurrentDocumentType] = useState('application/pdf'); // Default to PDF for degrees

    if (!request) return null;

    const documentSource = currentDocumentBase64
        ? `data:image/jpeg;base64,${currentDocumentBase64}`
        : degreeImage;

    const handleOpenFull = () => {
        if (currentDocumentBase64) {
            const byteCharacters = atob(currentDocumentBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(blob);
            window.open(fileURL, '_blank');
        } else {
            window.open(documentSource, '_blank');
        }
    };

    const handleStamp = async () => {
        setIsStamping(true);
        try {
            const response = await degreeRequestService.stampDegreeRequest(request.id);
            if (response.success && response.data) {
                const stampedData = response.data;
                setCurrentDocumentBase64(stampedData.base64);
                setIsStamped(true);

                // Show success message
                alert("Digital QR Stamp applied successfully. Document updated with official HEC seal.");

                // Also trigger download for convenience (optional, user might want to see it first)
                const byteCharacters = atob(stampedData.base64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `stamped_degree_${request.studentName.replace(/\s+/g, '_')}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            } else {
                throw new Error(response.message || "Failed to stamp document");
            }
        } catch (err) {
            console.error("Stamping failed:", err);
            alert("Failed to apply digital stamp: " + (err.message || "Unknown error"));
        } finally {
            setIsStamping(false);
        }
    };

    const handleIpfsUpload = async () => {
        setIsUploading(true);
        try {
            const response = await degreeRequestService.uploadToIpfs(request.id);
            setIpfsHash(response.ipfsHash);
            alert(`Document uploaded to IPFS decentralized storage!\n\nHash: ${response.ipfsHash}`);
        } catch (err) {
            console.error("IPFS upload failed:", err);
            alert("IPFS storage failed. " + (err.response?.data || err.message));
        } finally {
            setIsUploading(false);
        }
    };

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
                        <p className="text-emerald-50 text-sm italic">Request ID: {request.id}</p>
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
                                    <DetailItem label="Full Name" value={request.studentName} />
                                    <DetailItem label="Roll Number" value={request.rollNumber} />
                                    <DetailItem label="Program" value={request.program} />
                                    <DetailItem label="University" value={request.universityName} />
                                    <DetailItem label="Passing Year" value={request.passingYear} />
                                    <DetailItem label="CGPA" value={request.cgpa} />
                                    <DetailItem label="Request Date" value={new Date(request.requestDate).toLocaleDateString()} />
                                </div>
                            </section>

                            <section>
                                <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-4 border-b border-emerald-100 pb-2">Application Status</h4>
                                <div className="bg-white border border-emerald-100 p-4 rounded-2xl shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${request.status === 'VERIFIED_BY_HEC' || request.status === 'COMPLETED' ? "bg-green-100 text-green-700" :
                                            request.status === 'VERIFIED_BY_UNIVERSITY' ? "bg-blue-100 text-blue-700" :
                                                request.status === 'PENDING' ? "bg-amber-100 text-amber-700" :
                                                    "bg-red-100 text-red-700"
                                            }`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    {ipfsHash && (
                                        <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-100 flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-blue-600 uppercase">IPFS CONTENT HASH</span>
                                            <span className="text-[9px] font-mono break-all text-blue-800">{ipfsHash}</span>
                                        </div>
                                    )}
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

                            <div className="flex-1 bg-gray-900 rounded-2xl overflow-hidden shadow-inner flex flex-col relative group min-h-[400px]">
                                {/* Action Overlay for Image */}
                                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={handleOpenFull}
                                        className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 shadow-xl hover:bg-white transition"
                                    >
                                        🔍 Open Full Document
                                    </button>
                                </div>

                                {/* Actual Image Display */}
                                <div className="flex-1 overflow-auto bg-gray-800 flex items-center justify-center p-4">
                                    {currentDocumentBase64 ? (
                                        <div className="w-full h-full flex flex-col items-center">
                                            {/* Preview of the document */}
                                            <div className="relative w-full h-[500px] border-4 border-emerald-500/30 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-2xl">
                                                <iframe
                                                    src={`data:application/pdf;base64,${currentDocumentBase64}#toolbar=0&navpanes=0&scrollbar=0`}
                                                    className="w-full h-full border-none"
                                                    title="Degree Stamped Preview"
                                                />
                                                <div className="absolute top-0 left-0 w-full h-full pointer-events-none border-4 border-white/10"></div>
                                            </div>

                                            <div className="mt-4 flex gap-4">
                                                <button
                                                    onClick={handleOpenFull}
                                                    className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg"
                                                >
                                                    🔍 Open Full Screen
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <img src={degreeImage} alt="Placeholder" className="max-w-full h-auto" />
                                    )}
                                    <div className="hidden absolute inset-0 flex-col items-center justify-center text-white p-6 text-center">
                                        <div className="text-6xl mb-4">📄</div>
                                        <p className="text-lg font-bold mb-4">Digital Document (PDF)</p>
                                        <button
                                            onClick={handleOpenFull}
                                            className="px-6 py-3 bg-emerald-600 rounded-xl font-bold hover:bg-emerald-700 transition"
                                        >
                                            View PDF Document
                                        </button>
                                    </div>
                                </div>

                                {/* Document Footer Info */}
                                <div className="bg-emerald-900 text-emerald-100 px-6 py-3 flex justify-between items-center text-[10px] font-mono tracking-wider">
                                    <span>STAMP: {isStamped ? "HEC STAMPED" : "PENDING STAMP"}</span>
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                        BLOCKCHAIN VERIFIED
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Blockchain Workflow & Action Buttons (Moved here to show only on scroll) */}
                    <div className="mt-12 pt-8 border-t border-emerald-100 flex flex-col gap-6">
                        <div className="text-center">
                            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-[0.2em] mb-4">Complete Blockchain Verification Workflow</h4>

                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <button
                                    onClick={handleStamp}
                                    disabled={isStamping}
                                    className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black bg-white text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white shadow-lg shadow-emerald-100 transition-all hover:-translate-y-1 active:scale-95 group disabled:opacity-50"
                                >
                                    {isStamping ? <FiLoader className="animate-spin" /> : <span>🏷️</span>}
                                    {isStamping ? "STAMPING..." : "STAMP DOCUMENT"}
                                </button>
                                <button
                                    onClick={handleIpfsUpload}
                                    disabled={isUploading || !!ipfsHash}
                                    className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black bg-white text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white shadow-lg shadow-emerald-100 transition-all hover:-translate-y-1 active:scale-95 group disabled:opacity-50"
                                >
                                    {isUploading ? <FiLoader className="animate-spin" /> : <span>☁️</span>}
                                    {ipfsHash ? "UPLOADED TO IPFS" : isUploading ? "UPLOADING..." : "UPLOAD TO IPFS"}
                                </button>
                                <button className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black bg-white text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white shadow-lg shadow-emerald-100 transition-all hover:-translate-y-1 active:scale-95 group">
                                    <span className="text-xl group-hover:rotate-12 transition-transform">📄</span>
                                    SMART CONTRACT
                                </button>
                                <button className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black bg-white text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white shadow-lg shadow-emerald-100 transition-all hover:-translate-y-1 active:scale-95 group">
                                    <span className="text-xl group-hover:rotate-12 transition-transform">⛓️</span>
                                    IPFS HASH TRANSACTION
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-center items-center gap-4 py-6 mt-4">
                            {request.status === "VERIFIED_BY_UNIVERSITY" ? (
                                <>
                                    <button
                                        onClick={() => { onReject(request.id); onClose(); }}
                                        className="px-10 py-3 rounded-xl text-sm font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 transition border-2 border-rose-200"
                                    >
                                        Reject Request
                                    </button>
                                    <button
                                        onClick={() => { onApprove(request.id); onClose(); }}
                                        className="px-16 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-xl shadow-emerald-200 transition-all hover:scale-105 active:scale-95"
                                    >
                                        Approve & Verify Permanently
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={onClose}
                                    className="px-12 py-3 rounded-xl text-sm font-bold bg-gray-800 text-white hover:bg-black transition-all"
                                >
                                    Close Details
                                </button>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const DetailItem = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-[10px] font-bold text-emerald-600/50 uppercase tracking-widest leading-none mb-1">{label}</span>
        <span className="text-sm font-semibold text-gray-800">{value || 'N/A'}</span>
    </div>
);

export default RequestDetailsModal;
