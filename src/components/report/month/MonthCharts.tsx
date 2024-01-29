import React from 'react';
import Chart from 'react-apexcharts';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { gql, useQuery } from '@apollo/client';

interface MonthlyReport {
  month: string;
  amount: number;
}

const GET_MONTHLY_REPORT = gql`
  query MonthlyReport {
    monthlyReport {
      month
      amount
    }
  }
`;

const MonthReportChart: React.FC = () => {
  // Sample data

  const { data, loading, error } = useQuery<{ monthlyReport: MonthlyReport[] }>(GET_MONTHLY_REPORT);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const monthlyReportData = data?.monthlyReport || [];

  


  // Prepare chart series for the pie chart
  const pieChartSeries = monthlyReportData.map((monthlyReportData) => monthlyReportData.amount);

  // Prepare chart options for the pie chart
  const pieChartOptions = {
    // Chart options configuration here...
  };

  // Prepare chart options for the bar chart
  const barChartOptions = {
    // Chart options configuration here...
  };

  // Prepare chart series for the bar chart
  const barChartSeries = [
    {
      name: 'Amount',
      data: monthlyReportData.map((point) => point.amount),
    },
  ];

  // Calculate total amount
  const totalAmount = monthlyReportData.reduce((sum, point) => sum + point.amount, 0);

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
              <TableCell>Day</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {monthlyReportData.map((point, index) => (
              <TableRow key={index}>
                <TableCell>{point.month}</TableCell>
                <TableCell>{point.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <p>Total Amount: {totalAmount}</p>

      <p>Analysis:</p>
      <p>Add your own analysis based on the data here...</p>
    </div>
  );
};

export default MonthReportChart;