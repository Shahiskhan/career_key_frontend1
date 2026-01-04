import React, { useState, useEffect } from "react";
import degreeRequestService from "../../services/degreeRequestService";
import degreeImage from "../../assets/images/buy-college-degree-from-the-riphah-international-university.jpg";
import { FiLoader, FiCheckCircle, FiClock, FiShield } from "react-icons/fi";

const RequestDetailsModal = ({ request, onClose, onApprove, onReject, onUpdate, onRefresh }) => {
    const [isStamping, setIsStamping] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isQrStamping, setIsQrStamping] = useState(false);
    const [isAnchoring, setIsAnchoring] = useState(false);

    // Safety check: normalized status from backend
    const initialStatus = request.documentStatus || (request.stampedByHec ? 'HEC_STAMPED' : 'PENDING');
    const [documentStatus, setDocumentStatus] = useState(initialStatus);

    const [ipfsHash, setIpfsHash] = useState(request.ipfsHash || null);
    const [ipfsProvider, setIpfsProvider] = useState(request.ipfsProvider || "https://ipfs.io/ipfs/");
    const [currentDocumentBase64, setCurrentDocumentBase64] = useState(request.documentBase64 || null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Effect to handle base64 to Blob URL conversion
    useEffect(() => {
        if (currentDocumentBase64) {
            try {
                const byteCharacters = atob(currentDocumentBase64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);

                setPreviewUrl(url);

                // Cleanup function to revoke URL
                return () => URL.revokeObjectURL(url);
            } catch (err) {
                console.error("Error creating preview URL:", err);
            }
        } else {
            setPreviewUrl(null);
        }
    }, [currentDocumentBase64]);

    // SYNC with parent data updates
    useEffect(() => {
        if (request.documentStatus) setDocumentStatus(request.documentStatus);
        if (request.stampedByHec !== undefined) {
            // We can still use this info to update status if needed, 
            // but initialStatus already handles it.
        }
        if (request.ipfsHash) setIpfsHash(request.ipfsHash);
        if (request.ipfsProvider) setIpfsProvider(request.ipfsProvider);
        if (request.documentBase64) setCurrentDocumentBase64(request.documentBase64);
    }, [request]);

    const handleStoreResult = async () => {
        setIsAnchoring(true);
        try {
            const response = await degreeRequestService.storeResultOnBlockchain(request.id);
            if (response.success && response.data) {
                const txData = response.data;
                const newStatus = 'BLOCKCHAIN_ANCHORED';

                setDocumentStatus(newStatus);

                // Notify parent about the update
                if (onUpdate) {
                    onUpdate({
                        ...request,
                        blockchainTransaction: {
                            transactionHash: txData.transactionHash,
                            status: txData.status,
                            blockNumber: txData.blockNumber
                        },
                        documentStatus: newStatus
                    });
                }

                if (onRefresh) onRefresh();
                alert(`SUCCESS: Result anchored to Blockchain!\nTx Hash: ${txData.transactionHash}`);
            } else {
                throw new Error(response.message || "Failed to anchor to blockchain");
            }
        } catch (err) {
            console.error("Blockchain anchoring failed:", err);
            alert("Blockchain Error: " + (err.message || "Unknown error"));
        } finally {
            setIsAnchoring(false);
        }
    };

    if (!request) return null;

    const handleOpenFull = () => {
        if (previewUrl) {
            window.open(previewUrl, '_blank');
        } else if (!currentDocumentBase64) {
            window.open(degreeImage, '_blank');
        }
    };

    const handleStamp = async () => {
        setIsStamping(true);
        try {
            const response = await degreeRequestService.stampDegreeRequest(request.id);
            if (response.success && response.data) {
                const stampedData = response.data;
                const newStatus = stampedData.documentStatus || 'HEC_STAMPED';

                // Update local state with stamped base64
                setCurrentDocumentBase64(stampedData.base64);
                setDocumentStatus(newStatus);

                // Notify parent about the update to ensure persistence in the UI
                if (onUpdate) {
                    onUpdate({
                        ...request,
                        documentBase64: stampedData.base64,
                        stampedByHec: true,
                        documentStatus: newStatus
                    });
                }

                // We no longer trigger download here as per user request
                // The document will be updated in the preview iframe automatically
                if (onRefresh) onRefresh(); // Trigger parent reload FIRST
                // Show success message
                alert("Digital QR Stamp applied successfully.");
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
            // The response is now the full DegreeRequestDto
            const newIpfsHash = response.ipfsHash;
            const newIpfsProvider = response.ipfsProvider || "https://ipfs.io/ipfs/";
            const newStatus = response.documentStatus || 'IPFS_UPLOADED';

            setIpfsHash(newIpfsHash);
            setIpfsProvider(newIpfsProvider);
            setDocumentStatus(newStatus);

            // Notify parent about the full update
            if (onUpdate) {
                onUpdate(response);
            }

            if (onRefresh) onRefresh(); // Trigger parent reload FIRST
            alert(`Document uploaded to IPFS!\n\nHash: ${newIpfsHash}`);
        } catch (err) {
            console.error("IPFS upload failed:", err);
            alert("IPFS storage failed. " + (err.response?.data || err.message));
        } finally {
            setIsUploading(false);
        }
    };

    const handleQrStamp = async () => {
        setIsQrStamping(true);
        try {
            const response = await degreeRequestService.qrStampDegreeRequest(request.id);
            if (response.success && response.data) {
                const stampedData = response.data;
                const newStatus = 'QR_GENERATED';

                // Update local state with QR-stamped base64
                setCurrentDocumentBase64(stampedData.base64);
                setDocumentStatus(newStatus);

                // Notify parent about the update
                if (onUpdate) {
                    onUpdate({
                        ...request,
                        documentBase64: stampedData.base64,
                        documentStatus: newStatus
                    });
                }

                if (onRefresh) onRefresh();
                alert("Verification QR Code embedded into PDF successfully.");
            } else {
                throw new Error(response.message || "Failed to apply QR stamp");
            }
        } catch (err) {
            console.error("QR Stamping failed:", err);
            alert("QR Stamp failed: " + (err.message || "Unknown error"));
        } finally {
            setIsQrStamping(false);
        }
    };

    const getStatusOrder = (status) => {
        const orders = {
            'PENDING': 0,
            'HEC_STAMPED': 1,
            'IPFS_UPLOADED': 2,
            'QR_GENERATED': 3,
            'BLOCKCHAIN_ANCHORED': 4
        };
        return orders[status] || 0;
    };

    const currentStatusOrder = getStatusOrder(documentStatus);

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
                    {ipfsHash && (documentStatus === 'IPFS_UPLOADED' || documentStatus === 'QR_GENERATED' || documentStatus === 'BLOCKCHAIN_ANCHORED') && (
                        <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-[1.5rem] p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl shadow-blue-500/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <FiShield size={80} className="text-blue-900" />
                                </div>
                                <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                                    <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-200 rotate-3">
                                        <FiCheckCircle size={28} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-blue-950 font-black text-lg tracking-tight">Decentralized Storage Verified</h4>
                                        <p className="text-blue-700/80 text-sm font-medium">Document permanently anchored to IPFS Network</p>
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className="text-[10px] font-mono bg-blue-100/50 text-blue-800 px-2 py-0.5 rounded-md">HASH: {ipfsHash.substring(0, 24)}...</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 relative z-10 w-full sm:w-auto">
                                    <a
                                        href={`${ipfsProvider}${ipfsHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 sm:flex-none bg-blue-600 text-white px-8 py-3 rounded-xl text-xs font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        VIEW ON IPFS ↗
                                    </a>
                                </div>

                                {request.blockchainTransaction && (
                                    <div className="w-full mt-4 pt-4 border-t border-blue-100/50 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                                                <span className="text-xl">⛓️</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h5 className="text-indigo-950 font-bold text-sm uppercase tracking-wider">Blockchain Evidence</h5>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${request.blockchainTransaction.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {request.blockchainTransaction.status}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-4 mt-1">
                                                    <div className="text-[10px] font-mono text-indigo-700 bg-white/50 px-2 py-1 rounded-md border border-indigo-50">
                                                        TX: {request.blockchainTransaction.transactionHash.substring(0, 32)}...
                                                    </div>
                                                    {request.blockchainTransaction.blockNumber && (
                                                        <div className="text-[10px] font-mono text-indigo-700 bg-white/50 px-2 py-1 rounded-md border border-indigo-50">
                                                            BLOCK: #{request.blockchainTransaction.blockNumber}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <a
                                                href={`https://sepolia.etherscan.io/tx/${request.blockchainTransaction.transactionHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-[10px] font-black hover:bg-indigo-100 transition-all border border-indigo-100"
                                            >
                                                EXPLORER ↗
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
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
                                        <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm transition-all hover:shadow-md">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">IPFS CONTENT HASH</span>
                                                    <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                                                </div>
                                                <a
                                                    href={`${ipfsProvider}${ipfsHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white bg-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-md active:scale-95"
                                                >
                                                    View on IPFS ↗
                                                </a>
                                            </div>
                                            <div className="relative group">
                                                <div className="text-[10px] font-mono break-all text-blue-900 bg-white/80 p-3 rounded-xl border border-blue-100/50 group-hover:border-blue-300 transition-colors">
                                                    {ipfsHash}
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(ipfsHash);
                                                        alert("Hash copied to clipboard!");
                                                    }}
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-all text-blue-600"
                                                    title="Copy Hash"
                                                >
                                                    📋
                                                </button>
                                            </div>
                                            <p className="mt-2 text-[9px] text-blue-600/70 italic font-medium leading-tight">
                                                Secured via InterPlanetary File System. Decentralized and immutable.
                                            </p>
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
                                <div className="flex-1 overflow-auto bg-gray-800 flex items-center justify-center p-3">
                                    {currentDocumentBase64 ? (
                                        <div className="w-full h-full flex flex-col items-center">
                                            {/* Preview of the document */}
                                            <div className="relative w-full h-[600px] border-4 border-emerald-500/30 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-2xl">
                                                <iframe
                                                    src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                                    className="w-full h-full border-none"
                                                    title="Degree Stamped Preview"
                                                />
                                                <div className="absolute top-0 left-0 w-full h-full pointer-events-none border-4 border-white/10"></div>
                                            </div>

                                            <div className="mt-3 flex gap-4">
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
                                <div className="bg-emerald-900 text-emerald-100 px-6 py-2 flex flex-wrap justify-between items-center text-[10px] font-mono tracking-wider gap-4">
                                    <div className="flex items-center gap-6">
                                        <span className="flex items-center gap-2">
                                            <span className="text-emerald-500/50">STATUS:</span>
                                            <span className="font-bold">{documentStatus.replace(/_/g, ' ')}</span>
                                        </span>
                                        {ipfsHash && (
                                            <a
                                                href={`${ipfsProvider}${ipfsHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-300 hover:text-blue-200 underline decoration-blue-500/50 underline-offset-4 flex items-center gap-1.5"
                                            >
                                                <span className="text-emerald-500/50">IPFS:</span>
                                                {ipfsHash.substring(0, 16)}... ↗
                                            </a>
                                        )}
                                    </div>
                                    <span className="flex items-center gap-2">
                                        <span className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)] ${documentStatus === 'BLOCKCHAIN_ANCHORED' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                                        {documentStatus === 'BLOCKCHAIN_ANCHORED' ? 'BLOCKCHAIN SECURED' : 'VERIFICATION ACTIVE'}
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
                                    disabled={isStamping || currentStatusOrder >= 1}
                                    className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black bg-white text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white shadow-lg shadow-emerald-100 transition-all hover:-translate-y-1 active:scale-95 group disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-white disabled:hover:text-emerald-600"
                                >
                                    {isStamping ? <FiLoader className="animate-spin" /> : <span>🏷️</span>}
                                    {currentStatusOrder >= 1 ? "ALREADY STAMPED" : isStamping ? "STAMPING..." : "STAMP DOCUMENT"}
                                </button>
                                <button
                                    onClick={handleIpfsUpload}
                                    disabled={isUploading || currentStatusOrder >= 2}
                                    className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black bg-white text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white shadow-lg shadow-emerald-100 transition-all hover:-translate-y-1 active:scale-95 group disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-white disabled:hover:text-emerald-600"
                                >
                                    {isUploading ? <FiLoader className="animate-spin" /> : <span>☁️</span>}
                                    {currentStatusOrder >= 2 ? "UPLOADED TO IPFS" : isUploading ? "UPLOADING..." : "UPLOAD TO IPFS"}
                                </button>
                                <button
                                    onClick={handleQrStamp}
                                    disabled={isQrStamping || currentStatusOrder >= 3}
                                    className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black bg-white text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white shadow-lg shadow-emerald-100 transition-all hover:-translate-y-1 active:scale-95 group disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-white disabled:hover:text-emerald-600"
                                >
                                    {isQrStamping ? <FiLoader className="animate-spin" /> : <span className="text-xl group-hover:rotate-12 transition-transform">📄</span>}
                                    {currentStatusOrder >= 3 ? "QR PRINTED" : isQrStamping ? "PRINTING..." : "PRINT QR CODE"}
                                </button>
                                <button
                                    onClick={handleStoreResult}
                                    disabled={isAnchoring || currentStatusOrder >= 4}
                                    className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black bg-white text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white shadow-lg shadow-emerald-100 transition-all hover:-translate-y-1 active:scale-95 group disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-white disabled:hover:text-emerald-600"
                                >
                                    {isAnchoring ? <FiLoader className="animate-spin" /> : <span className="text-xl group-hover:rotate-12 transition-transform">⛓️</span>}
                                    {currentStatusOrder >= 4 ? "BLOCKCHAIN ANCHORED" : isAnchoring ? "ANCHORING..." : "ANCHOR TO BLOCKCHAIN"}
                                </button>
                            </div>
                        </div>

                        {request.blockchainTransaction && (
                            <div className="bg-indigo-50/50 border-2 border-indigo-100 rounded-3xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                                            <FiShield size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-indigo-950 font-bold text-sm tracking-tight uppercase">Blockchain Transaction Receipt</h4>
                                            <p className="text-indigo-600/70 text-[10px] font-bold">ETHEREUM NETWORK (SEPOLIA)</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${request.blockchainTransaction.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {request.blockchainTransaction.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-indigo-300 uppercase">Transaction Hash</span>
                                        <div className="flex items-center gap-2">
                                            <code className="text-[10px] bg-white border border-indigo-100 px-2 py-1.5 rounded-lg text-indigo-900 break-all flex-1">
                                                {request.blockchainTransaction.transactionHash}
                                            </code>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(request.blockchainTransaction.transactionHash);
                                                    alert("Tx Hash copied!");
                                                }}
                                                className="p-1.5 hover:bg-white rounded-lg transition-colors text-indigo-400"
                                            >
                                                📋
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-end justify-start md:justify-end gap-3">
                                        <a
                                            href={`https://sepolia.etherscan.io/tx/${request.blockchainTransaction.transactionHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-2.5 bg-indigo-600 text-white text-[10px] font-black rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 flex items-center gap-2"
                                        >
                                            VERIFY ON ETHERSCAN ↗
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

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
