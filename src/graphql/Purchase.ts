import { gql } from '@apollo/client';

const PURCHASE_REQUEST_BY_SUPPLIER_QUERY = gql`
  query PurchaseRequestBySupplier($id: Float!) {
    purchaseRequestBySupplier(id: $id) {
      id
      status
      createdAt
      user {
        id
        username
      }
      products {
        id
        title
        code
        partNumber
        uom
        quantity
        mark
        description
        manufacturer
        model
      }
      suppliers {
        id
        user {
          id
          username
        }
      }
    }
  }
`;

export default PURCHASE_REQUEST_BY_SUPPLIER_QUERY;