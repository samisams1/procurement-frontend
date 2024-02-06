import gql from "graphql-tag";
/*export const LOGIN_MUTATION = gql`
	mutation login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
		}
	}
`
*/


export const LOGIN_MUTATION = gql`
mutation Login($username: String!, $password: String!) {
	login(username: $username, password: $password) {
	  token
	  user{
		id
		firstName
		lastName
		username
		email
		role    
	  }
	}
  }
`;


