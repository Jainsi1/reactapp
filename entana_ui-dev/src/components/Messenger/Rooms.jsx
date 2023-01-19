import { Avatar, Col, Input, Row, Typography } from "antd";
import { CheckOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ROOMS } from "./graphql/Query";
import moment from "moment/moment";
import { SocketContext } from "../../context/socket";
import UserSearch from "./UserSearch";

const { Title, Text } = Typography;

const Rooms = forwardRef((
  {
    onRoom,
    openUserSearch,
    closeUserSearch,
    hide,
    onCreateRoom
  }, ref) => {
  const socket = useContext(SocketContext);

  const [currentRoom, setCurrentRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [searchRoom, setSearchRoom] = useState(null);

  const { loading, error, data } = useQuery(GET_ROOMS, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if ( !loading && !error && data) {
      setRooms(() => {
        return data.getRooms
      })
      console.log("Rooms", rooms)
      setTimeout(() => {
        socket.emit("check-online-users", data.getRooms.map(e => e.senderId))
      }, 2000)
    }

  }, [loading, data, error]);

  const callbacks = {
    "update-personal-note": room => {
      const index = rooms.findIndex(e => e.id == room.id)
      if (index > -1) {
        setRooms((allRooms) => {
          allRooms[ index ].personalNote = room.personalNote
          return allRooms
        })
        refreshNow()
      }
    },
    "check-online-users": data => {
      const oldRooms = rooms;
      for (let id of data) {
        const index = oldRooms.findIndex(e => e.senderId == id)
        if (index > -1) {
          oldRooms[ index ].isUserOnline = true
        }
      }

      console.log(oldRooms, rooms)
      setRooms(oldRooms)
      refreshNow()
    },
    "user-status": ({ type, id }) => {
      const index = rooms.findIndex(e => e.senderId == id)
      if (index > -1) {
        setRooms((allRooms) => {
          allRooms[ index ].isUserOnline = type === 'online'
          return allRooms
        })
        refreshNow()
      }
    },
    "chat-message": (data) => {
      const oldRooms = rooms
      console.log("rooms-chat-message", {
        data, rooms
      })
      const index = oldRooms.findIndex(e => e.id == data.roomId)
      if (currentRoom?.id !== data.roomId) {
        socket.emit("message-delivered", {
          id: data.id,
          roomId: data.roomId
        });
      }
      if (index > -1) {
        oldRooms[ index ].latestMessage = data.message
        oldRooms[ index ].lastMessageAt = data.updatedAt
        setRooms(oldRooms)
        refreshNow()
      } else {
        onCreateRoom(data.userId)
      }
    },
    "message-sent": data => {
      const oldRooms = rooms
      const index = oldRooms.findIndex(e => e.id == data.roomId)
      if (index > -1) {
        oldRooms[ index ].latestMessage = data.message
        oldRooms[ index ].lastMessageAt = data.updatedAt
        setRooms(oldRooms)
        refreshNow()
      }
    }
  }

  const refreshNow = () => {
    setRefresh(() => {
      return true
    })
    setRefresh(() => {
      return false
    })
  }

  useImperativeHandle(ref, () => ({
    handle(event, data) {
      if (callbacks[ event ]) {
        callbacks[ event ](data)
      }
    },
    setUserRoom(room) {
      setRooms(data => {
        const index = data.findIndex(e => e.id == room.id)
        if (index > -1) {
          data.splice(index, 1)
        }
        data.unshift({
          ...room,
          newRoom: true
        })
        return data
      })
      closeUserSearch()
      updateCurrenRoom(room)
      refreshNow()
    }
  }))

  const updateCurrenRoom = (room) => {
    setCurrentRoom(room)
    onRoom(room)
  }

  const getRooms = () => {
    if (searchRoom) {
      return rooms.filter((conversation) => {
        return (
          conversation.firstName
            .toLowerCase()
            .includes(searchRoom.toLowerCase()) ||
          conversation.lastName
            .toLowerCase()
            .includes(searchRoom.toLowerCase())
        )
      });
    }

    return rooms.sort((b, a) => {
      if (a.newRoom) {
        return true
      }
      return new Date(a.lastMessageAt).getTime() - new Date(b.lastMessageAt).getTime();
    });
  }

  if (loading) return <p className="tw-text-center">Loading Rooms...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div style={{ display: hide ? "none" : "" }}>
      <Input
        className="searchBox"
        onChange={e => setSearchRoom(e.target.value)}
        value={searchRoom}
        placeholder="Search"
        prefix={<SearchOutlined/>}
        suffix={<PlusOutlined onClick={() => openUserSearch()}/>}
      />
      <Title className="title">Conversations</Title>
      <div className="chatBoxSidebar">
        {getRooms().length === 0 && (
          <p>No room found!</p>
        )}
        { !refresh && getRooms().map(function (room) {
          return (
            <Row type="flex"
                 key={room.id}
                 onClick={() => updateCurrenRoom(room)}
                 justify="center"
                 align="middle"
                 className="roomBox">
              <Col xs={4} md={4} xl={4}>
                <div className="avatar">
                  <img className="avatar_img"
                       src={room.image}
                       alt=""/>
                  {room.isUserOnline && (<span className="indicator online"></span>)}
                </div>
              </Col>
              <Col xs={12} md={12} xl={12} className="messageTitleBox">
                <Title className="messageTitle">{room.firstName} {room.lastName}</Title>
                <Text className="messageUpper">{room.latestMessage}</Text>
              </Col>
              <Col xs={8} md={8} xl={8} className="messageDateBox" align="end">
                {room.lastMessageAt && (
                  <Title className="messageDateTitle">{moment(room.lastMessageAt).fromNow()}</Title>
                )}
                {/*<Text className="messageTick"><CheckOutlined/></Text>*/}
              </Col>
            </Row>
          )
        })}
      </div>
    </div>
  )
})

export default Rooms