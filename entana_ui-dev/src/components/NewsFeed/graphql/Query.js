import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GET_POSTS($data: GetPostInput) {
    getPosts(data: $data) {
      id
      caption
      created_at
      comments_count
      likes
      is_liked
      shares_count
      type
      group_id
      user {
        id
        username
        image
        organizationId
        organizationName
        role
        designation
      }
      comments {
        id
        comment
        created_at
        user {
          id
          username
          image
          organizationId
          organizationName
          role
          designation
        }
        replies {
          id
          comment_id
          reply
          created_at
          user {
            id
            username
            image
            organizationId
            organizationName
          }
        }
      }
    }
  }
`;

export const GET_LINK_PREVIEW = gql`
  query GET_LINK_PREVIEW($data: LinkPreviewInput!) {
    getLinkPreview(data: $data) {
      title images description
    }
  }
`