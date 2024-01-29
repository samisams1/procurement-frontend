import React from 'react';
import Chart from 'react-apexcharts';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface DataPoint {
  day: string;
  amount: number;
}

const PaymentReports: React.FC = () => {
  // Sample data
  const data: DataPoint[] = [];

  for (let i = 1; i <= 30; i++) {
    const day = `Day ${i}`;
    const amount = Math.floor(Math.random() * 100); // Generate a random amount between 0 and 100
    data.push({ day, amount });
  }

  // Prepare chart series for the pie chart
  const pieChartSeries = data.map((point) => point.amount);

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
      data: data.map((point) => point.amount),
    },
  ];

  // Calculate total amount
  const totalAmount = data.reduce((sum, point) => sum + point.amount, 0);

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
            {data.map((point, index) => (
              <TableRow key={index}>
                <TableCell>{point.day}</TableCell>
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

export default PaymentReports;