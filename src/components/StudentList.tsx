import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer, TextField, InputAdornment } from '@mui/material';
import { Delete, Edit, Search,} from '@mui/icons-material';
import { getAllStudents, deleteStudent } from '../api';
import type { Student } from '../../public/type';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const StudentList: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await getAllStudents();
                setStudents(data);
                setLoading(false);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch students');
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await deleteStudent(id);
                setStudents(students.filter((student) => student._id !== id));
                alert('Student deleted successfully!');
            } catch (err: any) {
                console.error('Error deleting student:', err);
                alert(`Error deleting student: ${err.message || 'Failed to delete student'}`);
            }
        }
    };

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div>Loading students...</div>; //  Simple loader
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <TextField
                label="Search Students"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),
                }}
                className="mb-4"
                fullWidth
            />
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Student ID</TableCell>
                                <TableCell>Class</TableCell>
                                <TableCell>Date of Birth</TableCell>
                                <TableCell>Vaccination Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredStudents.map((student) => (
                                <TableRow key={student._id}>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.studentId}</TableCell>
                                    <TableCell>{student.class}</TableCell>
                                     <TableCell>
                                        {student.dateOfBirth
                                            ? format(new Date(student.dateOfBirth), 'PPP')
                                            : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {student.vaccinationStatus.length > 0 ? (
                                            <div>
                                                {student.vaccinationStatus.map((v, index) => (
                                                    <div key={index}>
                                                        {v.vaccineName} on {format(new Date(v.date), 'PPP')}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            'Not Vaccinated'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-x-2">
                                            <Link to={`/students/edit/${student._id}`}>
                                                <Button variant="outlined" size="small">
                                                    <Edit />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => student._id && handleDelete(student._id)}
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
            <Link to="/students/add">
                <Button variant="contained" className="mt-4">Add New Student</Button>
            </Link>
        </>
    );
};

export default StudentList;