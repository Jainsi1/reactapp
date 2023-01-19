import React, {useState} from 'react';
import moment from 'moment';
import {useMutation} from "@apollo/client";
import {
  DELETE_COMMENT,
  UPDATE_COMMENT,
} from "../../graphql/Mutation";
import Picker from "emoji-picker-react";
import Reply from "../reply";
import CreateReplyBox from "../reply/CreateReplyBox";
import openNotification from "utils/Notification";
import {getUserId} from "utils/user";
import { Avatar } from "antd";
import { Link } from "react-router-dom";

const refreshPost = require('utils/refreshPost');

const Comment = (props) => {
  const {comment, post_id} = props;

  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const [isEditComment, setIsEditComment] = useState(false);

  const toggleDropdown = () => {
    setDropdownPopoverShow(!dropdownPopoverShow);
  }

  const [updatedComment, setUpdatedComment] = useState({
    comment: '',
    disableComment: false
  })

  const onEditComment = () => {
    setIsEditComment(true)
    toggleDropdown();
    setUpdatedComment({
      comment: comment.comment,
      disableComment: false
    });
  }

  const [updateComment] = useMutation(UPDATE_COMMENT)
  const [deleteComment] = useMutation(DELETE_COMMENT)

  const onSubmit = (e) => {
    if (e.code === "Enter" && updatedComment.comment.trim().length) {
      setUpdatedComment({...updatedComment, disableComment: true})

      updateComment({
          variables: {
            data: {
              comment: updatedComment.comment
            },
            where: {id: comment.id}
          }
        }
      ).then(() => {
        setUpdatedComment({
          comment: '',
          disableComment: false
        })
        setIsEditComment(false)
        refreshPost(post_id)
      }).catch((error) => {
        console.log(error)
        setUpdatedComment({...updatedComment, disableComment: false})
        openNotification('error', 'Error while updating comment');
      });
    }
  }

  const onDeleteComment = async () => {
    toggleDropdown();

    deleteComment({
      variables: {
        where: {id: comment.id}
      }
    }).then(() => {
      refreshPost(post_id)
    }).catch((error) => {
      console.log(error)
      openNotification('error', 'Error while deleting comment');
    });

  }

  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setShowPicker(false)
    setUpdatedComment({
      comment_id: comment.id,
      comment: updatedComment.comment + emojiObject.emoji
    });
  };

  const toggleEmoji = () => {
    setShowPicker(!showPicker)
  };

  return (
    <div>
      <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-px-3 tw-py-1 tw-pt-2">
        <div className="tw-w-8 tw-h-8">
          <Link to={"/user-profile/" + comment.user.id}>
            <Avatar
              className="tw-w-full tw-h-full tw-rounded-full"
              src={comment.user.image}
              size={34}
            />
          </Link>
        </div>
        <div
          className={(isEditComment ? "" : "tw-bg-gray-100") + " tw-items-center tw-justify-between tw-px-4 tw-rounded-2xl tw-text-sm tw-w-10.5/12 lg:tw-w-11.5/12 tw-relative"}>

          {getUserId() == comment.user.id ?
            <div>
              <button type="button"
                      onClick={toggleDropdown}
                      className="tw-absolute tw-right-4 tw-pt-2 focus:tw-outline-none tw-text-sm tw-font-medium tw-text-gray-700 tw-shadow-sm"
                      id="menu-button" aria-expanded="true" aria-haspopup="true">
                <svg className="focus:tw-outline-none tw--mr-1 tw-ml-2 tw-h-5 tw-w-5"
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 20 20"
                     fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"/>
                </svg>
              </button>
              <div
                className={(dropdownPopoverShow ? "tw-block " : "tw-hidden ") + "tw-mt-10 tw-absolute tw-right-0 tw-z-10 tw-mt-2 tw-w-56 tw-origin-top-right tw-rounded-md tw-bg-white tw-shadow-lg tw-ring-1 tw-ring-black tw-ring-opacity-5 focus:tw-outline-none"}
                role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                <div className="tw-py-1">
                  <a onClick={onEditComment}
                     className="tw-cursor-pointer hover:tw-bg-gray-100 tw-text-gray-700 tw-block tw-px-4 tw-py-2 tw-text-sm">
                    Edit
                  </a>
                  <a onClick={onDeleteComment}
                     className="tw-cursor-pointer hover:tw-bg-gray-100 tw-text-gray-700 tw-block tw-px-4 tw-py-2 tw-text-sm">
                    Delete
                  </a>
                </div>
              </div>
            </div> : null
          }

          <p className="tw-font-semibold tw-text-sm tw-text-gray-900 tw-pt-1 avatar-hover">
            <Link to={"/user-profile/" + comment.user.id}>{comment.user.username}</Link>
            {comment.user.organizationId ?
              <Link to={"/org-profile/" + comment.user.organizationId}> ({comment.user.organizationName})</Link>
              : null}
          </p>

          <div className="tw-mb-1">
            {isEditComment ?
              <div className="tw-justify-between tw-relative">
                <div
                  className="tw-bg-gray-100 tw-flex tw-h-8 tw-items-center tw-justify-between tw-overflow-hidden tw-px-4 tw-rounded-2xl tw-text-sm">
                  <input
                    type="text"
                    className="tw-bg-gray-100 tw-h-full tw-outline-none tw-w-full" maxLength={250}
                    placeholder="Write your comment..."
                    value={updatedComment.comment}
                    disabled={updatedComment.disableComment}
                    onChange={e => setUpdatedComment({...updatedComment, comment: e.target.value})}
                    onKeyPress={onSubmit}
                    name="comment"/>
                  <svg height="24" className="tw-cursor-pointer" onClick={toggleEmoji}
                       viewBox="0 0 24 24" width="24"
                       xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path
                      d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                  </svg>
                </div>
                {showPicker ?
                  <div className="tw-absolute tw-mt-4 tw-right-0 tw-top-1/2 tw-z-10"><Picker
                    onEmojiClick={onEmojiClick}/>
                  </div> : null}
              </div>
              : <p style={{ whiteSpace: "pre-line" }} className="tw-text-gray-700 tw-text-sm">
                {comment.comment}
              </p>
            }
          </div>
        </div>
        <span className="tw-ml-14 tw-pt-1 tw-text-xs">{moment(comment.created_at).fromNow()}</span>
      </div>

      {comment.replies.length ? comment.replies.map((reply, idx) =>
        <Reply key={idx} reply={reply} post_id={post_id}/>
      ) : null}

      <CreateReplyBox post_id={post_id} comment_id={comment.id}/>

    </div>
  );
};

export default Comment;
