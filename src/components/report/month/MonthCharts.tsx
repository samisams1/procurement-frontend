import React from 'react';
import Chart from 'react-apexcharts';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { gql, useQuery } from '@apollo/client';

interface YearlyReport {
  month: string;
  totalAmount: number;
}

interface MonthlyReportQueryData {
  monthlyReport: YearlyReport[];
}

interface MonthlyReportQueryVariables {
  id: number;
}

const GET_MONTH_REPORT = gql`
query MonthlyReport($id: Int!) {
  monthlyReport(id: $id) {
    month
    totalAmount
  }
}
`;
interface userIdInterface {
  userId :number
}
const MonthReportChart: React.FC<userIdInterface> = ({userId}) => {
  const { data, loading, error } = useQuery<MonthlyReportQueryData, MonthlyReportQueryVariables>(GET_MONTH_REPORT, {
    variables: { id: userId },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const monthReportData: YearlyReport[] = data?.monthlyReport || [];

  // Prepare chart series for the pie chart
  const pieChartSeries: number[] = monthReportData.map((report) => report.totalAmount);

  // Prepare chart options for the pie chart
  const pieChartOptions = {
    labels: monthReportData.map((report) => report.month),
  };

  // Prepare chart options for the bar chart
  const barChartOptions = {
    xaxis: {
      categories: monthReportData.map((report) => report.month),
    },
  };

  // Prepare chart series for the bar chart
  const barChartSeries = [
    {
      name: 'Amount',
      data: monthReportData.map((report) => report.totalAmount),
    },
  ];

  // Calculate total amount
  const totalAmount: number = monthReportData.reduce((sum, report) => sum + report.totalAmount, 0);

  return (
    <div>
      <h2>Yearly Reports</h2>

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
              <TableCell>Year</TableCell>
              <TableCell>Total Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {monthReportData.map((report) => (
              <TableRow key={report.month}>
                <TableCell>{report.month}</TableCell>
                <TableCell>{report.totalAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <p>Total Amount: {totalAmount}</p>
    </div>
  );
};

export default MonthReportChart;