export interface Student {
    _id?: string;
    name: string;
    class: string;
    studentId: string;
     dateOfBirth?: Date;
    vaccinationStatus: VaccinationStatus[];
    driveDate?: Date;
    driveId?: number; //  ID of the vaccination drive. 
}

export interface VaccinationStatus {
    vaccineName: string;
    date: Date;
    driveId?: string; //  ID of the vaccination drive.
}

export interface VaccinationDrive {
    _id?: string;
    vaccineName: string;
    date: Date;
    availableDoses: number;
    applicableClasses: string[];
}


export interface DashboardData {
totalStudents: number;
vaccinatedStudents: number;
vaccinationPercentage: string;
upcomingDrives: VaccinationDrive[];
}
