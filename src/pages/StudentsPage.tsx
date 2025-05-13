import React from 'react';
import StudentList from '../components/StudentList';
import StudentForm from '../components/StudentForm';
import UploadCSV from '../components/UploadCSV';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs/tabs"

const StudentsPage: React.FC = () => {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Student Management</h1>
         <Tabs defaultValue="list" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="list">Student List</TabsTrigger>
              <TabsTrigger value="add">Add Student</TabsTrigger>
              <TabsTrigger value="upload">Upload CSV</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
               <StudentList />
            </TabsContent>
            <TabsContent value="add">
              <StudentForm />
            </TabsContent>
            <TabsContent value="upload">
                <UploadCSV/>
            </TabsContent>
          </Tabs>
      </div>
    );
};

export default StudentsPage;