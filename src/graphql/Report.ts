import gql from "graphql-tag"
export const DAY_REPORT_QUERY = gql`
query DailyReport($dailyReportId: Int!) {
  dailyReport(id: $dailyReportId) {
    date
    totalAmount
  }
}`;
  export const MONTH_REPORT_QUERY = gql`
  query MonthlyReport($id: Int!) {
    monthlyReport(id: $id) {
      month
      totalAmount
    }
  }`;
    export const YEAR_REPORT_QUERY = gql`
    query YearlyReport($id: Int!) {
      yearlyReport(id: $id) {
        year
        totalAmount
      }
    }
    `;