import { gql } from '@apollo/client';

export const GET_QBR_SCORES = gql`
  query getQbrScores($data: GetQbrScoresInput!) {
    getQbrScores(data: $data) {
      organizationName
      qbrScore {
        bars {
          id
          name
          contribution
        }
        organization_id
        name
        freeze
      }
      quarters {
        id
        name
      }
    }
  }
`;

export const GET_QBR_SCORE = gql`
  query getQbrScore($data: GetQbrScoreInput!) {
    getQbrScore(data: $data) {
      qbrScore {
        id
        start_date
        due_date
        summary
        approvedUserName
        responses {
          qbr_template_step_segment_question_id
          weightage
          response
          details
        }
        bars {
          name
          score
          contribution
          weightage
        }
      }
      trends {
        bars {
          id
          name
          contribution
          users {
            id firstName lastName image
          }
        }
        headers
        organization_id
        total_contribution
        name
      }
      qbrTemplate {
        id
        commodity_ids
        name
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
      permissions
    }
  }
`;

export const GET_TRENDS = gql`
  query getTrends($data: GetTrendsInput!) {
    getTrends(data: $data) {
      trends {
        name
        headers
        organization_id
        total_contribution
        bars {
          id
          name
          contribution
          users {
            id firstName lastName image
          }
        }
      }
      permissions
    }
  }
`;

export const GET_QUARTERS = gql`
  query getQuarters {
    getQuarters {
      quarters {
        id
        name
      }
      defaultTemplate {
        id
        commodity_ids
        name
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
  }
`;