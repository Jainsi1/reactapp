import { gql, useMutation } from '@apollo/client';

const CREATE_SUPPLIER_PART = gql`
  mutation createSupplierPart ($data: SupplierPartCreateInput!) {
    createSupplierPart(data: $data) {
      id
      orgId
      productId
      partName
      successorId
    }
  }
`;

const UPDATE_SUPPLIER_PART = gql`
  mutation updateSupplierPart ($data: SupplierPartUpdateInput!, $id: ID!) {
    updateSupplierPart(data: $data, id: $id) {
      id
      orgId
      productId
      partName
      successorId
    }
  }
`;

const CREATE_SUPPLIER_PART_ROADMAP = gql`
  mutation createSupplierPartRoadmap($data: SupplierPartRoadmapCreateInput!) {
    createSupplierPartRoadmap(data: $data) {
      id
      supplierPartId
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

const UPDATE_SUPPLIER_PART_ROADMAP = gql`
  mutation updateSupplierPartRoadmap($data: SupplierPartRoadmapUpdateInput!, $supplierPartRoadmapId: ID!) {
    updateSupplierPartRoadmap(data: $data, supplierPartRoadmapId: $supplierPartRoadmapId) {
      id
      supplierPartId
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

export function useCreateSupplierPart() {
  const [createSupplierPart] = useMutation(CREATE_SUPPLIER_PART);
  return createSupplierPart;
}

export function useUpdateSupplierPart() {
  const [updateSupplierPart] = useMutation(UPDATE_SUPPLIER_PART);
  return updateSupplierPart;
}

export function useCreateSupplierPartRoadmap() {
  const [createSupplierPartRoadmap] = useMutation(CREATE_SUPPLIER_PART_ROADMAP);
  return createSupplierPartRoadmap;
}

export function useUpdateSupplierPartRoadmap() {
  const [updateSupplierPartRoadmap] = useMutation(UPDATE_SUPPLIER_PART_ROADMAP);
  return updateSupplierPartRoadmap;
}