import React from 'react';
import Dashboard from '../components/Dashboard';

const DashboardPage: React.FC = () => {
    return(
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <Dashboard dashboardData={{ 
                totalStudents: 500, 
                vaccinatedStudents: 450, 
                vaccinationPercentage: 90, 
                upcomingDrives: ["Drive 1", "Drive 2"] 
            }} />
        </div>
    )
}

export default DashboardPage;