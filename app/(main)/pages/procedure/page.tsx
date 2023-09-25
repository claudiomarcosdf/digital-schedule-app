import React from 'react';
import ProcedureList from './ProcedureList';

const ProcedurePage = async () => {
    return (
        <div className="grid">
            <div className="col-12">
                <ProcedureList />
            </div>
        </div>
    );
};

export default ProcedurePage;
