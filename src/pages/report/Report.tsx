import { Grid, Paper } from '@mui/material'
import { Helmet } from 'react-helmet'
import PageHeader from '../../components/PageHeader'
import { ReportOffTwoTone, } from '@mui/icons-material'
import LabTabs from '../../components/pageComponents/Tab/Tabs'
const Report = () => {
  return (
    <Grid container spacing={2}>
      <Helmet>
        Et-proforma | Report
      </Helmet>
    <Grid item xs={12}>
      <Paper elevation={3} sx={{ padding: '20px' }}>
      <PageHeader
              title="REPORT"
              subTitle="the report"
              icon={<ReportOffTwoTone fontSize="large" />}
          /> 
           <Grid
            xs={12}
            lg={12}
          >
          <LabTabs/> 
          </Grid>
          </Paper>
          </Grid>
          </Grid>
  )
}

export default Report
