import React from 'react';
import Chart from 'react-apexcharts';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { gql, useQuery } from '@apollo/client';

interface DailyReport {
  date: string;
  totalAmount: number;
}

interface DailyReportQueryData {
  dailyReport: DailyReport[];
}

interface DailyReportQueryVariables {
  dailyReportId: number;
}

const GET_DAILY_REPORT = gql`
  query DailyReport($dailyReportId: Int!) {
    dailyReport(id: $dailyReportId) {
      date
      totalAmount
    }
  }
`;
interface userIdInterface {
  userId :number
}
const DailyReportChart: React.FC<userIdInterface> = ({ userId }) => {
  const { data, loading, error } = useQuery<DailyReportQueryData, DailyReportQueryVariables>(GET_DAILY_REPORT, {
    variables: { dailyReportId: userId },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const monthlyReportData = data?.dailyReport || [];

  // Prepare chart series for the pie chart
  const pieChartSeries = monthlyReportData.map((monthlyReportData) => monthlyReportData.totalAmount);

  // Prepare chart options for the pie chart
  const pieChartOptions = {
    labels: monthlyReportData.map((point) => point.date),
  };

  // Prepare chart options for the bar chart
  const barChartOptions = {
    xaxis: {
      categories: monthlyReportData.map((point) => point.date),
    },
  };

  // Prepare chart series for the bar chart
  const barChartSeries = [
    {
      name: 'Amount',
      data: monthlyReportData.map((point) => point.totalAmount),
    },
  ];

  // Calculate total amount
  const totalAmount = monthlyReportData.reduce((sum, point) => sum + point.totalAmount, 0);

  return (
    <div>
      <h2>Payment Reports</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '50%' }}>
          <h3>Bar Chart</h3>
          <Chart options={barChartOptions} series={barChartSeries} type="bar" height={450} />
        </div>
        <div style={{ width: '50%' }}>
          <h3>Pie Chart</h3>
          <Chart options={pieChartOptions} series={pieChartSeries} type="pie" height={350} />
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {monthlyReportData.map((point, index) => (
              <TableRow key={index}>
                <TableCell>{point.date}</TableCell>
                <TableCell>{point.totalAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <p>Total Amount: {totalAmount}</p>
    </div>
  );
};

export default DailyReportChart;