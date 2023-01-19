import { gql, useMutation } from '@apollo/client';

export const FOLLOW_USER = gql`
  mutation followUser ($data: GetProfileInput!) {
    followUser(data: $data) {
      name
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation unfollowUser ($data: GetProfileInput!) {
    unfollowUser(data: $data) {
      name
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation updateProfile ($data: UpdateProfileInput!) {
    updateProfile(data: $data) {
      name
    }
  }
`;

export const UPDATE_PROFILE_PICTURE = gql`
  mutation updateProfilePicture ($data: UpdateProfilePictureInput!) {
    updateProfilePicture(data: $data) {
      name
      image
    }
  }
`;

export const UPDATE_PROFILE_PERMISSION = gql`
  mutation updateProfilePermission ($data: UpdateProfilePermissionInput!) {
    updateProfilePermission(data: $data) {
      name
    }
  }
`;
