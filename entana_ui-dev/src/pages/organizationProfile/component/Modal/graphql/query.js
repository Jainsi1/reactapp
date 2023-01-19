import { gql } from '@apollo/client'

export const GET_ORGANIZATION_PROFILE = gql`
  query getOrganizationProfile ($where: GetOrganizationProfileInput) {
    getOrganizationProfile(where: $where) {
      name
      image
      industry
      employees
      founded
      hq
      website
      about
      isVerified
      isCurrent
      isFollow
      hasSuppliers
      products {
        id
        name
        model
        mpn
        production_status
      }
      supplierCommodities {
        id name
      }
      permissions {
        locationPermission {
          boundary
          allow
        }
        capacityPermission {
          boundary
          allow
        }
        certificationPermission {
          boundary
          allow
        }
      }
    }
  }
`;

export const GET_ORGANIZATION_PRODUCT = gql`
  query getOrganizationProducts ($data: GetOrganizationProductInput) {
    getOrganizationProducts(data: $data) {
      id
      name
      model
      mpn
      production_status
    }
  }
`;