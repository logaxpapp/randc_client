import React, { useState } from 'react';
import TenantRegistrationForm from './TenantRegistrationForm';
import UserRegistrationForm from './UserRegistrationForm';

const RegistrationPage = () => {
  const [tenant, setTenant] = useState(null);

  return (
    <div>
      {!tenant ? (
        <TenantRegistrationForm onTenantCreated={setTenant} />
      ) : (
        <UserRegistrationForm tenantId={tenant._id} tenantName={tenant.name} email={tenant.email} />
      )}
    </div>
  );
};

export default RegistrationPage;
