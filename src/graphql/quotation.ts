import { gql } from "@apollo/client";
export const COUNT_RFQ = gql`
query{
    countRfq
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