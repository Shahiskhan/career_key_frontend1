import React from "react";

const JobCard = ({ title, company, location, description, url, jobType, salary, source, postedDate }) => (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col justify-between h-full">
        <div>
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 pr-2">
                    <h4 className="font-bold text-lg text-gray-800 line-clamp-2" title={title}>{title}</h4>
                    <p className="text-sm text-gray-500 font-medium">{company}</p>
                </div>
                {source && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full uppercase whitespace-nowrap">
                        {source}
                    </span>
                )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4 text-xs text-gray-600">
                {location && <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">📍 {location}</span>}
                {jobType && <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">💼 {jobType.replace('_', ' ')}</span>}
                {salary && <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">💰 {salary}</span>}
                {postedDate && <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">📅 {postedDate}</span>}
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {description ? description.replace(/<[^>]*>?/gm, '') : "No description available."}
            </p>
        </div>

        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full block text-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm font-semibold rounded-lg hover:shadow-md transition hover:from-emerald-700 hover:to-green-700"
        >
            View Details & Apply
        </a>
    </div>
);

const JobRecommendations = ({ jobs, title = "Job Search Results" }) => (
    <section id="jobs" className="mb-10">
        <h3 className="text-3xl font-bold mb-6 text-gray-900 text-center">{title}</h3>
        {jobs && jobs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job, index) => (
                    <JobCard key={index} {...job} />
                ))}
            </div>
        ) : (
            <div className="text-center text-gray-500 py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-lg">No jobs found. Try searching for different keywords.</p>
            </div>
        )}
    </section>
);

export default JobRecommendations;
