import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import CustomError from './error';
import parse from './rss';
import renderResult, {
  createWatchState,
} from './view';
import getPost from './getPost';

const exampleModal = document.querySelector('#modal');
const form = document.querySelector('.rss-form');
const input = document.querySelector('#url-input');

const app = () => {
  const state = {
    state: 'init',
    feeds: {},
    posts: {},
    data: [],
    modal: {},
    input: '',
  };

  const schema = yup.object().shape({
    url: yup.string().url(i18next.t('error-url')).required(i18next.t('required')),
  });

  const watchState = createWatchState(state);

  const fetchData = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((response) => response.data.contents)
    .then((data) => parse(data))
    .catch((error) => {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new Error(i18next.t('network-error'));
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
      })
      .catch((error) => {
        renderResult(error);
        watchState.state = 'invalid';
        watchState.form.error = error;
      });
    watchState.input = '';
  };

  form.addEventListener('submit', onSubmit);

  input.addEventListener('change', (e) => {
    watchState.input = e.target.value;
  });

  const autoupdate = () => {
    Object.keys(state.feeds).forEach((feedUrl) => {
      fetchData(feedUrl)
        .then((data2) => {
          data2.rssPosts.forEach((post) => {
            if (!getPost(state, feedUrl, post.link)) {
              const feed = watchState.data.find((f) => f.url === feedUrl);
              if (feed) {
                feed.posts.push(post);
              }
            }
          });
        });
    });
    setTimeout(autoupdate, 5000);
  };
  autoupdate();

  exampleModal.addEventListener('shown.bs.modal', (e) => {
    const target = e.relatedTarget;
    watchState.modal = {
      postUrl: target.getAttribute('data-post-url'),
      feedUrl: target.getAttribute('data-feed-url'),
      target,
    };
  });
};

export default app;
