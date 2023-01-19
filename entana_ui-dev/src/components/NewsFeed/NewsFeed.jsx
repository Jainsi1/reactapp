import React from 'react';
import CreatePostBox from './limb/post/CreatePostBox';
import PostContainer from './limb/post/PostContainer';
import './tailwind.css';
import './news-feed.css'

const NewsFeed = (
  {
    hideCreatePost = false,
    userId = 0,
    organizationId = 0
  }
) => {
  return (
    <div className="tw-w-full tw-pb-5 tw-all">

      {!hideCreatePost ?
        <CreatePostBox/>
        : null}

      <PostContainer
        userId={userId}
        organizationId={organizationId}
      />

    </div>
  );
};

export default NewsFeed;
