import React, { useState, useEffect } from 'react';
import { getAllJobs, downloadResult } from '../services/api';

const JobsList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetchJobs();
        const interval = setInterval(fetchJobs, 5000);
        return () => clearInterval(interval);
    }, []);
    const fetchJobs = async () => {
        try {
            const data = await getAllJobs();
            setJobs(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch jobs');
            setLoading(false);
        }
    };

    const handleDownload = async (jobId) => {
        try {
            const response = await downloadResult(jobId);
            if (response.download_url) {
                window.open(`${import.meta.env.VITE_API_BASE_URL}${response.download_url}`, '_blank');
            }
        } catch (error) {
            alert('Failed to download result');
        }
    };

    const getStatusColour = (status) => {
        switch(status) {
            case "SUCCESS": return 'text-green-600'
            case "FAILED": return 'text-red-600'
            case "RUNNING": return 'text-yellow-600'
            default: return 'text-gray-600';
        }
    };
    if (loading) return <div>Loading jobs...</div>
    if (error) return <div className='text-red-600'>{error}</div>

    return (
        <div className='mt-8'>
            <h2 className='text-2xl font-bold mb-4'>Recent Jobs</h2>
            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Job ID</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Status</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Progress</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Target Column</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Created</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {jobs.map((job) => (
                            <tr key={job.id}>
                                <td className='px-6 py-4 whitespace-nowrap text-sm'>{job.id}</td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <span className={`text-sm font-medium ${getStatusColour(job.status)}`}>
                                        {job.status}
                                    </span>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='flex items-center'>
                                        <div className='w-24 bg-gray-200 rounded-full h-2.5 mr-2'>
                                            <div
                                            className='bg-indigo-600 h-2.5 rounded-full'
                                            style={{ width: `${job.progress}%` }}
                                            />
                                        </div>
                                        <span className='text-sm'>{job.progress}%</span>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm'>{job.target_column}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm'>
                                    {new Date(job.created_at).toLocaleString()}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm'>
                                    {job.status === "SUCCESS" && (
                                        <button
                                        onClick={() => handleDownload(job.id)}
                                        className='text-indigo-600 hover:text-indigo-900'
                                        >Download</button>
                                    )}
                                    {job.error_message && (
                                        <span className='text-red-600 text-xs' title={job.error_message}>Error</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JobsList;