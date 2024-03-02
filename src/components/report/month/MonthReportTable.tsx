import React from "react";
import MUIDataTable from "mui-datatables";
import { Grid } from "@mui/material";
import { useQuery } from "@apollo/client";
import Spinner from "../../Spinner";
import {MONTH_REPORT_QUERY } from "../../../graphql/Report";

interface DailyReport {
  month: string;
  totalAmount: number;
}

interface MonthReportQueryData {
  monthlyReport: DailyReport[];
}

interface MonthReportQueryVariables {
  id: number;
}
interface userIdInterface {
  userId :number
}
const MonthReportByTable: React.FC<userIdInterface> = ({userId}) => {
  const { data, loading, error } = useQuery<MonthReportQueryData, MonthReportQueryVariables>(MONTH_REPORT_QUERY, {
    variables: { id: 1 },
  });

  if (loading) return <Spinner />;
  if (error) return <p>{error.message}</p>;

  const saleData = data?.monthlyReport?.map((row: DailyReport) => [row.month, row.totalAmount + " Birr"]);

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title="Monthly Report"
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
export default MonthReportByTable;