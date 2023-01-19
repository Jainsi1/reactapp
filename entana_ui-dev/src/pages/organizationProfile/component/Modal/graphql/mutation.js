import { gql, useMutation } from '@apollo/client';

export const UPDATE_ORGANIZATION_PROFILE = gql`
  mutation updateOrganizationProfile ($data: UpdateOrganizationProfileInput!) {
    updateOrganizationProfile(data: $data) {
      name
    }
  }
`;

export const UPDATE_ORGANIZATION_PROFILE_PICTURE = gql`
  mutation updateOrganizationProfilePicture ($data: UpdateOrganizationProfilePictureInput!) {
    updateOrganizationProfilePicture(data: $data) {
      name
      image
    }
  }
`;

