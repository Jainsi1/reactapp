import { gql } from '@apollo/client'

export const CREATE_USER = gql`
  mutation createUser ($input: CreateUserInput!){
    createUser(input: $input) {
      id
      email
      firstName
      lastName
    }
  }
`

export const LOGIN_USER = gql`
  mutation Login($input: LoginCreateInput!) {
    login(input: $input) {
      token
      nextScreen
      role
    }
  }
`

//register
export const REGISTER_GENERATE_URL = gql`
  mutation registerGenerateUrl ($input: SendVerificationToUserInput!){
    registerGenerateUrl(input: $input) {
      message
    }
  }
`

export const REGISTER_VALIDATE_URL = gql`
  mutation reg ($input: ValidateVerifyUrlInput!){
    registerValidateUrl(input: $input){
      message
    }
  }
`

export const REGISTER_USER = gql`
  mutation registerUser ($input: RegisterUserInput!){
    registerUser(input: $input){
      token
      nextScreen
      message
      role
    }
  }
`

export const REGISTER_USER_ROLE = gql`
  mutation registerUserRole ($input: RegisterUserRoleInput!){
    registerUserRole(input: $input){
      firstName
      lastName
      email
    }
  }
`
export const REGISTER_USER_ORGANIZATION = gql`
  mutation registerUserOrganization ($input: RegisterUserOrganizationInput!){
    registerUserOrganization(input: $input){
      firstName
      lastName
      email
      message
    }
  }
`
export const REGISTER_USER_INVITE = gql`
  mutation registerUserInvite ($input: RegisterUserInviteInput!){
    registerUserInvite(input: $input){
      firstName
      lastName
      email
    }
  }
`

export const REGISTER_USER_COMPLETE = gql`
  mutation registerUserComplete {
    registerUserComplete {
      firstName
      lastName
      email
    }
  }
`

export const REGISTER_VALIDATE_TOKEN = gql`
  query registerValidateToken {
    registerValidateToken {
      message
    }
  }
`

//forgot
export const FORGOT_GENERATE_URL = gql`
  mutation forgotGenerateUrl ($input: SendPasswordVerificationToUserInput!){
    forgotGenerateUrl(input: $input) {
      message
    }
  }
`

export const FORGOT_VALIDATE_URL = gql`
  mutation forgotValidateUrl ($input: ValidateVerifyUrlInput!){
    forgotValidateUrl(input: $input) {
      message
    }
  }
`

export const FORGOT_PASSWORD = gql`
  mutation forgotPassword ($input: RegisterUserInput!){
    forgotPassword(input: $input){
      message
    }
  }
`