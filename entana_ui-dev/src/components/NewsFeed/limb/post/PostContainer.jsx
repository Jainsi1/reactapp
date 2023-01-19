import React, { useState } from 'react';
import Post from '../post';

import { GET_POSTS } from '../../graphql/Query';
import { useQuery } from '@apollo/client'
import InfiniteScroll from "react-infinite-scroll-component";

const PostContainer = ({ userId, organizationId }) => {

  const { loading, error, data, fetchMore } = useQuery(GET_POSTS, {
    variables: {
      data: {
        user_id: userId,
        organization_id: organizationId
      }
    }
  });

  const [hasMore, setHasMore] = useState(true);
  const [hasListenerAdded, setHasListenerAdded] = useState(false);

  const refreshPost = async (postId) => {
    if ( !postId) return;
    await fetchMore({
      variables: {
        data: {
          offset: 0,
          post_id: postId
        }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        const posts = [...prev.getPosts];

        if (fetchMoreResult.getPosts.length && fetchMoreResult.getPosts[ 0 ].id) {
          const index = posts.findIndex((e) => e.id == fetchMoreResult.getPosts[ 0 ].id)
          if (index > -1) {
            posts[ index ] = fetchMoreResult.getPosts[ 0 ]
          } else {
            posts.unshift(fetchMoreResult.getPosts[ 0 ])
          }
        } else {
          const index = posts.findIndex((e) => e.id == postId)
          if (index > -1) {
            posts.splice(index, 1)
          }
        }
        return Object.assign({}, prev, {
          getPosts: [...posts]
        });
      }
    })
  }

  const addListener = () => {
    if (hasListenerAdded) return;
    setHasListenerAdded(true)
    window.addEventListener('refreshPost', ({ detail }) => {
      refreshPost(detail).then(() => {
      })
    });
  }

  addListener();

  if (loading) return <p className="tw-text-center">Loading Posts...</p>;
  if (error) return <p>Error :(</p>;

  const getData = async () => {
    await fetchMore({
      variables: {
        data: {
          user_id: userId,
          organization_id: organizationId,
          offset: data.getPosts.length
        }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if ( !fetchMoreResult.getPosts.length) {
          setHasMore(false)
          return prev
        }
        return Object.assign({}, prev, {
          getPosts: [...prev.getPosts, ...fetchMoreResult.getPosts]
        });
      }
    });
  }

  const refresh = () => {
    //TODO
  }

  // @ts-ignore
  return (
    <div className="tw-mt-4 tw-w-full tw-h-full">
      <div
        className="tw-grid tw-grid-cols-1 tw-gap-2"
      >
        <InfiniteScroll
          dataLength={data.getPosts.length}
          next={getData}
          hasMore={hasMore}
          loader={<p className="tw-text-center">Loading More Posts...</p>}
          endMessage={
            <p className="tw-text-center">No More Posts</p>
          }
          refreshFunction={refresh}
          pullDownToRefresh
          scrollThreshold="100px"
          pullDownToRefreshThreshold={50}
          pullDownToRefreshContent={
            <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
          }
          releaseToRefreshContent={
            <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
          }
        >
          {data.getPosts.length ? (
            data.getPosts.map((post, idx) => <Post key={idx} post={post}/>)
          ) : (
            <p>No posts yet!</p>
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default PostContainer;
