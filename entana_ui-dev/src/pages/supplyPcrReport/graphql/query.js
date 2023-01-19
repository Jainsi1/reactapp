import { gql } from '@apollo/client';

export const GET_SUPPLY_PCR_REPORT = gql`
  query getSupplyPcrReport($data: GetSupplyInfoInput!) {
    getSupplyPcrReport(data: $data){
      data
    }
  }
`;

export const GET_VENDORS_BY_ORGANIZATION_ID = gql`
  query ExcelUploadDrawer($organizationId: ID!) {
    getVendorsByOrganizationId(organizationId: $organizationId) {
      id
      organizationId
      supplierId
      vendorId
    }
  }
`;

export const GET_SUPPLY_INFO_STATUS = gql`
  query getSupplyInfoStatus($commodityIds: [ID]) {
    getSupplyInfoStatus(commodityIds: $commodityIds) {
      accepted
      noResponse
      rejected
      header
      id
      fullName
      shortName
      total
    }
  }

`