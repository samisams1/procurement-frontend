import { gql } from "@apollo/client";
export const SUPPLIER_PAYMENTS = gql`
  query SupplierPayments($supplierPaymentsId: Int!) {
    supplierPayments(id: $supplierPaymentsId) {
      id
      amount  
      paidAt
      paymentMethod
      userId
      orderId  
      status
      referenceNumber
      fullName
    }
  }
`;