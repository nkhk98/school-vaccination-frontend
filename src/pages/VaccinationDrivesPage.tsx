import React from 'react';
import VaccinationDriveList from '../components/VaccinationDriveList';
import VaccinationDriveForm from '../components/VaccinationDriveForm';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs/tabs"

const VaccinationDrivesPage: React.FC = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Vaccination Drives</h1>
            <Tabs defaultValue="list" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="list">Vaccination Drives List</TabsTrigger>
                    <TabsTrigger value="add">Add Drive</TabsTrigger>
                </TabsList>
                <TabsContent value="list">
                    <VaccinationDriveList />
                </TabsContent>
                <TabsContent value="add">
                    <VaccinationDriveForm />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default VaccinationDrivesPage;