import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, IconButton } from '@mui/material';
import { createStudent, updateStudent, getStudentById } from '../api';
import type { Student, VaccinationDrive } from '../../public/type';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AddCircle, RemoveCircle } from '@mui/icons-material';

interface StudentFormProps {
    onStudentCreated?: (student: Student) => void;
    onStudentUpdated?: (student: Student) => void;
}

const StudentForm: React.FC<StudentFormProps> = () => {
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [className, setClassName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [vaccinationStatus, setVaccinationStatus] = useState<VaccinationDrive[]>([]);
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [driveDate, setDriveDate] = useState<Date | null>(null);
    const [driveId, setDriveId] = useState<number | undefined>();

    const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];

    useEffect(() => {
        if (id) {
            setIsEditing(true);
            setLoading(true);
            getStudentById(id)
                .then((student) => {
                    setName(student.name);
                    setStudentId(student.studentId);
                    setClassName(student.class);
                    setDateOfBirth(student.dateOfBirth ? new Date(student.dateOfBirth) : null);
                    setVaccinationStatus(student.vaccinationStatus || []);
                    setDriveDate(student.driveDate ? new Date(student.driveDate) : null);
                    setDriveId(student.driveId);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching student:', error);
                    setErrorMessage('Failed to fetch student details.');
                    setLoading(false);
                });
        }
    }, [id]);

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = event.target.valueAsDate;
        setDateOfBirth(selectedDate);
    };

    const handleVaccineNameChange = (index: number, value: string) => {
        const newVaccinationStatus = [...vaccinationStatus];
        newVaccinationStatus[index] = { ...newVaccinationStatus[index], vaccineName: value };
        setVaccinationStatus(newVaccinationStatus);
    };

    const handleVaccinationDateChange = (index: number, value: Date | null) => {
        const newVaccinationStatus = [...vaccinationStatus];
        newVaccinationStatus[index] = { ...newVaccinationStatus[index], date: value ? value : new Date() };
        setVaccinationStatus(newVaccinationStatus);
    };

    const addVaccination = () => {
        setVaccinationStatus([...vaccinationStatus, { vaccineName: '', date: new Date(), availableDoses: 0, applicableClasses: [] }]);
    };

    const removeVaccination = (index: number) => {
        const newVaccinationStatus = vaccinationStatus.filter((_, i) => i !== index);
        setVaccinationStatus(newVaccinationStatus);
    };

    const handleDriveDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = event.target.valueAsDate;
        setDriveDate(selectedDate);
    };

    const handleDriveIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const idValue = parseInt(event.target.value, 10);
        setDriveId(isNaN(idValue) ? undefined : idValue);
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessage(null);

        if (!name.trim() || !studentId.trim() || !className) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        const studentData: Student = {
            name,
            studentId,
            class: className,
            dateOfBirth: dateOfBirth ? dateOfBirth : undefined,
            vaccinationStatus,
            driveDate: driveDate ? driveDate : undefined,
            driveId: driveId !== undefined ? driveId : undefined,
        };

        setLoading(true);
        try {
            if (isEditing && id) {
                await updateStudent(id, studentData);
                alert('Student updated successfully!');
            } else {
                await createStudent(studentData);
                alert('Student added successfully!');
            }
            navigate('/students');
        } catch (error: any) {
            console.error('Error:', error);
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage(error.message || 'Failed to save student');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
                <div style={{ color: 'red' }}>{errorMessage}</div>
            )}
            <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
            />
            <TextField
                label="Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                fullWidth
            />
            <FormControl fullWidth required>
                <InputLabel id="class-name-label">Class</InputLabel>
                <Select
                    labelId="class-name-label"
                    value={className}
                    onChange={(e) => setClassName(e.target.value as string)}
                    label="Class"
                >
                    {classes.map((c) => (
                        <MenuItem key={c} value={c}>
                            {c}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText>Select the student's class</FormHelperText>
            </FormControl>
            <TextField
                label="Date of Birth"
                type="date"
                value={dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : ''}
                onChange={handleDateChange}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
            />

            {/* Vaccination Status */}
            <div>
                <InputLabel>Vaccination Status</InputLabel>
                {vaccinationStatus.map((vaccination, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <TextField
                            label="Vaccine Name"
                            value={vaccination.vaccineName}
                            onChange={(e) => handleVaccineNameChange(index, e.target.value)}
                            required
                            className="flex-1"
                        />
                        <TextField
                            label="Date"
                            type="date"
                            value={vaccination.date ? new Date(vaccination.date).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleVaccinationDateChange(index, (e.target as HTMLInputElement).valueAsDate)}
                            required
                            className="flex-1"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <IconButton onClick={() => removeVaccination(index)} size="small">
                            <RemoveCircle color="error" />
                        </IconButton>
                        {index === vaccinationStatus.length - 1 && (
                            <IconButton onClick={addVaccination} size="small">
                                <AddCircle color="primary" />
                            </IconButton>
                        )}
                    </div>
                ))}
                {vaccinationStatus.length === 0 && (
                    <Button onClick={addVaccination} variant="outlined" size="small">
                        Add Vaccination
                    </Button>
                )}
            </div>

            {/* Drive Date */}
            <TextField
                label="Drive Date"
                type="date"
                value={driveDate ? driveDate.toISOString().split('T')[0] : ''}
                onChange={handleDriveDateChange}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                className="mt-4"
            />

            {/* Drive ID */}
            <TextField
                label="Drive ID"
                type="number"
                value={driveId === undefined ? '' : driveId}
                onChange={handleDriveIdChange}
                fullWidth
                className="mt-2"
            />

            <Button type="submit" variant="contained" disabled={loading} fullWidth>
                {loading ? 'Saving...' : isEditing ? 'Update Student' : 'Add Student'}
            </Button>
        </form>
    );
};

export default StudentForm;

