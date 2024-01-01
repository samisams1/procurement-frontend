import React, { useState } from 'react';
import { Box, Tab } from '@mui/material';
import { TabList, TabPanel, TabContext } from '@mui/lab';
import YearReportChart from '../../report/year/YearReportChart';
import YearReprtByTable from '../../report/year/YearReportTable';
import MonthReportChart from '../../report/month/MonthCharts';
import DailyReportChart from '../../report/daily/dailyReportCharts';

export default function LabTabs() {
  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Daily Report" value="1" />
            <Tab label="Monthly Report" value="2" />
            <Tab label="Yearly Report" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          {/* Content for Daily Report */}
          <DailyReportChart />
          <DailyReportChart />
        </TabPanel>
        <TabPanel value="2">
          {/* Content for Monthly Report */}
          <MonthReportChart />
          <MonthReportChart />
        </TabPanel>
        <TabPanel value="3">
          {/* Content for Yearly Report */}
          <YearReprtByTable />
          <YearReportChart />
        </TabPanel>
      </TabContext>
    </Box>
  );
}