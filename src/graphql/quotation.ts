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
export const CREATE_PURCHASE_REQUEST_MUTATION = gql`
mutation CreatePurchaseRequest($input: CreatePurchaseRequestInput!) {
  createPurchaseRequest(input: $input) {
    id
    userId
    status
    remark
    imageUrl
    addressDetail
    estimatedDelivery
    referenceNumber
    createdAt
  }
}
`;
export const SAVE_PURCHASE_REQUEST_MUTATION = gql`
mutation CreateDraftequest($input: CreatePurchaseRequestInput) {
  createDraftequest(input: $input) {
    id
    userId
    status
    remark
    addressDetail
    estimatedDelivery
    products {
      id
      Description
      code
      manufacturer
      model
      partNumber
      quantity
      title
      uom
      mark
    }
  }
}
`;
export const GET_QUOTATION = gql`
query QuotationBydSupplierId($suplierId: Int!, $status: String!) {
    quotationBydSupplierId(suplierId: $suplierId, status: $status) {
      id
      purchaseRequestId
      status
      customer {
        firstName
        lastName
      }
      supplier {
        name
      }
      purchaseRequest {
        referenceNumber
      }
      createdAt
    }
  }
`;