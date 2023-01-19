import React, { useState } from 'react';
import moment from 'moment';
import { useMutation } from "@apollo/client";
import { DELETE_POST, LIKE_POST, UNLIKE_POST, UPDATE_POST } from "../../graphql/Mutation";
import Comment from '../comment';
import CreateCommentBox from "../comment/CreateCommentBox";
import parse from 'html-react-parser'
import LinkPreview from './LinkPreview';
import { FaThumbsUp, FaComment, FaShare, FaGlobeAmericas, FaUnlock, FaLock } from "react-icons/fa";
import openNotification from "utils/Notification";
import { getProfileImage, getUserId } from "utils/user";
import { Avatar } from "antd";
import userLogo from "../../../../assets/images/user-logo.svg";
import { Link } from "react-router-dom";
import { getGroups } from 'utils/user';
import NewFeedAvatar from 'components/NewsFeed/component/NewFeedAvatar';

const refreshPost = require('utils/refreshPost');

const groups = {};

getGroups()?.forEach(group => {
  groups[parseInt(group.id)] = group.name; 
})

const Post = (props) => {
  const { post } = props;
  const { user } = post;

  const avatarHoverText = (
    <div>
        <p>{user.username}</p>
        <p>{user.organizationName}</p>
        <p>{user.designation}</p>
    </div>
  )

  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const [displayComments, setDisplayComments] = useState(false);
  const [isEditPost, setIsEditPost] = useState(false);

  const toggleDropdown = () => {
    setDropdownPopoverShow( !dropdownPopoverShow);
  }

  const [updatedPost, setUpdatedPost] = useState({
    caption: '',
    type: '',
    captionDisabled: false
  })

  const onEditPost = () => {
    setIsEditPost(true)
    toggleDropdown();
    let postType = post.type;
    if(post.group_id) {
      getGroups().forEach(group => {
        if (parseInt(group.id) === post.group_id) {
          postType = group.name;
        }
      })
    }
    setUpdatedPost({
      caption: post.caption,
      type: postType,
      groupId: post.group_id
    });
  }

  const [updatePost] = useMutation(UPDATE_POST)
  const [deletePost] = useMutation(DELETE_POST)

  const onSubmit = (e) => {
    if (e.code === "Enter" && updatedPost.caption.trim().length) {
      setUpdatedPost({ ...updatedPost, captionDisabled: true })

      const postData = {
        type: updatedPost.groupId ? 'protected' : updatedPost.type,
        caption: updatedPost.caption,
        group_id: parseInt(updatedPost.groupId)
      };

      updatePost({
        variables: {
          data: postData,
          where: { id: post.id }
        },
      }).then(({ data }) => {
        if (data) {
          openNotification('success', 'Post updated successfully');
          setUpdatedPost({
            caption: '',
            type: '',
            captionDisabled: false
          })
          setIsEditPost(false)
          refreshPost(post.id)
        } else {
          openNotification('error', 'Error while updating post');
        }
      }).catch((error) => {
        console.log(error)
        setUpdatedPost({ ...updatedPost, captionDisabled: false })
        openNotification('error', 'Error while updating post');
      });
    }
  }

  const onDeletePost = async () => {
    toggleDropdown();

    deletePost({
      variables: {
        where: { id: post.id }
      },
    }).then(({ data }) => {
      if (data) {
        openNotification('success', 'Post deleted successfully');
        refreshPost(post.id)
      } else {
        openNotification('error', 'Error while deleting post');
      }
    }).catch((error) => {
      console.log(error)
      openNotification('error', 'Error while deleting post');
    });
  }

  const [likePost] = useMutation(LIKE_POST)
  const [unlikePost] = useMutation(UNLIKE_POST)

  const submitLike = () => {
    likePost({
      variables: {
        where: { id: post.id }
      }
    }).then(() => {
      refreshPost(post.id)
    }).catch((error) => {
      console.log(error)
      openNotification('error', 'Error while liking post');
    });
  }

  const submitUnlike = () => {
    unlikePost({
      variables: {
        where: { id: post.id }
      }
    }).then(() => {
      refreshPost(post.id)
    }).catch((error) => {
      console.log(error)
      openNotification('error', 'Error while unliking post');
    });
  }

  const captionHasUrl = () => {
    const URLMatcher = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\\/%=~_|$])/gim;
    const urls = post.caption.match(URLMatcher);
    return urls?.length ? urls[ 0 ] : ""
  }

  const postIcons = {
    public: <FaGlobeAmericas/>,
    protected: <FaUnlock/>,
    private: <FaLock/>
  }

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
    <div className="tw-w-full tw-shadow tw-h-auto tw-bg-white tw-rounded-md tw-my-2">
      <div className="tw-flex tw-items-center tw-space-x-2 tw-p-2.5 tw-px-4">
        <div className="tw-w-10 tw-h-10">
          <Link to={"/user-profile/" + user.id}>
            <NewFeedAvatar
              src={user.image}
              size={40}
              hoverText={avatarHoverText}
            />
          </Link>
        </div>
        <div className="tw-flex-grow tw-flex tw-flex-col">
          <p className="tw-font-semibold tw-text-sm tw-text-gray-900">
            <Link className='text-hover' to={"/user-profile/" + user.id}>{user.username}</Link>
            {user.organizationId ?
              <Link className='text-hover' to={"/org-profile/" + user.organizationId}> ({user.organizationName})</Link>
              : null
            }
          </p>
          <div>
            <span className="tw-text-xs tw-font-bold tw-text-gray-500">
              {moment(post.created_at).fromNow()}
            </span>
            <span className="tw-pl-2 tw-text-xs tw-cursor-pointer" title={post.type}>
              {post.group_id ? groups[post.group_id] : postIcons[ post.type ]}
            </span>
          </div>
        </div>

        {getUserId() == post.user.id ?
          <div>
            <div className="tw-relative tw-inline-block tw-text-left">
              <div>
                <button type="button"
                        onClick={toggleDropdown}
                        className="focus:tw-outline-none tw-inline-flex tw-w-full tw-justify-center tw-text-sm tw-font-medium tw-text-gray-700 tw-shadow-sm"
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
              </div>

              <div
                className={(dropdownPopoverShow ? "tw-block " : "tw-hidden ") + "tw-absolute tw-right-0 tw-z-10 tw-mt-2 tw-w-56 tw-origin-top-right tw-rounded-md tw-bg-white tw-shadow-lg tw-ring-1 tw-ring-black tw-ring-opacity-5 focus:tw-outline-none"}
                role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                <div className="tw-py-1">
                  <a onClick={onEditPost}
                     className="tw-cursor-pointer hover:tw-bg-gray-100 tw-text-gray-700 tw-block tw-px-4 tw-py-2 tw-text-sm">
                    Edit
                  </a>
                  <a onClick={onDeletePost}
                     className="tw-cursor-pointer hover:tw-bg-gray-100 tw-text-gray-700 tw-block tw-px-4 tw-py-2 tw-text-sm">
                    Delete
                  </a>
                </div>
              </div>
            </div>

          </div>
          : null
        }
      </div>

      {isEditPost ?
        <div className="tw-flex">
          <div
            className="tw-bg-gray-100 tw-flex tw-h-8 tw-items-center tw-justify-between tw-mx-4 tw-overflow-hidden tw-px-4 tw-rounded-2xl tw-text-sm tw-w-11.5/12">
            <input
              type="text"
              className="tw-bg-gray-100 tw-h-full tw-outline-none tw-w-full" maxLength={250}
              disabled={updatedPost.captionDisabled}
              placeholder="What&apos;s on your mind"
              value={updatedPost.caption}
              onChange={e => setUpdatedPost({ ...updatedPost, caption: e.target.value })}
              onKeyPress={onSubmit}
              name="comment"/>
          </div>

          <select
            onChange={e => {
              const options = e.target.options;
              const id = options[ options.selectedIndex ].id;
              const index = e.target.selectedIndex;
              const type = e.target.value;
              const groupId = index > 1 ? id : undefined;
              const postObj = { ...updatedPost, type, groupId };
              setUpdatedPost(postObj);
            }}
            disabled={updatedPost.captionDisabled}
            value={updatedPost.type}
            className="tw-mr-4 tw-h-8 tw-cursor-pointer focus:tw-outline-none focus:tw-bg-gray-200 hover:tw-bg-gray-100 tw-rounded-md">
            {getPostTypeOptions()}
          </select>
        </div>

        : <div>
          {post.caption ? (
            <div>
              <div className="tw-mb-1">
                <p className="tw-text-gray-700 tw-px-3 tw-text-sm">
                  {parse(post.caption)}
                </p>
              </div>

              {captionHasUrl() ?
                <LinkPreview link={captionHasUrl()}/>
                : null}

            </div>
          ) : null}
          {post.image_url ? (
            <div className="tw-w-full tw-h-76 tw-max-h-80">
              <img
                src={post.image_url}
                alt="postimage"
                className="tw-w-full tw-h-76 tw-max-h-80"
              />
            </div>
          ) : null}
        </div>
      }

      <div className="tw-w-full tw-flex tw-flex-col tw-space-y-2 tw-p-2 tw-px-4">
        <div
          className="tw-flex tw-items-center tw-justify-between tw-pb-2 tw-border-b tw-border-gray-300 tw-text-gray-500 tw-text-sm">
          <div className="tw-flex tw-items-center">
            <button className="tw-flex tw-items-center">
              <button
                className="focus:tw-outline-none tw-flex tw-items-center tw-justify-center tw-w-4 tw-h-4 tw-rounded-full tw-bg-primary tw-text-white">
                <FaThumbsUp className="tw-text-xxs"/>
              </button>
              <div className="tw-ml-1">
                <p>{post.likes}</p>
              </div>
            </button>
          </div>
          <div className="tw-flex tw-items-center tw-space-x-2">
            <button onClick={() => {
              setDisplayComments( !displayComments)
            }}>{post.comments_count} Comment
            </button>
            <button className="tw-hidden">{post.shares_count} Shares</button>
          </div>
        </div>
        <div
          className="tw-border-b tw-border-gray-300 tw-flex tw-font-thin tw-pb-2 tw-space-x-3 tw-text-gray-500 tw-text-sm">
          {post.is_liked ? <button
              onClick={submitUnlike}
              className="tw-flex-1 tw-flex tw-items-center tw-h-8 tw-justify-center tw-space-x-2 hover:tw-bg-gray-100 tw-rounded-md">
              <div>
                <FaThumbsUp className="tw-font-thin"/>
              </div>
              <div>
                <p className="tw-italic">Unlike</p>
              </div>
            </button> :
            <button
              onClick={submitLike}
              className="tw-flex-1 tw-flex tw-items-center tw-h-8 focus:tw-outline-none focus:tw-bg-gray-200 tw-justify-center tw-space-x-2 hover:tw-bg-gray-100 tw-rounded-md">
              <div>
                <FaThumbsUp className="tw-font-thin"/>
              </div>
              <div>
                <p className="tw-italic">Like</p>
              </div>
            </button>
          }
          <button
            className="tw-flex-1 tw-flex tw-items-center tw-h-8 focus:tw-outline-none focus:tw-bg-gray-200 tw-justify-center tw-space-x-2 hover:tw-bg-gray-100 tw-rounded-md">
            <div>
              <FaComment className="tw-font-thin"/>
            </div>
            <div>
              <p className="tw-italic">Comment</p>
            </div>
          </button>
          <button
            className="tw-hidden tw-flex-1 tw-flex tw-items-center tw-h-8 focus:tw-outline-none focus:tw-bg-gray-200 tw-justify-center tw-space-x-2 hover:tw-bg-gray-100 tw-rounded-md">
            <div>
              <FaShare className="tw-font-thin"/>
            </div>
            <div>
              <p className="tw-italic">Share</p>
            </div>
          </button>
        </div>
      </div>

      {displayComments && post.comments.length ? post.comments.map((comment, idx) =>
        <Comment key={idx} comment={comment} post_id={post.id}/>
      ) : null}

      <CreateCommentBox post_id={post.id}/>

    </div>
  );
};

export default Post;
