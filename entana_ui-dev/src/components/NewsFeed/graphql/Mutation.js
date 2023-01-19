import {gql} from '@apollo/client'

export const ADD_POST = gql`
  mutation addPost ($data: PostCreateOrUpdateInput!) {
    createPost(data: $data) {
      id
      caption
    }
  },
`

export const UPDATE_POST = gql`
  mutation updatePost($data: PostCreateOrUpdateInput! $where: PostWhereInput){
    updatePost(data: $data, where: $where){
      id
      caption
    }
  },
`

export const DELETE_POST = gql`
  mutation deletePost($where: PostWhereInput){
    deletePost(where: $where){
      id
      caption
    }
  },
`

export const LIKE_POST = gql`
  mutation likePost($where: PostWhereInput){
    likePost(where: $where){
      id
      caption
    }
  },
`

export const UNLIKE_POST = gql`
  mutation unlikePost($where: PostWhereInput){
    unlikePost(where: $where){
      id
      caption
    }
  },
`

export const ADD_COMMENT = gql`
  mutation addComment($data: CommentCreateInput!){
    createComment(data: $data){
      id
    }
  },
`

export const UPDATE_COMMENT = gql`
  mutation updateComment($data: CommentUpdateInput! $where: CommentWhereInput){
    updateComment(data: $data, where: $where){
      id
    }
  },
`

export const DELETE_COMMENT = gql`
  mutation deleteComment($where: CommentWhereInput){
    deleteComment(where: $where){
      id
    }
  },
`

export const ADD_REPLY = gql`
  mutation addReply($data: ReplyCreateInput!){
    createReply(data: $data){
      id
    }
  },
`

export const UPDATE_REPLY = gql`
  mutation updateReply($data: ReplyUpdateInput! $where: ReplyWhereInput){
    updateReply(data: $data, where: $where){
      id
    }
  },
`

export const DELETE_REPLY = gql`
  mutation deleteReply($where: ReplyWhereInput){
    deleteReply(where: $where){
      id
    }
  },
`