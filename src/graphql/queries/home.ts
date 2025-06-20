const GET_USERS_FROM_IDS=
`
query GetUsersByIds($userIds: [UUID!]!) {
  usersCollection(filter: { id: { in: $userIds } }) {
    edges {
      node {
        id
        username
        tag_name
        profile_picture
      }
    }
  }
}
`

export {GET_USERS_FROM_IDS}