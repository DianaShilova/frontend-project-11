import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import CustomError from './error';
import parse from './rss';
import renderResult, {
  renderFeeds,
  renderPosts,
  handleShowModal,
  clearInput,
} from './view';

const exampleModal = document.querySelector('#modal');
const form = document.querySelector('.rss-form');
const input = document.querySelector('#url-input');

const app = () => {
  const state = {
    state: 'init',
    feeds: {},
    posts: {},
    data: [],
  };

  const getPost = (feedUrl, postUrl) => {
    const feed = state.data.find((f) => f.url === feedUrl);
    if (feed) {
      const post = feed.posts.find((p) => p.link === postUrl);
      return post;
    }
    return undefined;
  };

  const schema = yup.object().shape({
    url: yup.string().url(i18next.t('error-url')).required(i18next.t('required')),
  });

  const fetchData = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((response) => response.data.contents)
    .then((data) => parse(data))
    .catch((error) => {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new Error(i18next.t('network-error'));
    });

  const watchState = onChange(state, (path) => {
    if (path === 'form.error') {
      renderResult(watchState.form.error);
    } else if (path.startsWith('data')) {
      renderFeeds(watchState.data);
      renderPosts(watchState.data);
    }
  });

  const onSubmit = (event) => {
    event.preventDefault();
    const url = input.value;
    schema.validate({ url })
      .then(() => {
        if (!watchState.feeds[url]) {
          renderResult(null, i18next.t('loading-url'));
          return fetchData(url);
        }
        renderResult(new Error(i18next.t('already-exist')));
        throw new Error(i18next.t('already-exist'));
      })
      .then((data) => {
        watchState.feeds[url] = true;
        data.rssPosts.forEach((post) => {
          watchState.posts[post.link] = post;
        });
        watchState.data.push({
          title: data.rssFeeds.title,
          description: data.rssFeeds.description,
          url,
          posts: data.rssPosts,
        });
        renderResult(null, i18next.t('success-url'));
        const autoupdate = (rssUrl) => {
          fetchData(rssUrl)
            .then((data2) => {
              data2.rssPosts.forEach((post) => {
                if (!getPost(rssUrl, post.link)) {
                  const feed = watchState.data.find((f) => f.url === rssUrl);
                  if (feed) {
                    feed.posts.push(post);
                  }
                }
              });
            });
          setTimeout(() => autoupdate(url), 5000);
        };
        autoupdate(url);
      })
      .catch((error) => {
        renderResult(error);
        watchState.state = 'invalid';
        watchState.form.error = error;
      });
    clearInput();
  };

  form.addEventListener('submit', onSubmit);

  exampleModal.addEventListener('shown.bs.modal', (e) => {
    const target = e.relatedTarget;
    const postUrl = target.getAttribute('data-post-url');
    const feedUrl = target.getAttribute('data-feed-url');
    const post = getPost(feedUrl, postUrl);
    handleShowModal(e, post);
  });
};

export default app;
