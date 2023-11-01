import React from 'react';
import ProfessionalList from './ProfessionalList';

const ProfessionalPage = async () => {
    return (
        <div className="grid">
            <div className="col-12">
                <ProfessionalList />
            </div>
        </div>
    );
};

export default ProfessionalPage;
