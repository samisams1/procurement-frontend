import { gql } from "@apollo/client";
export const COUNT_REQUEST= gql`
query{
    countrequests
  }
`
export const GET_QUOTES = gql`
query GetQuotes {
  purchaseRequests {
    id
    referenceNumber
    status
    createdAt
    products {
      title
      partNumber
      quantity
      partNumber
    }
    user {
      username
    }
    suppliers {
      user {
        username
      }
    }
  }
}
`;
export const PURCHASE_REQUESTS = gql`
query GetQuotes {
  allPurchaseRequests {
    id
    referenceNumber
    status
    createdAt
    products {
      title
      partNumber
      quantity
      partNumber
    }
    user {
      username
    }
    suppliers {
      user {
        username
      }
    }
  }
}
`;
export const PURCHASE_REQUESTS_BY_USER_ID = gql`
query PurchaseRequestsByUserId($userId: Float!) {
  purchaseRequestsByUSerId(userId: $userId) {
     id
    referenceNumber
    status
    createdAt
  }
}
`;
