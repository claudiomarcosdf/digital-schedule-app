import { Tooltip } from 'primereact/tooltip';
import { classNames } from 'primereact/utils';
import React, { useRef, useState } from 'react';

interface BlockViewerProps {
    header: string;
    subtitle: string;
    new?: boolean;
    containerClassName?: string;
    previewStyle?: React.CSSProperties;
    children: React.ReactNode;
}

const BlockCard = (props: BlockViewerProps) => {
    return (
        <div className="block-card">
            <div className="block-section">
                <div className="block-header">
                    <span className="block-title">
                        <span>{props.header}</span>
                        {props.new && <span className="badge-new">Novo</span>}
                    </span>
                    <div className="block-subtitle">
                        <p>{props.subtitle}</p>
                    </div>
                </div>
                <div className="block-content">
                    <div className={props.containerClassName} style={props.previewStyle}>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlockCard;
