import { gql } from '@apollo/client';

export const GET_NOTIFICATIONS = gql`
  query {
    notifications {
      recipientId
      message
      type
    }
  }
`;