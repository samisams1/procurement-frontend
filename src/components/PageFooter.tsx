import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledPageHeader = styled(Paper)(({ theme }) => ({
  backgroundColor: '#7ea793',
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
}));

const RowContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

export default function PageFooter(props: any) {
  return (
    <StyledPageHeader elevation={0} square>
      <RowContainer>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6">Terms and Conditions</Typography>
            <Typography variant="body1">
              1. By using this procurement system, you agree to abide by all applicable laws and regulations.
            </Typography>
            <Typography variant="body1">
              2. All procurement transactions are subject to thorough review and approval by the designated authority.
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Additional Notes</Typography>
            <Typography variant="body1">
              - Confidentiality of candidate information.
              <br />
              - Equal opportunity for all.
              <br />
              - Non-discrimination.
              <br />
              - Privacy compliance.
              <br />
              - Accurate information.
              <br />
              - Transparent communication.
              <br />
              - Policy adherence.
              <br />
              - Amendments communicated.
            </Typography>
            <Typography variant="body1" style={{ paddingTop: '20px' }}>
  For any inquiries, please feel free to contact us via email at nilesoft@gmail.com or give us a call at +251911190070. We are here to assist you and provide prompt support.
</Typography>
          </Grid>
        </Grid>
      </RowContainer>
    </StyledPageHeader>
  );
}