import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiCheckCircle, FiAlertCircle, FiLoader, FiBook, FiHash, FiCalendar, FiFileText, FiChevronLeft, FiHome } from 'react-icons/fi';
import degreeRequestService from '../../services/degreeRequestService';
import { universityService } from '../../services/universityService';
import { useAuth } from '../../contexts/AuthContext';

const DegreeRequestForm = ({ onBack, onSuccess }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [file, setFile] = useState(null);
    const [universities, setUniversities] = useState([]);
    const [formData, setFormData] = useState({
        universityId: '',
        universityName: '',
        program: '',
        rollNumber: '',
        passingYear: new Date().getFullYear(),
        cgpa: '',
        remarks: '',
    });

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const response = await universityService.getAllUniversities();
                if (response.success && Array.isArray(response.data)) {
                    setUniversities(response.data);
                } else if (Array.isArray(response)) {
                    setUniversities(response);
                } else if (response.content && Array.isArray(response.content)) {
                    setUniversities(response.content);
                } else {
                    setUniversities([]);
                }
            } catch (err) {
                console.error("Failed to load universities", err);
            }
        };
        fetchUniversities();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUniversityChange = (e) => {
        const selectedId = e.target.value;
        const selectedUniv = universities.find(u => u.id === selectedId);

        setFormData(prev => ({
            ...prev,
            universityId: selectedId,
            universityName: selectedUniv ? (selectedUniv.name || selectedUniv.universityName) : ""
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const dto = {
                ...formData,
                passingYear: parseInt(formData.passingYear),
                cgpa: parseFloat(formData.cgpa),
            };

            await degreeRequestService.createDegreeRequest(dto, file);
            setSuccess(true);
            setTimeout(() => {
                if (onSuccess) onSuccess();
            }, 2000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to submit degree request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-xl border border-emerald-100"
            >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <FiCheckCircle className="text-emerald-600 w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Submitted!</h2>
                <p className="text-gray-500 text-center max-w-md">
                    Your degree request has been successfully submitted to your university. You can track the status in your dashboard.
                </p>
            </motion.div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={onBack}
                className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium mb-6 transition-colors group"
            >
                <FiChevronLeft className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
            >
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
                    <h2 className="text-3xl font-bold">Request Your Degree</h2>
                    <p className="opacity-90 mt-2">Fill in your academic details to request your official degree certificate from the university.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="flex items-center p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl">
                            <FiAlertCircle className="mr-3 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* University Selection */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center">
                                <FiHome className="mr-2 text-emerald-500" /> Select University
                            </label>
                            <select
                                required
                                name="universityId"
                                value={formData.universityId}
                                onChange={handleUniversityChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-gray-50/50 appearance-none"
                            >
                                <option value="">Select your university...</option>
                                {universities.map(univ => (
                                    <option key={univ.id} value={univ.id}>
                                        {univ.name || univ.universityName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Program */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center">
                                <FiBook className="mr-2 text-emerald-500" /> Degree Program
                            </label>
                            <input
                                required
                                type="text"
                                name="program"
                                placeholder="e.g. BS Computer Science"
                                value={formData.program}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-gray-50/50"
                            />
                        </div>

                        {/* Roll Number */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center">
                                <FiHash className="mr-2 text-emerald-500" /> Roll Number / ID
                            </label>
                            <input
                                required
                                type="text"
                                name="rollNumber"
                                placeholder="e.g. F20-BSCS-001"
                                value={formData.rollNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-gray-50/50"
                            />
                        </div>

                        {/* Passing Year */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center">
                                <FiCalendar className="mr-2 text-emerald-500" /> Passing Year
                            </label>
                            <input
                                required
                                type="number"
                                name="passingYear"
                                min="1900"
                                max="2030"
                                value={formData.passingYear}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-gray-50/50"
                            />
                        </div>

                        {/* CGPA */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center">
                                <FiFileText className="mr-2 text-emerald-500" /> Final CGPA
                            </label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                min="0"
                                max="4"
                                name="cgpa"
                                placeholder="e.g. 3.85"
                                value={formData.cgpa}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-gray-50/50"
                            />
                        </div>
                    </div>

                    {/* Remarks */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Any Remarks (Optional)</label>
                        <textarea
                            name="remarks"
                            rows="3"
                            placeholder="Provide any additional information..."
                            value={formData.remarks}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-gray-50/50 resize-none"
                        ></textarea>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Supporting Documents (Transcript/ID)</label>
                        <div
                            className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center cursor-pointer
                ${file ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 hover:border-emerald-400 hover:bg-gray-50'}`}
                            onClick={() => document.getElementById('file-upload').click()}
                        >
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            <FiUpload className={`w-10 h-10 mb-3 ${file ? 'text-emerald-500' : 'text-gray-400'}`} />
                            <p className="text-gray-600 font-medium">
                                {file ? file.name : 'Click to upload your transcript or ID card'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">PDF, JPG or PNG (Max 5MB)</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-emerald-200/50 hover:scale-[1.01] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <FiLoader className="animate-spin mr-2" /> Submitting Request...
                            </>
                        ) : (
                            'Submit Degree Request'
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default DegreeRequestForm;
