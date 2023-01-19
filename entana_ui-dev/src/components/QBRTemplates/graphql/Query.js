import { gql } from '@apollo/client';

export const GET_QBR_TEMPLATES = gql`
  query GET_QBR_TEMPLATES {
    getQbrTemplates {
      id
      name
      is_default
      commodities
      created_at
      updated_at
    }
  }
`;

export const GET_QBR_TEMPLATE = gql`
  query GET_QBR_TEMPLATE($data: QbrTemplateWhereInput!) {
    getQbrTemplate(data: $data) {
      id
      name
      commodity_ids
      steps {
        id
        name
        weightage
        segments {
          id
          name
          weightage
          questions {
            id
            name
          }
        }
      }
    }
  }
`