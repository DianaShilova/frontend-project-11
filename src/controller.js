import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import { XMLParser } from 'fast-xml-parser';
import state, { getPost } from './state';
import CustomError from './error';
import renderResult, {
  renderFeeds,
  renderPosts,
  handleShowModal,
  clearInput,
} from './view';

const exampleModal = document.querySelector('#modal');
const form = document.querySelector('.rss-form');
const input = document.querySelector('#url-input');

const schema = yup.object().shape({
  url: yup.string().url(i18next.t('error-url')).required(i18next.t('required')),
});

const parse = (data) => {
  try {
    const parser = new XMLParser();
    const xml = parser.parse(data);
    const { title, description, link } = xml.rss.channel;
    const rssFeeds = { title, description, link };
    const rssPosts = xml.rss.channel.item;
    return { rssFeeds, rssPosts };
  } catch (error) {
    throw new CustomError(i18next.t('parsing-error'));
  }
};
const fetchData = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then((response) => response.data.contents)
  .then((data) => parse(data))
  .catch((error) => {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new Error(i18next.t('network-error'));
  });

const watchState = onChange(state, (path, value) => {
  if (path === 'form.url' && value !== '') {
    schema.validate(watchState.form)
      .then(() => {
        if (!watchState.feeds[value]) {
          watchState.form.url = '';
          renderResult(null, i18next.t('loading-url'));
          return fetchData(value);
        }
        renderResult(new Error(i18next.t('already-exist')));
        throw new Error(i18next.t('already-exist'));
      })
      .then((data) => {
        watchState.feeds[value] = true;
        data.rssPosts.forEach((post) => {
          watchState.posts[post.link] = post;
        });
        watchState.data.push({
          title: data.rssFeeds.title,
          description: data.rssFeeds.description,
          url: value,
          posts: data.rssPosts,
        });
        renderResult(null, i18next.t('success-url'));
        const autoupdate = (url) => {
          fetchData(url)
            .then((data2) => {
              data2.rssPosts.forEach((post) => {
                if (!getPost(url, post.link)) {
                  const feed = watchState.data.find((f) => f.url === url);
                  if (feed) {
                    feed.posts.push(post);
                  }
                }
              });
            });
          setTimeout(() => autoupdate(value), 5000);
        };
        autoupdate(value);
      })
      .catch((error) => {
        renderResult(error);
        watchState.state = 'invalid';
        watchState.form.error = error;
      });
  } else if (path === 'form.error') {
    renderResult(watchState.form.error);
  } else if (path.startsWith('data')) {
    renderFeeds(watchState.data);
    renderPosts(watchState.data);
  }
});

const onSubmit = (event) => {
  event.preventDefault();
  watchState.form.url = input.value;
  clearInput();
};

form.addEventListener('submit', onSubmit);

exampleModal.addEventListener('shown.bs.modal', handleShowModal);
