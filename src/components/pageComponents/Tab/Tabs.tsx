import React, { useContext, useState } from 'react';
import { Box, Tab } from '@mui/material';
import { TabList, TabPanel, TabContext } from '@mui/lab';
import YearReportChart from '../../report/year/YearReportChart';
import YearReprtByTable from '../../report/year/YearReportTable';
import MonthReportChart from '../../report/month/MonthCharts';
import DailyReportChart from '../../report/daily/dailyReportCharts';
import TodayReprtByTable from '../../report/daily/TodayReprtTable';
import MonthReportByTable from '../../report/month/MonthReportTable';
import { UserContext } from '../../../auth/UserContext';

export default function LabTabs() {
  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
const {currentUser} = useContext(UserContext);
const userId = currentUser?.id ?? '';
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
          <TodayReprtByTable userId = {Number(userId) }/>
          <DailyReportChart  userId = {Number(userId) }/>
        </TabPanel>
        <TabPanel value="2">
          {/* Content for Monthly Report */}
          <MonthReportByTable userId = {Number(userId) }/>
          <MonthReportChart   userId = {Number(userId) }/>
        </TabPanel>
        <TabPanel value="3">
          {/* Content for Yearly Report */}
          <YearReprtByTable  userId = {Number(userId) }/>
          <YearReportChart   userId = {Number(userId) }/>
        </TabPanel>
      </TabContext>
    </Box>
  );
}