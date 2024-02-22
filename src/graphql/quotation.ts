import { gql } from "@apollo/client";
export const COUNT_RFQ = gql`
query Query($data: countQuotation!) {
  countGetQuotationByStatus(data: $data)
}
`
export const QUOTATIONS = gql`
query{
    allQuotations{
        id
        supplierId
        customerId
        status
        purchaseRequestId
        shippingPrice
        productPrices {
          price
          product {
            title
          }
        }
    }
  }
`;

export const COUNT_QUOTATIONS_QUERY = gql`
  query CountQuotations($status: String!, $supplierId: Int!) {
    countGetQuotationByStatus(status: $status, supplierId: $supplierId)
  }
`;
