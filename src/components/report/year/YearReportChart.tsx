import React from 'react';
import Chart from 'react-apexcharts';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { gql, useQuery } from '@apollo/client';

interface YearlyReport {
  year: string;
  totalAmount: number;
}

interface YearlyReportQueryData {
  yearlyReport: YearlyReport[];
}

interface YearlyReportQueryVariables {
  id: number;
}

const GET_YEARLY_REPORT = gql`
  query YearlyReport($id: Int!) {
    yearlyReport(id: $id) {
      year
      totalAmount
    }
  }
`;
interface userIdInterface {
  userId :number
}
const YearlyReportChart: React.FC<userIdInterface> = ({userId}) => {
  const { data, loading, error } = useQuery<YearlyReportQueryData, YearlyReportQueryVariables>(GET_YEARLY_REPORT, {
    variables: { id: userId },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const yearlyReportData: YearlyReport[] = data?.yearlyReport || [];

  // Prepare chart series for the pie chart
  const pieChartSeries: number[] = yearlyReportData.map((report) => report.totalAmount);

  // Prepare chart options for the pie chart
  const pieChartOptions = {
    labels: yearlyReportData.map((report) => report.year),
  };

  // Prepare chart options for the bar chart
  const barChartOptions = {
    xaxis: {
      categories: yearlyReportData.map((report) => report.year),
    },
  };

  // Prepare chart series for the bar chart
  const barChartSeries = [
    {
      name: 'Amount',
      data: yearlyReportData.map((report) => report.totalAmount),
    },
  ];

  // Calculate total amount
  const totalAmount: number = yearlyReportData.reduce((sum, report) => sum + report.totalAmount, 0);

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
            {yearlyReportData.map((report) => (
              <TableRow key={report.year}>
                <TableCell>{report.year}</TableCell>
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

export default YearlyReportChart;