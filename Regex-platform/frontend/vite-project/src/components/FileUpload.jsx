import React, { useState } from 'react';
import { uploadFile, getJobStatus } from '../services/api'

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [naturalLanguagePrompt, setNaturalLanguagePrompt] = useState('');
    const [replacementValue, setReplacementValue] = useState('');
    const [targetColumn, setTargetColumn] = useState('');
    const [loading, setLoading] = useState(false);
    const [jobId, setJobId] = useState(null);
    const [status, setStatus] = useState(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !naturalLanguagePrompt || !replacementValue || !targetColumn) {
            setError('All fields are required');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('original_file', file)
        formData.append('natural_language_prompt', naturalLanguagePrompt)
        formData.append('replacement_value', replacementValue);
        formData.append('target_column', targetColumn);

        try {
            const response = await uploadFile(formData);
            setJobId(response.id);
            setStatus('Processing');
            pollJobStatus(response.id);
        } catch (err) {
            setError('Upload failed:' + JSON.stringify(err));
            setLoading(false);
        }
    };

    const pollJobStatus = async (id) => {
        const interval = setInterval(async () => {
            try {
                const statusData = await getJobStatus(id);
                setStatus(statusData.status);
                setProgress(statusData.progress);
                if (statusData.status === "SUCCESS" || statusData.status === "FAILED") {
                    clearInterval(interval);
                    setLoading(false);
                    if (statusData.status === "FAILED") {
                        setError(statusData.error_message || 'Job failed');
                    }
                }
            } catch (err) {
                clearInterval(interval);
                setLoading(false);
                setError("Failed to get job status");
            }
        }, 2000);
    };

    return (
        <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow'>
            <h2 className='text-2xl font-bold mb-6'>Upload File for Processing</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>
                        File (CSV or Excel)
                    </label>
                    <input
                    type="file"
                    accept='.csv,.xlsx,.xls'
                    onChange={(e) => setFile(e.target.files[0])}
                    className='mt-1 block w-full'
                    required
                    />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>
                        Natural Language Prompt
                    </label>
                    <textarea
                    value={naturalLanguagePrompt}
                    onChange={(e) => setNaturalLanguagePrompt(e.target.value)}
                    placeholder='Enter your prompt here...'
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                    rows="3"
                    required
                    />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>
                        Replacement Value
                    </label>
                    <input
                    type='text'
                    value={replacementValue}
                    onChange={(e) => setReplacementValue(e.target.value)}
                    placeholder='Enter your replacement value'
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                    required
                    />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>
                        Target Column
                    </label>
                    <input
                    type='text'
                    value={targetColumn}
                    onChange={(e) => setTargetColumn(e.target.value)}
                    placeholder='Enter target column name'
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                    required
                    />
                </div>
                <button
                type="submit"
                disabled={loading}
                className='w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50' > {loading ? 'Processing...' : 'Upload and Process'}
                </button>
            </form>
            {jobId && (
                <div className='mt-6 p-4 bg-gray-50 rounded'>
                    <h3 className='font-semibold'>Job Details</h3>
                    <p><strong>Job ID:</strong> {jobId}</p>
                    <p><strong>Status:</strong> {status}</p>
                    <div className='mt-2'>
                        <div className='w-full bg-gray-200 rounded-full h-2.5'>
                            <div className='bg-indigo-600 h-2.5 rounded-full transition-all duration-500'
                            style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className='text-sm text-gray-600 mt-1'>{progress}% complete</p>
                    </div>
                </div>
            )}
            {error && (
                <div className='mt-4 p-3 bg-red-100 text-red-700 rounded'>
                    {error}
                </div>
            )}
        </div>
    );
};

export default FileUpload;