export const FETCH_FOLLOWED_USERS = `
  query FetchFollowedUsers {
    followersCollection(filter: { follower_id: { eq: followerId } }) {
      edges {
        node {
          id
          followed_id
        }
      }
    }
  }
`;

export const FETCH_USER = `
query FetchUserById($userId: String!) {
  usersCollection(filter: { id: { eq: $userId } }) {
    edges {
      node {
        id
        username
        profile_picture
      }
    }
  }
}
`;
export const FETCH_POSTS = `
  query FetchPosts {
    postsCollection(
      filter: { user_id: { in: userIds } }
     
    ) {
      edges {
        node {
          id
          content
          image
          created_at
          likes
          users{
            username
            profile_picture
            tag_name
          }
        }
      }
    }
  }
`;

export const FETCH_ALL_USERS = `
query FetchAllUsers {
    usersCollection {
      edges {
        node {
          id
          username
          profile_picture
          tag_name
        }
      }
      
    }
  }`;
export const IS_NOTIFICATION = `
  query Notification($userId: String!) {
    usersCollection(filter: { id: { eq: $userId } }) {
      edges {
        node {
          tag_notification
          tagged_user
          profile_picture
        }
      }
    }
  }
`;
export const ADD_POST = `
  mutation AddPost($userId: UUID!, $content: String!, $image: String!) {
    insertIntopostsCollection(objects: { user_id: $userId, content: $content, image: $image }) {
      records {
        id
        content
        image
      }
    }
  }
`;

export const FOLLOW = `
  mutation Follow($followerId: String!, $followedId: String!) {
    insertIntofollowersCollection(
      objects: { follower_id: $followerId, followed_id: $followedId }
    ) {
      records {
        id
      }
    }
  }
`;

export const UNFOLLOW = `
  mutation UnFollow($followId: uuid!) {
    deleteFromfollowersCollection(filter: { id: { eq: $followId } }) {
      records {
        id
      }
    }
  }
`;

export const NOTIFICATION = `
mutation Notify($names: [String!]!, $taggedUser: String!) {
  updateusersCollection(
    filter: { tag_name: { in: $names } }
    set: { tag_notification: true, tagged_user: $taggedUser }
  ) {
    affectedCount
    records {
      id
      tag_name
      tagged_user
    }
  }
}

  `;

export const NOTIFICATION_REMOVE = `

mutation RemoveNotification($id: String!) {
  updateusersCollection(
    filter: { id: { eq: $id } }
    set: { tag_notification: false }
  ) {
    affectedCount
    records {
      id
      tag_notification
    }
  }
}
`;

export const ADD_USER = `

mutation AddUser($id:String!, $email: String! ,$profile_picture: String!, $username: String!, $bio: String!, $tag_name: String!) {
  insertIntousersCollection(
    objects: {
      id:$id,
      email:$email,
      profile_picture: $profile_picture, 
      username: $username, 
      bio: $bio, 
      tag_name: $tag_name
    }
  ) {
    records{
      id
      email
      profile_picture
      username
      bio
      tag_name
    }
  }
}
`;

export const LIKED_POSTS_HANDLE = `
mutation AddToLikedPostList($userId: String!, $postIds: [String!]) {
  updateusersCollection(
    filter: { id: { eq: $userId } }
    set: { liked_posts: $postIds}
  ) {
    affectedCount
    records {
      id
      liked_posts
    }
  }
}

`;
export const LIKED_POSTS_FETCH = `
query FetchLikedPostList($userId: String!) {
  usersCollection(
    filter: { id: { eq: $userId } }
  ) {
    edges {
      node {
        id
        liked_posts
      }
    }
  }
}

`;


export const LIKE_HANDLER = `
mutation DecrLikePostList($postId: String!, $postLikes: numeric!) {
  updatepostsCollection(
    filter: { id: { eq: $postId } }
    set: { likes: $postLikes}
  ) {
    affectedCount
    records {
      id
    }
  }
}

`;
