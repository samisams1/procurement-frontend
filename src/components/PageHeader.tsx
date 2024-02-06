import React from 'react';
import { Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';


const StyledPageHeader = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
}));

const RowContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

export default function PageHeader(props: any) {
  const { title, subTitle, icon } = props;

  return (
    <StyledPageHeader elevation={0} square>
      <RowContainer>
        {icon}
        <div>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <Typography variant="subtitle2" component="div">
            {subTitle}
          </Typography>
        </div>
      </RowContainer>
    </StyledPageHeader>
  );
}