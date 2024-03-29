import { gql } from "@apollo/client";

export const ORDER_QUERY = gql`
query {
    orders {
      id
      sellerId
      totalQuantity
      orderDetails{
        quantity
        product{
          name
        }
        
        
      }
    
    }
  }
`
export const ORDER_DETAIL_QUERY = gql`
query{
    order(id:1){
      id
      status
      totalQuantity
      orderDetails{
        product{
          name
        }
      }
      
    }
  }
`
export const CREATE_ORDER_MUTATION = gql`
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id
    sellerId
    totalQuantity
    status
    orderDetails {
      id
      product {
        name
      }
    }
  }
}
`;
export const UPDATE_PATIENT_MUTATION = gql`
mutation UpdatePost($id: Int!,$firstName: String!, $lastName: String!,$dateOfBirth:String!,$martialStatus:String!,$phoneNumber:String!,$email:String!,$address:String!,$country:String!){
  updatePost(id: $id,firstName: $firstName, lastName: $lastName,dateOfBirth:$dateOfBirth,martialStatus:$martialStatus,phoneNumber:$phoneNumber,email:$email,address:$address,country:$country) {
    id
    firstName
    lastName
      dateOfBirth
      martialStatus
      phoneNumber
      email
      address
      country
  }
}
`

export const DELETE_PATIENT_MUTATION = gql`
	mutation deletePatient($firstName: String!, $lastName: String!,$dateOfBirth:String!,$martialStatus:String!,$phoneNumber:String!,$email:String!,$address:String!,$country:String!) {
		deletePatient(firstName: $firstName, lastName: $lastName,dateOfBirth:$dateOfBirth,martialStatus:$martialStatus,phoneNumber:$phoneNumber,email:$email,address:$address,country:$country) {
      firstName,
      lastName
      dateOfBirth
      martialStatus
      phoneNumber
      email
      address
      country
		}
	}
`
export const COUNT_ORDER_QUERY = gql`
query{
  countOrder
}`;
//new for this project
export const COUNT_ORDER_BY_STATUS = gql`
query CountOrderByStatus($status: String!, $userId: Int!) {
  countOrderBystatus(status: $status, userId: $userId)
}
`
export const COUNT_REQUEST_BY_STATUS = gql`
query Query($data: countPurchase!) {
  countPurchaseRequestBystatus(data: $data)
}
`
export const COUNT_ALL_REQUEST_BY_STATUS = gql`
query Query($status: String!) {
  countAllRequestByStatus(status: $status)
}
`
export const COUNT_ALL_ORDER_BY_STATUS = gql`
query Query($status: String!) {
  countAllrderByStatus(status: $status)
}
`
export const COUNT_ALL_PAYMENT_BY_STATUS = gql`
query Query($status: String!) {
  countPaymentSatus(status: $status)
}
`
export const GET_ORDER_BY_SUPPLIER_ID_QUERY = gql`
query GetOrderBySupplierId($id: Int!, $status: String) {
  getOrderBySupplierId(id: $id, status: $status) {
        id
        customerId
        supplierId
        totalPrice
        tax
        shippingCost
        status
        createdAt
        updatedAt
        referenceNumber
        purchaseRequestId
        supplier {
          name
        }
        customer {
          username
        }
    }
  }
`;