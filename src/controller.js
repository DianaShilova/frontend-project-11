import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import { XMLParser } from 'fast-xml-parser';
import state, { getPost } from './state';
import renderResult, { rendorFeeds, rendorPosts, handleShowModal } from './view';

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
    // validatorOutput.classList.remove('is-hidden');
    // validatorOutput.classList.remove('text-muted');
    // validatorOutput.textContent = (i18next.t('not-rss'));
    // validatorOutput.classList.toggle('text-danger', true);
    // validatorOutput.classList.toggle('text-success', false);
    // throw new Error(i18next.t('not-rss'));
    throw new Error('Parsing error');
  }
};
const fetchData = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then((response) => response.data.contents)
  .then((data) => parse(data));

const watchState = onChange(state, (path, value) => {
  if (path === 'form.url' && value !== '') {
    schema.validate(watchState.form)
      .then(() => {
        if (!watchState.feeds[value]) {
          watchState.feeds[value] = true;
          watchState.form.url = '';
          return fetchData(value);
        }
        renderResult(new Error(i18next.t('already-exist')));
        throw new Error(i18next.t('already-exist'));
      })
      .then((data) => {
        data.rssPosts.forEach((post) => {
          watchState.posts[post.link] = post;
        });
        watchState.data.push({
          title: data.rssFeeds.title,
          description: data.rssFeeds.description,
          url: value,
          posts: data.rssPosts,
        });

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
  } else if (path.startsWith('feeds')) {
    renderResult(null, i18next.t('loading-url'));
  } else if (path.startsWith('data')) {
    renderResult(null, i18next.t('success-url'));
    rendorFeeds(watchState.data);
    rendorPosts(watchState.data);
  }
});

const onSubmit = (event) => {
  event.preventDefault();
  watchState.form.url = input.value;
};

form.addEventListener('submit', onSubmit);

exampleModal.addEventListener('shown.bs.modal', handleShowModal);
