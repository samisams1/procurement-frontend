import React, { useContext, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Alert, CardActions, CardContent, Divider, Grid, Stack } from '@mui/material';
import { USER_QUERY } from '../../../../graphql/Users';
import { Form, useForm } from '../../../useForm';
import Controls from '../../../Controls';
import Button from '../../../Button';
import { UserContext } from '../../../../auth/UserContext';
import PageHeader from '../../../PageHeader';

interface ChangePasswordInput {
  username: string;
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordResponse {
  username: string;
}

interface ChangePasswordData {
  changePassword: ChangePasswordResponse;
}

interface ChangePasswordVariables {
  input: ChangePasswordInput;
}

const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      username
    }
  }
`;

const ChangeNewPassword = () => {
  const [changePassword] = useMutation<ChangePasswordData, ChangePasswordVariables>(CHANGE_PASSWORD_MUTATION, {
    refetchQueries: [{ query: USER_QUERY }],
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { currentUser } = useContext(UserContext);

  const initialFValues: ChangePasswordInput = {
    username: currentUser ? currentUser.username : '',
    currentPassword: '',
    newPassword: '',
  };

  const validate = (fieldValues: ChangePasswordInput = values): boolean => {
    let temp: Partial<ChangePasswordInput> = {};
    if (!fieldValues.currentPassword) {
      temp.currentPassword = 'This field is required.';
    }
    if (!fieldValues.newPassword) {
      temp.newPassword = 'This field is required.';
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const { values, setErrors, handleInputChange, resetForm } = useForm(
    initialFValues,
    true,
    validate
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      try {
        await changePassword({
          variables: {
            input: {
              username: values.username,
              currentPassword: values.currentPassword,
              newPassword: values.newPassword,
            },
          },
        });
        setSuccessMessage('Password changed successfully.');
        resetForm();
      } catch (error: any) {
        setErrorMessage(`Error changing password: ${error.message}`);
      }
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={12}>
            <PageHeader title="Update password" subTitle="Update password" />
            <Divider />
            <CardContent>
              <Stack spacing={3} sx={{ maxWidth: 400 }}>
                <Controls.Input
                  name="currentPassword"
                  label="Current Password"
                  value={values.currentPassword}
                  onChange={handleInputChange}
                 // error={errors.currentPassword}
                />
                <Controls.Input
                  name="newPassword"
                  label="New Password"
                  value={values.newPassword}
                  onChange={handleInputChange}
                 // error={errors.newPassword}
                />
              </Stack>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end', pt: 2 }}>
              <Grid container spacing={2} justifyContent="start">
                <Grid item>
                  <Button type="submit" text="Submit" />
                </Grid>
                <Grid item>
                  <Button
                    text="Reset"
                    onClick={resetForm}
                    sx={{ backgroundColor: 'red' }}
                  />
                </Grid>
              </Grid>
            </CardActions>
          </Grid>
        </Grid>
      </Form>
      {successMessage && (
        <Alert
          variant="outlined"
          severity="info"
          sx={{ mx: 'auto', mb: 2, width: '50%', textAlign: 'center' }}
        >
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert
          variant="outlined"
          severity="error"
          sx={{ mx: 'auto', mb: 2, width: '50%', textAlign: 'center' }}
        >
          {errorMessage}
        </Alert>
      )}
    </>
  );
};

export default ChangeNewPassword;