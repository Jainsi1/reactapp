import { Avatar, Col, Input, Row, Typography } from "antd";
import { CheckOutlined, MinusOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ROOMS, GET_USERS } from "./graphql/Query";
import moment from "moment/moment";
import { SocketContext } from "../../context/socket";
import { ADD_POST } from "../NewsFeed/graphql/Mutation";
import { CREATE_ROOM } from "./graphql/Mutation";
import InfiniteScroll from "react-infinite-scroll-component";

const { Title, Text } = Typography;

const UserSearch = forwardRef(({ closeSearch, onRoom }, ref) => {

  const [searchRoom, setSearchRoom] = useState(null);

  const { loading, error, data, fetchMore, refetch } = useQuery(GET_USERS, {
    fetchPolicy: "network-only",
    variables: {
      where: {},
      skip: 0,
      limit: 30
    }
  });

  useEffect(() => {
    if (searchRoom) {
      refetch({
        where: {
          firstName: searchRoom
        },
      }).then()
    }
  }, [searchRoom]);

  const [hasMore, setHasMore] = useState(true);

  const getData = async () => {
    const where = {}
    if (searchRoom) {
      where.firstName = searchRoom
    }
    await fetchMore({
      variables: {
        where,
        skip: data.getUsers?.users.length
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if ( !fetchMoreResult.getUsers?.users.length) {
          setHasMore(false)
          return prev
        }

        return {
          getUsers: {
            count: fetchMoreResult.getUsers?.users.length,
            users: [...prev.getUsers?.users, ...fetchMoreResult.getUsers?.users]
          }
        }
      }
    });
  }

  const [createRoom] = useMutation(CREATE_ROOM)

  const onCreateRoom = (user) => {
    createRoom({
      variables: {
        user_id: user.id
      }
    }).then(({ data }) => {
      onRoom(data.createRoom)
    }).catch(console.log)
  }

  if (loading) return <p className="tw-text-center">Loading Users...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <Input
        className="searchBox"
        onChange={e => setSearchRoom(e.target.value)}
        value={searchRoom}
        placeholder="Search"
        prefix={<SearchOutlined/>}
        suffix={<MinusOutlined onClick={() => closeSearch()}/>}
      />
      <Title className="title">Users</Title>
        <InfiniteScroll
          dataLength={data?.getUsers?.users?.length}
          next={getData}
          hasMore={hasMore}
          loader={<p className="tw-text-center">Loading More User...</p>}
          endMessage={
            <p className="tw-text-center">No More User</p>
          }
          refreshFunction={() => {}}
          pullDownToRefresh
          scrollThreshold="200px"
          height={360}
          pullDownToRefreshThreshold={50}
          pullDownToRefreshContent={
            <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
          }
          releaseToRefreshContent={
            <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
          }
        >
          { !data?.getUsers?.users?.length && (
            <p>No user found!</p>
          )}
          {data?.getUsers?.users?.map(function (room) {
            return (
              <Row type="flex"
                   key={room.id}
                   onClick={() => onCreateRoom(room)}
                   justify="center"
                   align="middle"
                   className="roomBox">
                <Col xs={4} md={4} xl={4}>
                  <div className="avatar">
                    <img className="avatar_img"
                         src={room.image}
                         alt=""/>
                  </div>
                </Col>
                <Col xs={12} md={12} xl={12} className="messageTitleBox">
                  <Title className="messageTitle">{room.firstName} {room.lastName}</Title>
                </Col>
                <Col xs={8} md={8} xl={8} className="messageDateBox" align="end">
                </Col>
              </Row>
            )
          })}
        </InfiniteScroll>
    </>
  )
})

export default UserSearch