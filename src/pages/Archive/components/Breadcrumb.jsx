import React from 'react';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ items, onNavigate }) => {
    return (
        <div className="breadcrumb" id="breadcrumb">
            {items.map((item, index) => (
                <span key={index}>
                    {index === items.length - 1 ? (
                        <span>{item.name}</span>
                    ) : (
                        <>
                            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(item); }}>{item.name}</a>
                            <ChevronRight size={14} />
                        </>
                    )}
                </span>
            ))}
        </div>
    );
};

export default Breadcrumb;
