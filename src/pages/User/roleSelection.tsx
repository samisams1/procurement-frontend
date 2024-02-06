import React, { useState } from 'react';
import { Typography, Button, Grid } from '@mui/material';
import { UserForm } from '../../components/pageComponents/user/UserForm';

enum Role {
  Customer = 'CUSTOMER',
  Supplier = 'SUPPLIER',
}

const RegistrationPage: React.FC = () => {
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
          <Typography variant="h4" gutterBottom>
            Registration Form for {selectedRole}
          </Typography>
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
        <Typography variant="h6" align="center" gutterBottom>
          Choose your role
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#00b0ad' }}
          fullWidth
          onClick={() => handleRoleSelect(Role.Customer)}
        >
          I'm a Customer
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="contained"
          sx={{ backgroundColor: 'red' }}
          fullWidth
          onClick={() => handleRoleSelect(Role.Supplier)}
        >
          I'm a Supplier
        </Button>
      </Grid>
    </Grid>
  );
};

export default RegistrationPage;