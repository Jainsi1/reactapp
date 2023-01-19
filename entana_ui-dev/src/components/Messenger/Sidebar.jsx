import { Col } from "antd";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import UserSearch from "./UserSearch";
import Rooms from "./Rooms";
import { useMutation } from "@apollo/client";
import { CREATE_ROOM } from "./graphql/Mutation";

const Sidebar = forwardRef(({ onRoom }, ref) => {

  const [userSearch, setUserSearch] = useState(false);
  const roomRef = useRef(null);

  useImperativeHandle(ref, () => ({
    handle(event, data) {
      roomRef.current.handle(event, data)
    },
    createRoom(userId) {
      onCreateRoom(userId)
    }
  }))

  const updateCurrenRoom = (room) => {
    onRoom(room)
  }

  const setUserRoom = (room) => {
    roomRef.current.setUserRoom(room)
  }

  const [createRoom] = useMutation(CREATE_ROOM)

  const onCreateRoom = (userId) => {
    createRoom({
      variables: {
        user_id: userId
      }
    }).then(({ data }) => {
      setUserRoom(data.createRoom)
    }).catch(console.log)
  }

  return (
    <Col xs={24} md={8} xl={8}>
      <div className="mainChatBox" style={{ minHeight: "476px" }}>
        {userSearch ?
          <UserSearch
            onRoom={setUserRoom}
            closeSearch={() => setUserSearch(false)}
          /> : null}

        <Rooms
          hide={userSearch}
          ref={roomRef}
          closeUserSearch={() => setUserSearch(false)}
          openUserSearch={() => setUserSearch(true)}
          onCreateRoom={onCreateRoom}
          onRoom={updateCurrenRoom}
        />
      </div>
    </Col>
  )
})

export default Sidebar