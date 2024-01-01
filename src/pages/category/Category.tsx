import React from 'react';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
//import PageHeader from '../../components/PageHeader';
//import { Toolbar } from '../../components/scensComponents/toolbar';
import { Helmet } from 'react-helmet';
import { PeopleOutlineTwoTone } from '@mui/icons-material';
import { CategoryList } from '../../components/category/CategoryList';
import { CategoryForm } from '../../components/category/CategoryForm';
import { Toolbar } from '../../components/toolbar';
import PageHeader from '../../components/PageHeader';
export const Category = () => (
  <>
    <Helmet>
      <title>
        Category | Seblewongale
      </title>
    </Helmet>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={3}
        >
          <Grid
            xs={12}
            md={12}
            lg={12}
          >
           <PageHeader
            title="New Category"
            subTitle="Category"
            icon={<PeopleOutlineTwoTone fontSize="large" />}
        /> 
            <Toolbar name="Category" addName ="Create New Category" formName={<CategoryForm/>}/>
            <CategoryList/>
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);