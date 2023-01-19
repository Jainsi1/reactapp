import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_COMMENT } from '../../graphql/Mutation';
import Picker from 'emoji-picker-react';
import openNotification from 'utils/Notification';
import { getProfileImage } from "utils/user";
import userLogo from "../../../../assets/images/user-logo.svg";
import { Avatar } from "antd";

const refreshPost = require('utils/refreshPost');

const CreateCommentBox = (props) => {
  const {post_id} = props;
  const commentDivRef = useRef(null);
  const commentRef = useRef(null);

  const [comment, setComment] = useState({
    comment: '',
    disableComment: false
  })

  useEffect(() => {
    commentDivRef.current.style.height = "0px";
    const scrollHeight = commentRef.current.scrollHeight;
    commentDivRef.current.style.height = Math.max(scrollHeight, 32) + "px";
  }, [comment]);

  const [addComment] = useMutation(ADD_COMMENT)

  const onSubmitComment = (e) => {
    if (e.code === "Enter" && !e.shiftKey && comment.comment.trim().length) {
      setComment({...comment, disableComment: true})

      addComment({
        variables: {
          data: {
            post_id,
            comment: comment.comment,
          }
        }
      }).then(() => {
        setComment({
          comment: '',
          disableComment: false
        })
        refreshPost(post_id)
      }).catch((error) => {
        console.log(error)
        setComment({...comment, disableComment: false})
        openNotification('error', 'Error while commenting');
      });
    }
  }

  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setShowPicker(false)
    setComment({
      comment: comment.comment + emojiObject.emoji
    });
  };

  const toggleEmoji = () => {
    setShowPicker(!showPicker)
  };

  return (
    <div className="tw-flex tw-items-center tw-justify-between tw-px-3 tw-py-3 tw-relative">
      <div className="tw-w-8 tw-h-8">
        <Avatar
          className="tw-w-full tw-h-full tw-rounded-full"
          src={getProfileImage() || userLogo}
          size={30}
        />
      </div>
      <div
        ref={commentDivRef}
        className="tw-bg-gray-100 tw-flex tw-h-8 tw-items-center tw-justify-between tw-overflow-hidden tw-px-4 tw-rounded-2xl tw-text-sm tw-w-10.5/12 lg:tw-w-11.5/12">
        <textarea
          ref={commentRef}
          style={{ resize: "none", border: "none", paddingTop: "5px" }}
          className="tw-bg-gray-100 tw-h-full tw-outline-none tw-w-full" maxLength={250}
          placeholder="Write your comment..."
          value={comment.comment}
          disabled={comment.disableComment}
          onChange={e => setComment({...comment, comment: e.target.value})}
          onKeyPress={onSubmitComment}
          name="comment"
          autoComplete="off"/>
        <svg height="24" className="tw-cursor-pointer" onClick={toggleEmoji} viewBox="0 0 24 24" width="24"
             xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path
            d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
        </svg>
      </div>
      {showPicker ?
        <div className="tw-absolute tw-mt-4 tw-right-0 tw-top-1/2 tw-z-10"><Picker onEmojiClick={onEmojiClick}/>
        </div> : null}
    </div>
  );
};

export default CreateCommentBox;
