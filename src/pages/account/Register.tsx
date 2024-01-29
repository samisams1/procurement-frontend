/*import React from 'react';
import { Box, Container } from '@mui/material';
import { Helmet } from 'react-helmet';
import { UserForm } from '../../components/pageComponents/user/UserForm';

const Register = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="91vh"
    bgcolor="white" // Set the background color to white
    border="1px solid #eee" // Add a border with a light gray color
  >
    <Box p={3}>
      <Helmet>
        <title>Login | Inventory</title>
      </Helmet>
      <Box component="main" sx={{ flexGrow: 1, py: 2 }}>
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <UserForm />
        </Container>
      </Box>
    </Box>
  </Box>
);

export default Register;*/
import React, { useState } from 'react';
import { Typography, Button, Grid } from '@mui/material';
import { UserForm } from '../../components/pageComponents/user/UserForm';

enum Role {
  Customer = 'CUSTOMER',
  Supplier = 'SUPPLIER',
}
const Register: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };
  return (
    <div>
      {!selectedRole ? (
        <RoleSelection onSelectRole={handleRoleSelect} />
      ) : (
        <div>
          <UserForm selectedRole={selectedRole} />
        </div>
      )}
    </div>
  );
};

interface RoleSelectionProps {
  onSelectRole: (role: Role) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole }) => {
  const handleRoleSelect = (role: Role) => {
    onSelectRole(role);
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h4" align="center" gutterBottom>
          Choose your Account
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => handleRoleSelect(Role.Customer)}
        >
          I'm a Customer
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={() => handleRoleSelect(Role.Supplier)}
        >
          I'm a Supplier
        </Button>
      </Grid>
    </Grid>
  );
};

export default Register;