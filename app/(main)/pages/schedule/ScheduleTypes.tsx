import React, { useEffect } from 'react';
import { Button } from 'primereact/button';
import { useProfessionalTypeStore } from '../../../../store/ProfessionalTypeStore';
import { ProfessionalType } from '../../../../types/professional';
import { useScheduleStore } from '../../../../store/ScheduleStore';
import { useProfessionalStore } from '../../../../store/ProfessionalStore';

const ScheduleTypes = () => {
    const getProfessionalTypes = useProfessionalTypeStore((state) => state.getAllProfessionalTypes);
    const professionalTypes = useProfessionalTypeStore((state) => state.professionalTypes);
    const setProfessionalType = useProfessionalTypeStore((state) => state.setProfessionalType);
    const resetProfessional = useProfessionalStore((state) => state.reset);
    const resetSchedule = useScheduleStore((state) => state.reset);

    useEffect(() => {
        if (professionalTypes.length == 0) getProfessionalTypes();
    }, []);

    const onSelectProfessionalType = (professionalType: ProfessionalType) => {
        resetProfessional();
        setProfessionalType(professionalType);
        resetSchedule();
    };

    return (
        <>
            <div className="flex flex-wrap justify-content-center gap-3">
                {professionalTypes.length > 0 ? (
                    professionalTypes.map((item) => <Button key={item.id} onClick={() => onSelectProfessionalType(item)} className="item-profissionaltype" icon="pi pi-calendar-times" label={item.name} style={{ borderRadius: '6px' }}></Button>)
                ) : (
                    <p className="text-primary scalein animation-duration-1000 animation-iteration-infinite">carregando...</p>
                )}
            </div>
        </>
    );
};

export default ScheduleTypes;
