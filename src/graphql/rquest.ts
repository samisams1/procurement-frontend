import { gql } from "@apollo/client";
export const COUNT_REQUEST= gql`
query{
    countrequests
  }
`
export const GET_QUOTES = gql`
query PurchaseRequests {
  purchaseRequests {
    id
    userId
    status
    remark
    addressDetail
    estimatedDelivery
    referenceNumber
    products {
      id
      Description
      code
      manufacture
      model
      partNumber
      quantity
      title
      uom
    }
    createdAt
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
query PurchaseRequestByUserId($userId: Int!) {
  purchaseRequestByUserId(userId: $userId) {
    id
    userId
    status
    remark
    addressDetail
    requestedBy
    approvedBy
    estimatedDelivery
    status
    referenceNumber
    createdAt
    products {
      id
      quantity
      title
      Description
      code
      manufacturer
      model
      partNumber
      uom
    }
  }
}
`;
export const SAVED_REQUESTS_BY_USER_ID = gql`
query SavedRequestByUserId($userId: Int!) {
  savedRequestByUserId(userId: $userId) {
    id
    userId
    status
    remark
    imageUrl
    addressDetail
    estimatedDelivery
    referenceNumber
    createdAt
    products {
      id
      quantity
      title
      Description
      code
      manufacturer
      model
      partNumber
      uom
      mark
    }
    
  }
}
`;
export const PURCHASE_REQUESTS_BY__ID = gql`
query GetDraftProductsByRequestId($purchaseRequestId: Int!) {
  getDraftProductsByRequestId(purchaseRequestId: $purchaseRequestId) {
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