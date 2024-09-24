import React from 'react';
import { useParams } from 'react-router-dom';

const CompanyHome = () => {
    const { userId, empresaId, rolId } = useParams();

    return (
        <div>
            <h1>Welcome to the Company Dashboard</h1>
            <p>User ID: {userId}</p>
            <p>Company ID: {empresaId}</p>
            <p>Role ID: {rolId}</p>
        </div>
    );
};

export default CompanyHome;
