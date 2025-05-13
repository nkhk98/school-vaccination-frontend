import React, { useState } from 'react';
    import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
    import StudentsPage from './pages/StudentsPage';
    import VaccinationDrivesPage from './pages/VaccinationDrivesPage';
    import { Logout } from '@mui/icons-material';
    import DashboardPage from './pages/DashboardPage';
    import LoginPage from './components/LoginPage';
    import ReportPage from './pages/ReportPage';
    import StudentForm from './components/StudentForm';
    import VaccinationDriveForm from './components/VaccinationDriveForm';

    const App: React.FC = () => {
        // Simulated login
        const [isLoggedIn, setIsLoggedIn] = useState(false);
        
        const handleLogin = () => {
            setIsLoggedIn(true);
        };
        const handleLogout = () => {
            setIsLoggedIn(false);
        };

        if (!isLoggedIn) {
            return (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <p className="text-lg mb-4">Please log in to access the application.</p>
                        <LoginPage onLogin={handleLogin} />
                    </div>
                </div>
            );
        }

        return (
            <Router>
                <div className="flex h-screen">
                    {/* Sidebar (Navbar) */}
                    <div className="w-64 bg-gray-100 p-4">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-xl font-bold">School Vaccination Portal</h1>
                            <button onClick={handleLogout} className="flex items-center">
                                <Logout className="mr-2 h-4 w-4" /> Log Out
                            </button>
                        </div>
                        <nav className="space-y-4">
                            <Link to="/dashboard">
                                <button className="btn btn-secondary w-full">Dashboard</button>
                            </Link>
                            <Link to="/students">
                                <button className="btn btn-secondary w-full">Students</button>
                            </Link>
                            <Link to="/vaccination-drives">
                                <button className="btn btn-secondary w-full">Vaccination Drives</button>
                            </Link>
                            <Link to="/report">
                                <button className="btn btn-secondary w-full">Report</button>
                            </Link>
                        </nav>
                    </div>
    
                    {/* Main Content Area */}
                    <div className="flex-1 p-4 overflow-auto">
                        <Routes>
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/students" element={<StudentsPage />} />
                            <Route path="/students/add" element={<StudentForm />} />
                            <Route path="/students/edit/:id" element={<StudentForm />} />
                            <Route path="/vaccination-drives" element={<VaccinationDrivesPage />} />
                            <Route path="/vaccination-drives/add" element={<VaccinationDriveForm />} />
                            <Route path="/vaccination-drives/edit/:id" element={<VaccinationDriveForm />} />
                            <Route path="/report" element={<ReportPage />} />
                            <Route path="/" element={<DashboardPage />} /> {/* Default route */}
                        </Routes>
                    </div>
                </div>
            </Router>
        );
    };
    
    export default App;