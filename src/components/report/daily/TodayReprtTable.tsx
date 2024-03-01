import React from "react";
import MUIDataTable from "mui-datatables";
import { Grid } from "@mui/material";
import { useQuery } from "@apollo/client";
import Spinner from "../../Spinner";
import { DAY_REPORT_QUERY } from "../../../graphql/Report";

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

export default function TodayReportByTable() {
  const { data, loading, error } = useQuery<DailyReportQueryData, DailyReportQueryVariables>(DAY_REPORT_QUERY, {
    variables: { dailyReportId: 1 },
  });

  if (loading) return <Spinner />;
  if (error) return <p>{error.message}</p>;

  const saleData = data?.dailyReport.map((row: DailyReport) => [row.date, row.totalAmount]);

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title="Today Daily Report of Sold Products"
            data={saleData || []}
            columns={["Date", "Total Amount"]}
            options={{
              filterType: "checkbox",
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}