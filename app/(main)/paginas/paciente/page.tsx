import React from 'react';
import PatientList from './PatientList';

const PatientPage = async () => {
    return (
        <div className="grid">
            <div className="col-12">
                <PatientList />
            </div>
        </div>
    );
};

export default PatientPage;
