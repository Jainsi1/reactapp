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
      hashTag
      products {
        id
        name
        model
        mpn
        production_status
        imageUrl
      }
      supplierCommodities {
        id 
        name
      }
      factories {
        id
        name
        tier
        location {
          name
          latitude
          longitude
          address
        }
        capacities {
          name
          groupName
          tableColumn
          tableData
        }
        certifications {
          name
          groupName
          tableColumn
          tableData
          source
        }
      }
      services {
        name
        imageUrl
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
