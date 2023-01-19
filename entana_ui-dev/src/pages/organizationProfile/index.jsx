import React, { useContext, useReducer } from "react"
import { Col, Row } from "antd"

import { useParams } from "react-router-dom";
import { getOrganizationId, getCurrentGroup } from "utils/user";
import { GET_ORGANIZATION_PROFILE } from "./graphql/query";
import EditorModal from "./component/Modal";

import WithRequestData from "components/RequestWrapper";
import { modalReducer, PICTURE, PROFILE, CLOSE } from "./component/Modal";

import ProfileImgCol from "./component/Header/ProfileImg";
import OrganizationInfoCol from "./component/Header/ProfileInfo";

import OrganizationTabsRow from "./component/Tabs";


export default function OrganizationPageWrapper() {
  const {
    id = getOrganizationId(),
    currentGroup = getCurrentGroup()
  } = useParams();

  const variables = {
    where: {
      id,
      groupId: currentGroup.id
    }
  }


  return (
    <WithRequestData query={GET_ORGANIZATION_PROFILE} variables={variables}>
      {
        ({ data, refetch }) => (
          <ProfileContext.Provider value={{ ...data.getOrganizationProfile, id, refetch }}>
            <OrganizationPage />
          </ProfileContext.Provider>
        )
      }
    </WithRequestData>
  )
}

export const ProfileContext = React.createContext({});

const OrganizationPage = (props) => {
  const { isCurrent } = useContext(ProfileContext);

  const [modal, dispatch] = useReducer(modalReducer, CLOSE)

  return (
    <>
      <Row className="Profile-wrapper" gutter={16}>
        <Row className="Profile-banner flex justify-center items-center ">
          <ProfileImgCol dispatch={dispatch} action={{ type: PICTURE }} />
          <OrganizationInfoCol dispatch={dispatch} action={{ type: PROFILE }} />
          <Col xs={24} md={4} />
        </Row>
        <OrganizationTabsRow />
      </Row>
      {isCurrent && <EditorModal modal={modal} dispatch={dispatch} />}
    </>
  )
}