import axios from 'axios';
import type { Student, VaccinationDrive } from '../public/type'; 

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust if your backend runs on a different port/address

// Student API Calls
export const getAllStudents = async () => {
    const response = await axios.get(`${API_BASE_URL}/students`);
    return response.data;
};

export const getStudentById = async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/students/${id}`);
    return response.data;
};

export const createStudent = async (student: Student) => {
    const response = await axios.post(`${API_BASE_URL}/students`, student);
    return response.data;
};

export const updateStudent = async (id: string, student: Student) => {
    const response = await axios.put(`${API_BASE_URL}/students/${id}`, student);
    return response.data;
};

export const deleteStudent = async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/students/${id}`);
    return response.data;
};

export const importStudentsFromCSV = async (file: FormData) => {
  const response = await axios.post(`${API_BASE_URL}/students/import`, file, {
    headers: {
      'Content-Type': 'multipart/form-data', // Important for file uploads
    },
  });
  return response.data;
};

export const vaccinateStudent = async (data: { studentId: string; driveId: string }) => {
    const response = await axios.post(`${API_BASE_URL}/students/vaccinate`, data);
    return response.data;
};
export const getVaccinationReport = async (studentId: string) => {
  const response = await axios.get(`${API_BASE_URL}/students/report/${studentId}`);
  return response.data;
};

// Vaccination Drive API Calls
export const getAllVaccinationDrives = async () => {
    const response = await axios.get(`${API_BASE_URL}/vaccination-drives`);
    return response.data;
};

export const getVaccinationDriveById = async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/vaccination-drives/${id}`);
    return response.data;
};

export const createVaccinationDrive = async (drive: VaccinationDrive) => {
    const response = await axios.post(`${API_BASE_URL}/vaccination-drives`, drive);
    return response.data;
};

export const updateVaccinationDrive = async (id: string, drive: VaccinationDrive) => {
    const response = await axios.put(`${API_BASE_URL}/vaccination-drives/${id}`, drive);
    return response.data;
};

export const deleteVaccinationDrive = async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/vaccination-drives/${id}`);
    return response.data;
};

export const getDashboardData = async() => {
   const response = await axios.get(`${API_BASE_URL}/students/dashboard/data`);
   return response.data;
}