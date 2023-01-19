import { gql, useMutation } from "@apollo/client";

const CREATE_INITIATIVE = gql`
  mutation createInitiative($data: InitiativeCreateInput!) {
    createInitiative(data: $data) {
      Id: id
      relatedOrgId
      commodityId
      type
      title
      plan
      current
      businessObjective
      expectedBenefit
      ownerId
      status
    }
  }
`;

const UPDATE_INITIATIVE = gql`
  mutation updateInitiative(
    $data: InitiativeUpdateInput
    $where: InitiativeWhereUniqueInput!
  ) {
    updateInitiative(data: $data, where: $where) {
      Id: id
      relatedOrgId
      commodityId
      type
      title
      plan
      current
      businessObjective
      expectedBenefit
      ownerId
      status
    }
  }
`;

const DELETE_INITIATIVE = gql`
  mutation deleteInitiative($where: InitiativeDeleteInput!) {
    deleteInitiative(where: $where) {
      Id: id
    }
  }
`;

export function useUpdateInitiative() {
  const [updateInitiative] = useMutation(UPDATE_INITIATIVE);
  return updateInitiative;
}

export function useCreateInitiative() {
  const [createInitiative] = useMutation(CREATE_INITIATIVE);
  return createInitiative;
}

export function useDeleteInitiative() {
  const [deleteInitiative] = useMutation(DELETE_INITIATIVE);
  return deleteInitiative;
}
