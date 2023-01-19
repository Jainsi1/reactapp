import React, { useContext, useEffect, useRef, useState } from "react"
import { Row, Col, Descriptions, Input, Typography, Select } from "antd"
import "./messenger.css"
import Sidebar from "../../components/Messenger/Sidebar";
import MessageContainer from "../../components/Messenger/MessageContainer";

import { SocketContext } from 'context/socket';
import { useParams } from "react-router-dom";

const Messenger = () => {
  const socket = useContext(SocketContext);

  const { userId } = useParams();

  const roomRef = useRef(null);
  const messageRef = useRef(null);

  const [room, setRoom] = useState(null);

  const onRoom = (room) => {
    socket.emit("create-room", {
      senderId: room.senderId,
      room: room.id,
    });
    setRoom(room)
  }

  const onUpdatePersonalNote = (room) => {
    setRoom(data => {
      data.personalNote = room.personalNote
      return data
    })

    roomRef?.current?.handle("update-personal-note", room)
  }

  useEffect(() => {
    socket.on('check-online-users', data => {
      roomRef?.current?.handle("check-online-users", data)
    });

    socket.on("user-status", data => {
      roomRef?.current?.handle("user-status", data)
      messageRef?.current?.handle("user-status", data)
    });

    console.log("listeneer added")
    socket.on("invite-to-room", data => {
      console.log("invite-to-room", data)
      socket.emit("join-room", data);
    });

    socket.on("chat-message", message => {
      console.log(message)
      roomRef.current.handle("chat-message", message)
      messageRef?.current?.handle("chat-message", message)
    });

    socket.on("message-sent", data => {
      roomRef.current.handle("message-sent", data)
      messageRef?.current?.handle("message-sent", data)
    });

    socket.on("message-delivered", data => {
      messageRef?.current?.handle("message-delivered", data)
    });

    socket.on("message-seen-delivered", data => {
      messageRef?.current?.handle("message-seen-delivered", data)
    });

    if (userId) {
      roomRef.current.createRoom(userId)
    }

    return () => {
      socket.off('check-online-users')
      socket.off('user-status')
      socket.off('invite-to-room')
      socket.off('chat-message')
      socket.off('message-sent')
      socket.off('message-delivered')
      socket.off('message-seen-delivered')
    };
  }, [userId]);

  return (
    <>
      <Row className="dashboard-main-text">
        <Col span={16}>
          <h2>Messenger</h2>
        </Col>
      </Row>

      <Row
        gutter={16}
        className=""
        style={{ marginTop: "2rem" }}
      >
        <Sidebar onRoom={onRoom} ref={roomRef}/>

        {room?.id ?
          <MessageContainer
            ref={messageRef}
            room={room}
            updatePersonalNote={onUpdatePersonalNote}
          /> :
          <Col xs={24} md={16} xl={16}>
            <div className="mainChatBox" style={{ minHeight: "476px" }}>
              <p style={{ textAlign: "center" }}>Select Room!</p>
            </div>
          </Col>
        }
      </Row>

    </>
  )
}

export default Messenger
