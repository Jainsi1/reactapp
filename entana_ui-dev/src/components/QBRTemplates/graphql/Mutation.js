import { gql } from '@apollo/client'

export const ADD_QBR_TEMPLATE = gql`
  mutation addQbrTemplate ($data: QbrTemplateCreateOrUpdateInput!) {
    createQbrTemplate(data: $data) {
      id
      name
    }
  },
`

export const UPDATE_QBR_TEMPLATE = gql`
  mutation updateQbrTemplate($data: QbrTemplateCreateOrUpdateInput! $where: QbrTemplateWhereInput){
    updateQbrTemplate(data: $data, where: $where){
      id
      name
    }
  },
`

export const MAKE_DEFAULT_QBR_TEMPLATE = gql`
  mutation make($where: QbrTemplateWhereInput){
    makeDefaultQbrTemplate(where: $where){
      id
      name
    }
  },
`
