import gql from "graphql-tag"
export const CATEGORY_QUERY = gql`
query GetCategories {
  getCategories {
    id
    name
  }
}
`
export const CREATE_CATEGORY=gql`
mutation CreateCategory($name: String!) {
  createCategory(name: $name) {
    name
  }
}
`

