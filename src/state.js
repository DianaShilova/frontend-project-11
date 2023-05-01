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

// const y = [
//   ['url1', {}]
// ]
// feeds: {
//   url1: true,
// }
// const x = {
//   feedUrl1: {
//     title: 'feed1',
//     description: 'des1',
//     posts: {
//       postUrl1: {
//         title: 'title1',
//         description: 'des1',
//         url: 'url1',
//       },
//       postUrl2: {
//         title: 'title1',
//         description: 'des1',
//         url: 'url1',
//       },
//     },
//   },
// };
