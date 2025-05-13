import React from 'react';
import { Card, CardHeader, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface DashboardData {
  totalStudents: number;
  vaccinatedStudents: number;
  vaccinationPercentage: number;
  upcomingDrives: any[];
}

interface DashboardProps {
  dashboardData: DashboardData;
}

const Dashboard: React.FC<DashboardProps> = ({ dashboardData }) => {
    function isValid(date: Date) {
        return !isNaN(date.getTime());
    }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '24px' }}>
      {/* Top Row of Cards */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 0 300px' }}>
          <Card>
            <CardHeader title="Total Students" />
            <CardContent>
              <Typography variant="h4">{dashboardData.totalStudents}</Typography>
            </CardContent>
          </Card>
        </div>
        <div style={{ flex: '1 0 300px' }}>
          <Card>
            <CardHeader title="Vaccinated Students" />
            <CardContent>
              <Typography variant="h4">{dashboardData.vaccinatedStudents}</Typography>
              <Typography variant="subtitle1">
                ({dashboardData.vaccinationPercentage}%)
              </Typography>
            </CardContent>
          </Card>
        </div>
        <div style={{ flex: '1 0 300px' }}>
          <Card>
            <CardHeader title="Upcoming Vaccination Drives" />
            <CardContent>
              {dashboardData.upcomingDrives.length > 0 ? (
                <ul>
                  {dashboardData.upcomingDrives.map((drive: any) => {
                        const date = new Date(drive.date);
                        const formattedDate = isValid(date) ? format(date, 'PPP') : 'Date not available';
                        return (
                            <li key={drive.date}>
                             {drive.vaccineName} on {formattedDate}
                            </li>
                     );
             })}
                </ul>
              ) : (
                <Typography>No upcoming drives</Typography>
              )}
              <Link to="/vaccination-drives">
                <Button variant="outlined" size="small" className="mt-2">
                  Manage Drives
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Navigation Card */}
      <div>
        <Card>
          <CardHeader title="Quick Navigation" />
          <CardContent>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link to="/students" style={{ textDecoration: 'none' }}>
                <Button variant="contained">Manage Students</Button>
              </Link>
              <Link to="/vaccination-drives" style={{ textDecoration: 'none' }}>
                <Button variant="contained">Manage Vaccination Drives</Button>
              </Link>
              <Link to="/report" style={{ textDecoration: 'none' }}>
                <Button variant="contained">Generate Report</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;