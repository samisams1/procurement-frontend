import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { UserForm } from '../../components/pageComponents/user/UserForm';
import Button from '../../components/Button';

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
      </Grid>
      <Grid item xs={6}>
      <Button
          variant="contained"
          sx={{ backgroundColor: '#00b0ad', }}
          fullWidth
          onClick={() => handleRoleSelect(Role.Customer)}
          text="I'm a Customer"
        />
          
      
      </Grid>
      <Grid item xs={6}>
      <Button
          variant="contained"
          sx={{ backgroundColor: '#00b0ad' }}
          fullWidth
          onClick={() => handleRoleSelect(Role.Supplier)}
          text="I'm a Supplier"
        />
      </Grid>
    </Grid>
  );
};

export default Register;