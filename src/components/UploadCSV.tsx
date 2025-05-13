import React, { useState } from 'react';
import { Button } from '@mui/material';
import { CloudUpload, UploadFile } from '@mui/icons-material';
import { importStudentsFromCSV } from '../api';

const UploadCSV: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file); // 'file' is the field name expected by the backend

        setLoading(true);
        setError(null);
        try {
            await importStudentsFromCSV(formData);
            alert('Students imported successfully!');
            // Optionally, refresh the student list
            //  (you'd need to call a function in the parent component)
            setFile(null); // Clear the selected file after successful upload
        } catch (err: any) {
            setError(err.message || 'Failed to upload CSV');
            console.error('Error uploading CSV:', err);
            alert(`Error uploading CSV: ${err.message || 'Failed to upload CSV'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="csv-upload"
            />
            <label htmlFor="csv-upload">
                <Button variant="outlined" component="span" disabled={loading}>
                    <CloudUpload className="mr-2" />
                    {loading ? 'Uploading...' : 'Upload CSV'}
                </Button>
            </label>
            {file && (
                <span className="ml-2 text-gray-700">
                    Selected file: {file.name}
                </span>
            )}
            <Button
                variant="contained"
                onClick={handleUpload}
                disabled={loading || !file}
                className="ml-4"
            >
                <UploadFile className="mr-2"/>
                Import
            </Button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
    );
};

export default UploadCSV;