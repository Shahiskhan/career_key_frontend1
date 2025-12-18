import React from "react";

const StepCard = ({ step, title, description }) => (
    <div className="flex flex-col items-center text-center group">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 flex items-center justify-center text-white font-bold text-xl sm:text-2xl mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
            {step}
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-emerald-100 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
            <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-emerald-700">{title}</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
        </div>
    </div>
);

export default StepCard;

