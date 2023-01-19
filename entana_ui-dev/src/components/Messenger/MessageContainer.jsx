import { Button, Col, Input, Row, Typography } from "antd";
import { MoreOutlined, PlusOutlined, SendOutlined, SmileOutlined } from "@ant-design/icons";
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_MESSAGES, GET_ROOMS } from "./graphql/Query";
import moment from "moment";
import { getUserId } from "../../utils/user";
import { SocketContext } from "../../context/socket";
import MessageDeliveryIcon from "./MessageDeliveryIcon";
import Picker from "emoji-picker-react";
import openNotification from "../../utils/Notification";
import { UPDATE_PERSONAL_NOTE } from "./graphql/Mutation";

const { TextArea } = Input;

const { Title, Text } = Typography;

const MessageContainer = forwardRef((
  { room, updatePersonalNote: onUpdatePersonalNote }
  , ref) => {
  const socket = useContext(SocketContext);

  const [hasViewProfile, setHasViewProfile] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const personalNoteRef = useRef(null);
  const [personalNoteBtnDisabled, setPersonalNoteBtnDisabled] = useState(false);

  const { loading, error, data } = useQuery(GET_MESSAGES, {
    fetchPolicy: "network-only",
    variables: {
      roomId: room.id
    }
  });

  const toggleEmoji = () => {
    setShowPicker( !showPicker)
  };

  const onEmojiClick = (event, emojiObject) => {
    setShowPicker(false)
    setNewMessage(newMessage ?? "" + emojiObject.emoji);
  };

  const callbacks = {
    "user-status": ({ type, id }) => {
      if (id == room.senderId) {
        setIsUserOnline(type === 'online')
      }
    },
    "chat-message": (data) => {
      if (data.roomId !== room.id) {
        return
      }
      setMessages(map => {
        map.unshift(data)
        return map
      })
      socket.emit("message-seen-delivered", {
        id: data.id,
        roomId: data.roomId
      });
      refreshNow()
    },
    "message-sent": data => {
      const oldMessage = messages
      oldMessage[ 0 ].updatedAt = data.updatedAt
      setMessages(oldMessage)
      refreshNow()
    },
    "message-delivered": data => {
      const oldMessage = messages
      oldMessage[ 0 ].deliveredAt = data.deliveredAt
      setMessages(oldMessage)
      refreshNow()
    },
    "message-seen-delivered": data => {
      const oldMessage = messages
      oldMessage[ 0 ].deliveredAt = data.deliveredAt
      oldMessage[ 0 ].seenAt = data.seenAt
      setMessages(oldMessage)
      refreshNow()
    },
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
    }
  }))

  useEffect(() => {
    if ( !loading && !error && data) {
      setMessages(data.getMessages)
      setIsUserOnline(room.isUserOnline)
    }
  }, [data, loading, error]);


  const sendMessage = () => {
    if ( !newMessage?.trim()?.length) {
      return
    }
    socket.emit("message-send", {
      roomId: room.id,
      senderId: room.senderId,
      message: newMessage
    })
    setMessages(data => {
      data.unshift({
        id: Math.max(...messages.map(o => o.id)) + 1,
        senderId: room.senderId,
        userId: getUserId(),
        roomId: room.id,
        message: newMessage,
        deliveredAt: null,
        seenAt: null,
        createdAt: moment.now(),
        updatedAt: null
      })
      return data
    })
    setNewMessage(null)
  }

  const handleEnterMessage = (e) => {
    if (e.code === "Enter" && !e.shiftKey) {
      sendMessage()
    }
  }

  const [updatePersonalNote] = useMutation(UPDATE_PERSONAL_NOTE)

  const onPersonalNoteSave = async () => {
    const text = personalNoteRef.current.resizableTextArea.textArea.value
    setPersonalNoteBtnDisabled(true)

    try {

      const { data } = await updatePersonalNote({
        variables: {
          data: {
            user_id: room.senderId,
            room_id: room.id,
            personal_note: text
          }
        }
      });

      if ( !data) throw new Error('Error')

      openNotification('success', 'Personal note has been updated successfully');

      setPersonalNoteBtnDisabled(false)
      onUpdatePersonalNote({
        ...room,
        personalNote: text
      })

    } catch (error) {
      console.log(error)
      setPersonalNoteBtnDisabled(false)

      openNotification('error', 'Error while updating Personal note');
    }
  }

  if (loading) {
    return (
      <Col xs={24} md={16} xl={16}>
        <div className="mainChatBox" style={{ minHeight: "476px" }}>
          Loading Messages...
        </div>
      </Col>
    )
  }

  if (error) return <p>Error :(</p>;

  return (
    <>
      <Col xs={24} md={hasViewProfile ? 9 : 16} xl={hasViewProfile ? 9 : 16}>
        <div className="mainChatBox">
          <Row
            type={"flex"}
            justify="space-between"
            align={"middle"}
            className="chatBox">
            <Col xs={4} md={hasViewProfile ? 4 : 2} xl={hasViewProfile ? 4 : 2}>
              <div style={{ display: "flex", width: "15rem" }}>
                <div className="avatar" onClick={() => setHasViewProfile( !hasViewProfile)}>
                  <img className="avatar_img"
                       src={room.image}
                       alt=""/>
                  {isUserOnline && (<span className="indicator online"></span>)}
                </div>
                <div style={{ paddingLeft: "7px" }}>
                  <Title className="messageTitle">{room.firstName} {room.lastName}</Title>
                  {/*<Text className="messageUpper">Online - Last seen, 2.02pm</Text>*/}
                  <Text
                    className="messageUpper">{room.designation ? room.designation + ", " : ""}{room.organizationName}
                  </Text>
                </div>
              </div>
            </Col>
            <Col xs={4} md={4} xl={4} className="messageDateBox" align="end">
              <Text className="messageTick"><MoreOutlined className="moreIcon"/></Text>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={24} xl={24}>
              <div className="chatInnerBox">
                <div className="chatBoxMessages">
                  {!refresh && messages?.length ? messages.map(function (message, index) {
                    const type = getUserId() == message.userId ? "receiver" : "sender"
                    return (
                      <div key={index} className={type}>
                        <div className={type + "Message"}>{message.message}</div>
                        <div className={type + "Date"}>
                          {moment(message.createdAt).fromNow()}
                          {type === "receiver" && (
                            <MessageDeliveryIcon
                              key={message.updatedAt}
                              delivered_at={message.deliveredAt}
                              seen_at={message.seenAt}
                              created_at={message.updatedAt}
                            />
                          )}
                        </div>
                      </div>
                    )
                  }) : null}
                </div>
                <div className={"tw-relative"}>
                  <div className="messageType">
                    <Input className="messageType inputFocus"
                           onChange={e => setNewMessage(e.target.value)}
                           value={newMessage}
                           onKeyPress={handleEnterMessage}
                           placeholder="Type here..."
                    />
                    <SmileOutlined className="emoji" onClick={toggleEmoji}/>
                    <SendOutlined className="send" onClick={sendMessage}/>
                  </div>
                  {showPicker ?
                    <div className="tw-absolute tw-mt-4 tw-right-0 tw-top-1/2 tw-z-10"><Picker
                      onEmojiClick={onEmojiClick}/>
                    </div> : null}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Col>

      {hasViewProfile && (
        <Col xs={24} md={7} xl={7} className="mainChatBox">
          <Row type="flex"
               className="chatBox">
            <Col xs={4} md={4} xl={4}>
              <div className="avatar">
                <img className="avatar_img"
                     src={room.image}
                     alt=""/>
                {isUserOnline && (<span className="indicator online"></span>)}
              </div>
            </Col>
            <div style={{ paddingLeft: "7px" }}>
              <Title className="messageTitle">{room.firstName} {room.lastName}</Title>
              {/*<Text className="messageUpper">Online - Last seen, 2.02pm</Text>*/}
              <Text
                className="messageUpper">{room.designation ? room.designation + ", " : ""}{room.organizationName}
              </Text>
            </div>
          </Row>
          <Row>
            <Col xs={24} md={24} xl={24}>
              <Title className="personalNoteHeading">Personal Notes</Title>
              <TextArea
                ref={personalNoteRef}
                showCount
                onBlur={onPersonalNoteSave}
                maxLength={500}
                defaultValue={room.personalNote}
                style={{ height: 314, resize: 'none' }}
                placeholder="Enter personal notes"
              />
            </Col>
          </Row>
        </Col>
      )}
    </>
  )
})

export default MessageContainer