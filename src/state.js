const state = {
  state: 'init',
  form: {
    url: '',
  },
  feeds: {},
  posts: {},
  data: [],
};

export const getPost = (feedUrl, postUrl) => {
  const feed = state.data.find((f) => f.url === feedUrl);
  if (feed) {
    const post = feed.posts.find((p) => p.link === postUrl);
    return post;
  }
  return undefined;
};

export default state;
