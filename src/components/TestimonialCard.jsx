import React from "react";

const TestimonialCard = ({ text, name, role }) => (
    <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-emerald-100 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
        <div className="flex items-start mb-4 sm:mb-6">
            <div className="text-yellow-400 text-xl sm:text-2xl">
                {"★★★★★"}
            </div>
        </div>
        <p className="text-gray-700 mb-5 sm:mb-6 text-base sm:text-lg leading-relaxed italic">"{text}"</p>
        <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-bold text-base sm:text-lg">
                {name.charAt(0)}
            </div>
            <div>
                <div className="font-bold text-sm sm:text-base text-slate-800">{name}</div>
                <div className="text-xs sm:text-sm text-emerald-600">{role}</div>
            </div>
        </div>
    </div>
);

export default TestimonialCard;

