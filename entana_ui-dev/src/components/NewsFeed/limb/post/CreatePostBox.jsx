import React, { useState, useRef, useEffect } from 'react';

import { useMutation } from "@apollo/client";
import { ADD_POST } from "../../graphql/Mutation";
import Picker from 'emoji-picker-react';
import { FaSmile } from "react-icons/fa";
import openNotification from "utils/Notification";
import { getProfileImage } from "utils/user";
import { Avatar } from "antd";
import { getGroups } from 'utils/user';
import userLogo from "assets/images/user-logo.svg"

const refreshPost = require('utils/refreshPost');

const CreatePostBox = () => {
  const postDivRef = useRef(null);
  const postRef = useRef(null);
  const [post, setPost] = useState({
    caption: '',
    type: 'public',
    captionDisabled: false
  });

  useEffect(() => {
    postDivRef.current.style.height = "0px";
    const scrollHeight = postRef.current.scrollHeight;
    postDivRef.current.style.height = Math.max(scrollHeight, 32) + "px";
  }, [post]);

  const [addPost] = useMutation(ADD_POST)

  const onSubmit = (e) => {
    if (e.code === "Enter" && !e.shiftKey && post.caption.trim().length) {
      setPost({ ...post, captionDisabled: true });

      const URLMatcher = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\\/%=~_|$])/gim;
      const caption = post.caption.replace(
        URLMatcher,
        match => `<a target="_blank" href="${match}">${match}</a>`
      );
      const postData = {
        type: post.groupId ? 'protected' : post.type,
        caption,
        group_id: parseInt(post.groupId)
      };

      addPost({
        variables: {
          data: postData
        }
      }).then(({ data }) => {
        if (data) {
          openNotification('success', 'Post added successfully');
          setPost({
            caption: '',
            type: 'protected',
            captionDisabled: false
          })
          refreshPost(data.createPost.id)
        } else {
          openNotification('error', 'Error while adding post');
        }
      }).catch((error) => {
        console.log(error)
        setPost({ ...post, captionDisabled: false });
        openNotification('error', 'Error while adding post');
      });
    }
  }

  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setShowPicker(false)
    setPost({
      ...post,
      caption: post.caption + emojiObject.emoji
    });
  };

  const onFeelings = () => {
    setShowPicker(true)
  };

  const getPostTypeOptions = () => {
    const groups = getGroups();
    const options = [];

    options.push({
      id: "public",
      value: "public",
    });
    options.push({
      id: "private",
      value: "private",
    });
    groups.forEach(group => {
      options.push({
        id: group.id,
        value: group.name
      })
    });

    return options.map(option => <option id={option.id} key={option.id}>{option.value}</option>);
  }

  return (
    <div className="tw-rounded-lg tw-bg-white tw-flex tw-flex-col tw-p-3 tw-px-4 tw-shadow tw-relative">
      <div className="tw-flex tw-items-center tw-space-x-2 tw-border-b tw-border-gray-300 tw-pb-3 tw-mb-2">
        <div className="tw-w-10 tw-h-10">
          <Avatar
            className="tw-w-full tw-h-full tw-rounded-full"
            src={getProfileImage() || userLogo}
            size={40}
          />
        </div>
        <div
          ref={postDivRef}
          className="tw-bg-gray-100 tw-flex tw-h-8 tw-items-center tw-justify-between tw-overflow-hidden tw-px-4 tw-rounded-2xl tw-text-sm tw-w-11.5/12">
          <textarea
            ref={postRef}
            style={{ resize: "none", border: "none", paddingTop: "5px" }}
            className="tw-bg-gray-100 tw-h-full tw-outline-none tw-w-full" maxLength={250}
            placeholder="What&apos;s on your mind?"
            disabled={post.captionDisabled}
            value={post.caption}
            onChange={e => setPost({ ...post, caption: e.target.value })}
            onKeyPress={onSubmit}
            name="comment"
            autoComplete="off"/>
        </div>
      </div>
      <div className="tw-flex tw-space-x-3 tw-font-thin tw-text-sm tw-text-gray-600 tw--mb-1">
        <select
          onChange={e => {
            const options = e.target.options;
            const id = options[ options.selectedIndex ].id;
            const index = e.target.selectedIndex;
            const type = e.target.value;
            const groupId = index > 1 ? id : undefined;
            const updatedPost = { ...post, type, groupId };
            setPost(updatedPost);
          }}
          value={post.type}
          className="tw-flex-1 tw-flex tw-items-center tw-h-8 tw-cursor-pointer focus:tw-outline-none focus:tw-bg-gray-200 hover:tw-bg-gray-100 tw-rounded-md">
          {getPostTypeOptions()}
        </select>

        <button
          onClick={onFeelings}
          className="tw-flex-1 tw-flex tw-items-center tw-h-8 focus:tw-outline-none focus:tw-bg-gray-200 tw-justify-center tw-space-x-2 hover:tw-bg-gray-100 tw-rounded-md">
          <div>
            <FaSmile className="tw-text-yellow-500"/>
          </div>
          <div>
            <p className="tw-font-semibold">Feeling/Activity</p>
          </div>
        </button>
      </div>
      {showPicker ?
        <div className="tw-absolute tw-right-0 tw-top-1/2 tw-z-10"><Picker onEmojiClick={onEmojiClick}/>
        </div> : null}
    </div>
  );
};

export default CreatePostBox;
