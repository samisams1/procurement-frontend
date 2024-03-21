import React from 'react';
import { Paper, Typography, Grid, Box } from '@mui/material';
import { styled } from '@mui/system';

const StyledPageHeader = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: '#ffffff',
}));

const Image = styled('img')({
  marginTop: '12px',
  width: '100px',
  height: '40px',
});

export default function PageHeader(props: any) {
  const { title, subTitle, icon, imageSrc } = props;
  return (
    <StyledPageHeader elevation={0} square>
      <Grid container alignItems="center">
        {/* Left section */}
        <Grid item xs={icon ? 3 : false}>
          {icon && (
            <Box display="flex" alignItems="center">
              <Box mr={1}>{icon}</Box>
              <Box>
                {title && (
                  <StyledTypography variant="h6">
                    {title}
                  </StyledTypography>
                )}
                {subTitle && (
                  <StyledTypography variant="subtitle2">
                    {subTitle}
                  </StyledTypography>
                )}
              </Box>
            </Box>
          )}
        </Grid>

        {/* Middle section */}
        <Grid item xs={icon ? 6 : 12}>
          <Box display="flex" justifyContent="center">
            <StyledTypography variant="h5">
              My Company
            </StyledTypography>
          </Box>
        </Grid>

        {/* Right section */}
        <Grid item xs={icon ? 3 : false}>
          {imageSrc && (
            <Box display="flex" justifyContent="flex-end">
              <Image
                src={require(`../assets/${imageSrc}`)}
                alt="Header Image"
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </StyledPageHeader>
  );
}