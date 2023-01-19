import React, { useEffect, useState } from "react"
import { Row, Col, Typography, Button, Tabs, Avatar } from "antd"
import { PlusOutlined, EditOutlined, MinusOutlined } from '@ant-design/icons';

import "./index.css"
import EditProfilePictureModal from "../../components/Profile/EditProfilePictureModal";
import EditProfilePermissionModal from "../../components/Profile/EditProfilePermissionModal";
import EditProfileModal from "../../components/Profile/EditProfileModal";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PROFILE } from "./graphql/query";
import { FOLLOW_USER, UNFOLLOW_USER } from "./graphql/mutation";
import { FaGlobeAmericas, FaLock, FaUnlock } from "react-icons/fa";
import { getUserId } from "utils/user";
import openNotification from "utils/Notification";
import userLogo from "../../assets/images/user-logo.svg";
import NewsFeed from "../../components/NewsFeed/NewsFeed";

const { Title, Text } = Typography;

const Index = () => {

  const { id = getUserId() } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_PROFILE, {
    variables: {
      where: { id }
    },
    fetchPolicy: "network-only",
  });

  const [modal, setModal] = useState(null);

  const openModal = (type) => {
    setModal(type)
  }

  const closeModal = () => {
    setModal(null)
  }

  const permissionIcons = {
    public: <FaGlobeAmericas/>,
    protected: <FaUnlock/>,
    private: <FaLock/>
  }

  const permissionIsEditable = (key) => {
    if ( !data?.getProfile?.isCurrent) return null;

    return (
      <span className="icon" style={{ cursor: "pointer" }} onClick={() => openModal('permission')}>
        {permissionIcons[ data.getProfile?.permissions?.[ key ] || 'public' ]}
      </span>
    )
  }

  const [followUser] = useMutation(FOLLOW_USER)
  const [unfollowUser] = useMutation(UNFOLLOW_USER)

  const handleFollow = async () => {
    try {

      const cb = data.getProfile.isFollow ? unfollowUser : followUser;

      const { data: profile } = await cb({
        variables: {
          data: { id }
        },
        refetchQueries: [GET_PROFILE]
      });

      if ( !profile) throw new Error('Error')

      const messageType = data.getProfile.isFollow ? "unfollowed" : "followed"

      openNotification('success', `User ${messageType} successfully`);

    } catch (error) {
      console.log(error)
      const errorType = data.getProfile.isFollow ? "unfollowing" : "following"
      openNotification('error', `Error while ${errorType} the user`);
    }
  }

  useEffect(() => {
    if (error?.message === 'User not found') {
      openNotification('error', `User not found`);
      navigate('/')
    }
  }, [error]);


  if (loading) return <p className="tw-text-center">Loading Profile...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <Row className="Profile-wrapper" gutter={16}>
        <Row
          type="flex"
          justify="center"
          align="middle"
          className="Profile-banner">
          <Col xs={24} md={6}>
            <div className="user-img">
              {data.getProfile.isCurrent ?
                <div className="editIcon">
                  <span style={{ cursor: "pointer" }} onClick={() => openModal('picture')}>
                    Edit
                  </span>
                  {permissionIsEditable('image')}
                </div>
                : null}

              <Avatar
                className="avatar-icon"
                src={data.getProfile.image ? data.getProfile.image : userLogo}
                size={125}
              />

            </div>
          </Col>
          <Col xs={24} md={8}>
            <Row
              type="flex"
              align="center"
              className="User-Profile-Banner">
              <Title level={3}>{data.getProfile.name}</Title>
              {permissionIsEditable('name')}
            </Row>
            <Row
              type="flex"
              justify="center"
              align="start">
              <Col xs={11} md={8}>
                {data.getProfile.isCurrent ?
                  <Button
                    type="primary"
                    ghost
                    shape="round"
                    onClick={() => openModal('profile')}
                    icon={<EditOutlined/>}
                    block className="btnText">
                    Edit
                  </Button> :
                  <Button
                    type="primary"
                    ghost
                    shape="round"
                    icon={data.getProfile.isFollow ? <MinusOutlined/> : <PlusOutlined/>}
                    onClick={handleFollow}
                    className="btnText">
                    {data.getProfile.isFollow ? "Unfollow" : "Follow"}
                  </Button>
                }
              </Col>
              {!data.getProfile.isCurrent && (
                <>
                  <Col xs={12} md={1}></Col>
                  <Col xs={11} md={10}>
                    <Button
                      type="primary"
                      shape="round"
                      block
                      className="btnText"
                      onClick={() => navigate("/messenger/" + id)}
                    >Message
                    </Button>
                  </Col>
                </>
              )}
            </Row>
          </Col>
          <Col xs={24} md={8}>
            <Text className="Text">Industry: <span>
                {data.getProfile.industry}
              {permissionIsEditable('industry')}
              </span>
            </Text>

            <Text className="Text">Organization: <span>
              {data.getProfile.organization}
              {permissionIsEditable('organization')}
            </span>
            </Text>
            <Text className="Text">Role: <span>
              {data.getProfile.role}
              {permissionIsEditable('role')}
            </span>
            </Text>
            <Text className="Text">Designation: <span>
              {data.getProfile.designation}
              {permissionIsEditable('designation')}
            </span>
            </Text>
            <Text className="Text">Location: <span>
              {data.getProfile.location}
              {permissionIsEditable('location')}
            </span>
            </Text>
          </Col>
          <Col xs={24} md={4}>
          </Col>
        </Row>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Info" key="1">
            <div className="card-box">
              <div className="card-inside">
                <Title className="card-header" level={4}>Memberships</Title>
                <p className="paragraph">
                  {data.getProfile.name} is a member of following:
                </p>
                <Row
                  type="flex"
                  justify="center"
                  align="middle">
                  <Col md={6}></Col>
                  <Col md={18}>
                    <Row type="flex"
                         justify="start"
                         align="middle">
                      {data.getProfile?.memberShips?.map(function (member, i) {
                        return (
                          <>
                            {i > 0 ?
                              <div key={"box-" + i} className="box-border"></div>
                              : null}
                            <div key={"card-" + i} className={i % 2 ? "rounded-box-light" : "rounded-box-dark"}>
                              <span className="box-title">
                                {member.name}
                              </span>
                            </div>
                          </>
                        )
                      })}
                    </Row>
                  </Col>
                </Row>
              </div>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Wall Feed" key="2">
            <NewsFeed
              userId={parseInt(id)}
              hideCreatePost={ !data.getProfile.isCurrent}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Plan" key="3" disabled>
            Content of Tab Pane4
          </Tabs.TabPane>
          <Tabs.TabPane tab="Notifications" key="4" disabled>
            Content of Tab Pane 5
          </Tabs.TabPane>
        </Tabs>
      </Row>

      {data.getProfile.isCurrent ?
        (
          <>
            <EditProfilePictureModal
              closeModal={closeModal}
              visible={modal == 'picture'}
            />

            <EditProfilePermissionModal
              permissions={data.getProfile.permissions}
              closeModal={closeModal}
              visible={modal == 'permission'}
            />

            <EditProfileModal
              data={data.getProfile}
              closeModal={closeModal}
              visible={modal == 'profile'}
            />
          </>
        )
        : null}
    </>
  )
}

export default Index
