import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import CustomError from './error';
import parse from './rss';
import { createWatchState } from './view';
import getPost from './getPost';

const app = () => {
  i18next.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: {
        translation: {
          'feeds-label': 'Фиды',
          'posts-label': 'Посты',
          'preview-label': 'Просмотр',
          'error-url': 'Ссылка должна быть валидным URL',
          'success-url': 'RSS успешно загружен',
          // 'required': 'Ссылка не должна быть пустой',
          'already-exist': 'RSS уже существует',
          'not-rss': 'Ресурс не содержит валидный RSS',
          'loading-url': 'RSS загружается',
          'parsing-error': 'Ресурс не содержит валидный RSS',
          'network-error': 'Ошибка сети',
        },
      },
    },
  });

  const state = {
    addingFeddProcess: 'init', // invalid, loading, success
    feeds: {},
    feedsData: [],
    postsData: [],
    modal: {},
    input: '',
    error: null,
    ui: {
      readPosts: {},
    },
  };

  const schema = yup.object().shape({
    url: yup.string().url(i18next.t('error-url')).required(),
  });

  const watchState = createWatchState(state);

  const getProxyUrl = (url) => {
    const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app');
    proxyUrl.searchParams.set('disableCache', 'true');
    proxyUrl.searchParams.set('url', url);
    return proxyUrl.toString();
  };

  const fetchData = (url) => axios.get(url)
    .then((response) => parse(response.data.contents));

  const validateUrl = (url) => schema.validate({ url })
    .then(() => {
      if (!watchState.feeds[url]) {
        return fetchData(getProxyUrl(url));
      }
      throw new Error('already-exist');
    });

  const addFeed = (url) => {
    validateUrl(url)
      .then((data) => {
        watchState.feeds[url] = true;
        watchState.feedsData.push({
          title: data.rssFeeds.title,
          description: data.rssFeeds.description,
          url,
        });
        watchState.postsData.concat([data.rssPosts]);
        watchState.addingFeddProcess = 'success';
        watchState.input = '';
      })
      .catch((error) => {
        watchState.error = error;
        watchState.addingFeddProcess = 'invalid';
      })
      .finally(() => {
        watchState.addingFeddProcess = 'init';
      });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');
    watchState.addingFeddProcess = 'loading';
    addFeed(url);
  };

  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', onSubmit);

  const input = document.querySelector('#url-input');
  input.addEventListener('change', (e) => {
    watchState.input = e.target.value;
  });

  const autoupdate = () => {
    const feeds = Object.keys(watchState.feeds);
    feeds.forEach((feedUrl) => {
      fetchData(getProxyUrl(feedUrl))
        .then((data2) => {
          const newPosts = [];
          data2.rssPosts.forEach((post) => {
            if (!getPost(state, post.link)) {
              newPosts.unshift(post);
            }
          });
          watchState.postsData = [...watchState.postsData, ...newPosts];
        });
    });
    setTimeout(autoupdate, 5000);
  };
  autoupdate();

  const exampleModal = document.querySelector('#modal');
  exampleModal.addEventListener('shown.bs.modal', (e) => {
    const target = e.relatedTarget;
    watchState.modal = {
      postUrl: target.getAttribute('data-post-url'),
      feedUrl: target.getAttribute('data-feed-url'),
      target,
    };
    watchState.ui.readPosts[target.getAttribute('data-post-url')] = true;
  });
};

export default app;
