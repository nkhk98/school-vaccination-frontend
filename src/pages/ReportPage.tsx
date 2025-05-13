import React from 'react';
import Report from '../components/Report';

const ReportPage: React.FC = () => {
    return(
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Vaccination Report</h1>
            <Report/>
        </div>
    )
}

export default ReportPage;