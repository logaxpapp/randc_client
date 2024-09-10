import { useState } from 'react';
import { Box } from '@mui/material';
import TenantSignup from './TenantSignup';
import UserSignup from './UserSignup';

const SignupPage = () => {
    const [tenantId, setTenantId] = useState(null);
  
    return (
      <Box className=" items-center h-screen ">
        {!tenantId ? (
          <TenantSignup onTenantCreated={setTenantId} />
        ) : (
          <UserSignup tenantId={tenantId} />
        )}
      </Box>
    );
  };
  
  export default SignupPage;
  