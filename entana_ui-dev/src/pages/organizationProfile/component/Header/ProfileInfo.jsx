import samsungImg from "assets/images/samsung.svg"
import tickCorner from "assets/images/tick-corner.svg"
import { PlusOutlined, EditOutlined, MinusOutlined } from '@ant-design/icons';
import { Row, Col, Typography, Button } from "antd"

import moment from "moment";
import openNotification from "utils/Notification";
import React, { useContext } from "react"
import { ProfileContext } from "pages/organizationProfile";
import { useMutation } from "@apollo/client";
import { FOLLOW_ORGANIZATION_USER, UNFOLLOW_ORGANIZATION_USER } from "./graphql/mutation";
import { GET_ORGANIZATION_PROFILE } from './graphql/query'

const { Title, Text, Link } = Typography;


function parsedLink(url) {
  return url.replace("https://", "").replace("http://", "");
}

function getFoundedYear(time) {
  if (time) { return moment(time).format('YYYY') }
  return null;
}




const StyleProfileBtn = (props) => {
  const { content, onClick, icon } = props

  return (
    <Button type="primary" ghost shape="round" onClick={onClick} icon={icon} block className="btnText">
      {content}
    </Button>
  )
}

const ProfileBtn = (props) => {
  const { dispatch, action } = props
  const { isCurrent, isFollow } = useContext(ProfileContext);
  const [handleFollow] = useFollowHandler()

  if (isCurrent) {
    return (
      <StyleProfileBtn onClick={() => dispatch(action)} icon={<EditOutlined />} content="Edit" />
    )
  }

  if (isFollow) {
    return (
      <StyleProfileBtn onClick={handleFollow} icon={<MinusOutlined />} content="Unfollow" />
    )
  }

  else {
    return (
      <StyleProfileBtn onClick={handleFollow} icon={<PlusOutlined />} content="Follow" />

    )
  }

}

const useFollowHandler = () => {

  const { isFollow, id, refetch } = useContext(ProfileContext)

  const [followOrganizationUser] = useMutation(FOLLOW_ORGANIZATION_USER)
  const [unfollowOrganizationUser] = useMutation(UNFOLLOW_ORGANIZATION_USER)

  const handleFollow = async () => {
    try {

      const cb = isFollow ? unfollowOrganizationUser : followOrganizationUser;

      const { data: profile } = await cb({
        variables: {
          data: { id }
        },
      });

      if (!profile) throw new Error('Error') 
      else {refetch()}

      const messageType = isFollow ? "unfollowed" : "followed"

      openNotification('success', `Organization ${messageType} successfully`);

    } catch (error) {
      console.log(error)
      const errorType = isFollow ? "unfollowing" : "following"
      openNotification('error', `Error while ${errorType} the user`);
    }
  }

  return [handleFollow]
}

export default function OrganizationInfoCol(props) {
  const { name, isVerified, industry, employees, hq, website, founded } = useContext(ProfileContext);

  return (
    <>
      <Col xs={24} md={8}>
        <Row className={"Profile-banner-heading flex justify-center "}>
          <Title level={3}>{name}</Title>
          {isVerified && <img className="tick" src={tickCorner} alt="tick" />}
        </Row>
        <Row className="flex justify-center" >
          <Col xs={11} md={8}>
            <ProfileBtn {...props} />
          </Col>
        </Row>
      </Col>
      <Col xs={24} md={6}>
        <Text className="Text">Industry: <span>{industry}</span></Text>
        <Text className="Text">Employees: <span>{employees}</span></Text>
        <Text className="Text">Founded: <span> {getFoundedYear(founded)} </span> </Text>
        <Text className="Text">HQ: <span>{hq}</span></Text>
        <Text className="Text">Website: <span>{website && <Link href={website} target="_blank" children={parsedLink(website)} />}</span></Text>
      </Col>
    </>
  )
}