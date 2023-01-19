const refreshPost = (postId) => {
  let event = new CustomEvent('refreshPost', {
    detail: postId
  });
  window.dispatchEvent(event);
}

module.exports = refreshPost;