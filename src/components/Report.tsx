import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { getVaccinationReport } from '../api';
import type { Student } from '../../public/type'; // Reuse the Student type
import { format, isValid } from 'date-fns'; // Import isValid
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const Report: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [reportData, setReportData] = useState<
    {
      vaccineName: string;
      date: Date;
      driveDate: Date;
      driveId: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableStudentIds, setAvailableStudentIds] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'excel'>('csv'); // 'csv' or 'excel'

  useEffect(() => {
    // Fetch all student IDs for the dropdown.
    const fetchStudentIds = async () => {
      try {
        const students = await getAllStudents();
        const ids = students.map((student) => student.studentId);
        setAvailableStudentIds(ids);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch student IDs');
      }
    };
    fetchStudentIds();
  }, []);

  const handleGenerateReport = async () => {
    if (!studentId) {
      alert('Please enter a Student ID.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getVaccinationReport(studentId);
      if (data && data.length > 0) {
        setReportData(data);
      } else {
        setReportData([]); // Clear any previous data
        alert('No vaccination records found for this student.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate report');
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!reportData || reportData.length === 0) {
      alert('No data to download.');
      return;
    }
    if (selectedFormat === 'csv') {
      downloadCSV();
    } else {
      downloadExcel();
    }
  };

  const downloadCSV = () => {
    const header = 'Vaccine Name,Vaccination Date,Drive Date,Drive ID\n';
    const rows = reportData.map((item) => {
      const validDate = isValid(new Date(item.date)) ? format(new Date(item.date), 'yyyy-MM-dd') : '';
      const validDriveDate = isValid(new Date(item.driveDate)) ? format(new Date(item.driveDate), 'yyyy-MM-dd') : '';
      return `${item.vaccineName},${validDate},${validDriveDate},${item.driveId}`;
    });
    const csvContent = header + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'vaccination_report.csv');
  };

  const downloadExcel = () => {
    // Prepare the header row
    const headers = Object.keys(reportData[0] || {
      'Vaccine Name': '',
      'Vaccination Date': '',
      'Drive Date': '',
      'Drive ID': '',
    });

    // Prepare the data rows
    const dataRows = reportData.map((item) => {
      const validDate = isValid(new Date(item.date)) ? format(new Date(item.date), 'yyyy-MM-dd') : '';
      const validDriveDate = isValid(new Date(item.driveDate)) ? format(new Date(item.driveDate), 'yyyy-MM-dd') : '';

      return [item.vaccineName, validDate, validDriveDate, item.driveId];
    });

    // Combine headers and data rows
    const dataForSheet = [headers, ...dataRows];

    // Create the worksheet using aoa_to_sheet
    const worksheet = XLSX.utils.aoa_to_sheet(dataForSheet);
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    saveAs(blob, 'vaccination_report.xlsx');
  };

  return (
    <>
      <div className="mb-4">
        <FormControl fullWidth>
          {' '}
          {/* Added fullWidth to FormControl */}
          <InputLabel id="student-id-label">Student ID</InputLabel>
          <Select
            labelId="student-id-label"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            label="Student ID"
          >
            {availableStudentIds.map((id) => (
              <MenuItem key={id} value={id}>
                {id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleGenerateReport}
          disabled={loading}
          className="ml-4"
        >
          {loading ? 'Loading...' : 'Generate Report'}
        </Button>
      </div>

      {error && <div>Error: {error}</div>}

      {reportData && reportData.length > 0 && (
        <>
          <Paper className="mb-4">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Vaccine Name</TableCell>
                    <TableCell>Vaccination Date</TableCell>
                    <TableCell>Drive Date</TableCell>
                    <TableCell>Drive ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.vaccineName}</TableCell>
                      <TableCell>
                        {isValid(new Date(item.date))
                          ? format(new Date(item.date), 'PPP')
                          : 'Invalid Date'}
                      </TableCell>
                      <TableCell>
                        {isValid(new Date(item.driveDate))
                          ? format(new Date(item.driveDate), 'PPP')
                          : 'Invalid Date'}
                      </TableCell>
                      <TableCell>{item.driveId}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <div className="mb-4">
            <FormControl fullWidth>
              {' '}
              {/* Added fullWidth to FormControl */}
              <InputLabel id="format-label">Download Format</InputLabel>
              <Select
                labelId="format-label"
                value={selectedFormat}
                onChange={(e) =>
                  setSelectedFormat(e.target.value as 'csv' | 'excel')
                }
                label="Format"
              >
                <MenuItem value="csv">CSV</MenuItem>
                <MenuItem value="excel">Excel</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleDownload}
              className="ml-4"
            >
              Download Report
            </Button>
          </div>
        </>
      )}
    </>
  );
};

async function getAllStudents() {
  try {
    const response = await fetch('http://localhost:5000/api/students'); // Replace with your actual API endpoint
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    const students: Student[] = await response.json();
    return students;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
}

export default Report;

