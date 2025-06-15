const ADD_LIKE=
`mutation AddLike($user_id: UUID!, $post_id: UUID!) {
  insertIntolikes2Collection(
    objects: [{
      user_id: $user_id,
      post_id: $post_id
    }]
  ) {
    records {
      like_id
      user_id
      post_id
    }
  }
}`

const REMOVE_LIKE=
`mutation RemoveLike($user_id: UUID!, $post_id: UUID!) {
  deleteFromlikes2Collection(
    filter: {
      user_id: {
        eq: $user_id
      },
      post_id: {
        eq: $post_id
      }
    }
  ) {
    affectedCount
  }
}
`



export {ADD_LIKE, REMOVE_LIKE}