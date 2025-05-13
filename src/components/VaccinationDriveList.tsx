import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { getAllVaccinationDrives, deleteVaccinationDrive } from '../api';
import type { VaccinationDrive } from '../../public/type';


import { format } from 'date-fns';
import { Link } from 'react-router-dom';
    const VaccinationDriveList: React.FC = () => {
        const [vaccinationDrives, setVaccinationDrives] = useState<VaccinationDrive[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
            const fetchVaccinationDrives = async () => {
                try {
                    const data = await getAllVaccinationDrives();
                    setVaccinationDrives(data);
                    setLoading(false);
                } catch (err: any) {
                    setError(err.message || 'Failed to fetch drives');
                    setLoading(false);
                }
            };

            fetchVaccinationDrives();
        }, []);

        const handleDelete = async (id: string) => {
            if (window.confirm('Are you sure you want to delete this vaccination drive?')) {
                try {
                    await deleteVaccinationDrive(id);
                    setVaccinationDrives(vaccinationDrives.filter((drive) => drive._id !== id));
                    alert('Vaccination drive deleted successfully!');
                } catch (err: any) {
                    console.error('Error deleting drive:', err);
                    alert(`Error deleting drive: ${err.message || 'Failed to delete drive'}`);
                }
            }
        };

        if (loading) {
            return <div>Loading vaccination drives...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        return (
            <>
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Vaccine Name</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Available Doses</TableCell>
                                    <TableCell>Applicable Classes</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {vaccinationDrives.map((drive) => (
                                    <TableRow key={drive._id}>
                                        <TableCell>{drive.vaccineName}</TableCell>
                                        <TableCell>{format(new Date(drive.date), 'PPP')}</TableCell>
                                        <TableCell>{drive.availableDoses}</TableCell>
                                        <TableCell>{drive.applicableClasses.join(', ')}</TableCell>
                                        <TableCell>
                                            <div className="space-x-2">
                                                <Link to={`/vaccination-drives/edit/${drive._id}`}>
                                                    <Button variant="outlined" size="small">
                                                        <Edit />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => drive._id && handleDelete(drive._id)}
                                                    color="error"
                                                >
                                                    <Delete />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                <Link to="/vaccination-drives/add">
                    <Button variant="contained" className="mt-4">Add New Drive</Button>
                </Link>
            </>
        );
    };

    export default VaccinationDriveList;