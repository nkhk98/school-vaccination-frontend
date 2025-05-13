import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { createVaccinationDrive, updateVaccinationDrive, getVaccinationDriveById } from '../api';
import type { VaccinationDrive } from '../../public/type';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'; // Import AxiosError

//interface ApiErrorResponse {
//    message?: string;
//}

const VaccinationDriveForm: React.FC = () => {
    const [vaccineName, setVaccineName] = useState('');
    const [date, setDate] = useState<Date | null>(null);
    const [availableDoses, setAvailableDoses] = useState<number | string>(''); // Use union type
    const [applicableClasses, setApplicableClasses] = useState<string[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for validation error message
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();

    const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];

    useEffect(() => {
        if (id) {
            setIsEditing(true);
            setLoading(true);
            getVaccinationDriveById(id)
                .then((drive) => {
                    setVaccineName(drive.vaccineName);
                    setDate(new Date(drive.date));
                    setAvailableDoses(drive.availableDoses);
                    setApplicableClasses(drive.applicableClasses);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching drive:', error);
                    setLoading(false);
                });
        }
    }, [id]);

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = event.target.valueAsDate;
        setDate(selectedDate);
    };

    const handleDosesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        // Allow only positive numbers or empty string
        if (/^\d+$/.test(value) || value === '') {
            setAvailableDoses(value);
        }
    };

    const handleClassChange = (event: any) => {
        const selectedClasses = event.target.value;
        setApplicableClasses(selectedClasses);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessage(null); // Clear any previous error messages

        if (!vaccineName.trim() || !date || !availableDoses || applicableClasses.length === 0) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }
        const doses = Number(availableDoses);
        if (isNaN(doses) || doses < 0) {
            setErrorMessage('Available doses must be a non-negative number.');
            return;
        }

        const driveData: VaccinationDrive = {
            vaccineName,
            date,
            availableDoses: doses,
            applicableClasses,
        };
        setLoading(true);
        try {
            if (isEditing) {
                if (id) {
                    await updateVaccinationDrive(id, driveData);
                }
                alert('Vaccination drive updated successfully!');
            } else {
                await createVaccinationDrive(driveData);
                alert('Vaccination drive created successfully!');
            }
            navigate('/vaccination-drives');
        } catch (error: any) {
            console.error('Error:', error);
            if (axios.isAxiosError(error) && error.response?.status === 400 && error.response.data?.message) {
                // Display the specific message from the API
                setErrorMessage(error.response.data.message);
            } else {
                // Display a generic error message for other errors
                setErrorMessage(error.message || 'Failed to save drive');
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
                label="Vaccine Name"
                value={vaccineName}
                onChange={(e) => setVaccineName(e.target.value)}
                required
                fullWidth
            />
            <TextField
                label="Date"
                type="date"
                value={date ? date.toISOString().split('T')[0] : ''}
                onChange={handleDateChange}
                required
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                label="Available Doses"
                value={availableDoses}
                onChange={handleDosesChange}
                required
                fullWidth
                type="number" // Use type="number"
            />
            <FormControl fullWidth required>
                <InputLabel id="applicable-classes-label">Applicable Classes</InputLabel>
                <Select
                    labelId="applicable-classes-label"
                    multiple
                    value={applicableClasses}
                    onChange={handleClassChange}
                    label="Applicable Classes"
                    renderValue={(selected) => selected.join(', ')}
                >
                    {classes.map((c) => (
                        <MenuItem key={c} value={c}>
                            {c}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText>Select applicable classes</FormHelperText>
            </FormControl>

            <Button type="submit" variant="contained" disabled={loading} fullWidth>
                {loading ? 'Saving...' : isEditing ? 'Update Drive' : 'Create Drive'}
            </Button>
        </form>
    );
};

export default VaccinationDriveForm;