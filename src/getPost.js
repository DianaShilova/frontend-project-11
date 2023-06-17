const getPost = (state, postUrl) => state.postsData.find((p) => p.link === postUrl);

export default getPost;
