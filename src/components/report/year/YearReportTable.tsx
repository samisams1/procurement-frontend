import React from "react";
import MUIDataTable from "mui-datatables";
import { Grid } from "@mui/material";
import { useQuery } from "@apollo/client";
import Spinner from "../../Spinner";
import { YEAR_REPORT_QUERY } from "../../../graphql/Report";

interface DailyReport {
  year: string;
  totalAmount: number;
}

interface YearReportQueryData {
  yearlyReport: DailyReport[];
}

interface YearReportQueryVariables {
  id: number;
}
interface userIdInterface {
  userId :number
}
const TodayReportByTable: React.FC<userIdInterface> = ({userId}) => {
  const { data, loading, error } = useQuery<YearReportQueryData, YearReportQueryVariables>(YEAR_REPORT_QUERY, {
    variables: { id: userId },
  });

  if (loading) return <Spinner />;
  if (error) return <p>{error.message}</p>;

  const saleData = data?.yearlyReport.map((row: DailyReport) => [row.year, row.totalAmount + " Birr"]);

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title="Yearly Reports"
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
export default  TodayReportByTable;