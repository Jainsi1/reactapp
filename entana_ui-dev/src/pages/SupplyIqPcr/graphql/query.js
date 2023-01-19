import { gql } from '@apollo/client';

export const GET_SUPPLY_INFO = gql`
  query getSupplyInfo($data: GetSupplyInfoInput!) {
    getSupplyInfo(data: $data) {
      data {
        id
        commodityId
        date
        hasNext
        orders {
          id
          supplyInfoId
          supplierId
          supplier {
            id
            name
          }
          vendorId
          materialNumber
          revision
          description
          vendorMaterialNumber
          qcPo
          docType
          scheduleLineKey
          poIssuanceDate
          docNumber
          poQty
          openQty
          uom
          currency
          netPrice
          pricePerUnit
          paymentTerm
          requestedDate
          rescheduleDate
          buyerRemarks
          supplierDate
          supplierRemarks
          industryCode
          mrpController
          purcGroup
          vendorLdTime
          taxCode
          accepted
          isActive
        }
      }
      dateList
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