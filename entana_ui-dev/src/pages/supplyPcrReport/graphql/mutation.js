import { gql, useMutation } from '@apollo/client';

const UPLOAD_SUPPLY_INFO = gql`
  mutation uploadSupplyInfo($data: SupplyInfoUploadInput!) {
    uploadSupplyInfo(data: $data) {
      id
      commodityId
      date
    }
  }
`;

export function useUploadSupplyInfo() {
  const [uploadSupplyInfo] = useMutation(UPLOAD_SUPPLY_INFO);
  return uploadSupplyInfo;
}
