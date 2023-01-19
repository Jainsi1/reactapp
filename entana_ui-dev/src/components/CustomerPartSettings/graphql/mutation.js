import { gql, useMutation } from '@apollo/client';

const CREATE_CUSTOMER_PART_ROADMAP = gql`
  mutation createCustomerPartRoadmap($data: CustomerPartRoadmapCreateInput!) {
    createCustomerPartRoadmap(data: $data) {
      id
      customerPartId
      es1Date
      es2Date
      es3Date
      qualStartDate
      milestone1Date
      milestone2Date
      milestone3Date
      milestone4Date
      qualFinishDate
      rts
      rtm
      ltb
      lts
      standardLeadTime
      currentLeadTime
      needsUserAttention
      isPor
    }
  }
`;

const UPDATE_CUSTOMER_PART_ROADMAP = gql`
  mutation updateCustomerPartRoadmap($data: CustomerPartRoadmapUpdateInput!, $customerPartRoadmapId: ID!) {
    updateCustomerPartRoadmap(data: $data, customerPartRoadmapId: $customerPartRoadmapId) {
      id
      customerPartId
      es1Date
      es2Date
      es3Date
      qualStartDate
      milestone1Date
      milestone2Date
      milestone3Date
      milestone4Date
      qualFinishDate
      rts
      rtm
      ltb
      lts
      standardLeadTime
      currentLeadTime
      needsUserAttention
      isPor
    }
  }
`;

const CREATE_CUSTOMER_PART = gql`
  mutation createCustomerPart ($data: CustomerPartCreateInput!) {
    createCustomerPart(data: $data) {
      id
      supplierPartId
      partName
      successorId
    }
  }
`;

const UPDATE_CUSTOMER_PART = gql`
  mutation updateCustomerPart ($data: CustomerPartUpdateInput!, $id: ID!) {
    updateCustomerPart(data: $data, id: $id) {
      id
      supplierPartId
      partName
      successorId
    }
  }
`;

export function useCreateCustomerPartRoadmap() {
  const [createCustomerPartRoadmap] = useMutation(CREATE_CUSTOMER_PART_ROADMAP);
  return createCustomerPartRoadmap;
}

export function useUpdateCustomerPartRoadmap() {
  const [updateCustomerPartRoadmap] = useMutation(UPDATE_CUSTOMER_PART_ROADMAP);
  return updateCustomerPartRoadmap;
}

export function useCreateCustomerPart() {
  const [createCustomerPart] = useMutation(CREATE_CUSTOMER_PART);
  return createCustomerPart;
}

export function useUpdateCustomerPart() {
  const [updateCustomerPart] = useMutation(UPDATE_CUSTOMER_PART);
  return updateCustomerPart;
}