import gql from "graphql-tag"
export const DAY_REPORT_QUERY = gql`
query DailyReport($dailyReportId: Int!) {
  dailyReport(id: $dailyReportId) {
    date
    totalAmount
  }
}`;
  export const MONTH_REPORT_QUERY = gql`
  query {
      dailyReport{
        id
        saleDetail{
          product{
            name
          }
        }
        grossAmount
        
      }
    }`;
    export const YEAR_REPORT_QUERY = gql`
    query {
        dailyReport{
          id
          saleDetail{
            product{
              name
            }
          }
          grossAmount
          
        }
      }`;