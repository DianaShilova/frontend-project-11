import axios from 'axios';
import i18next from 'i18next';
import { render } from './feeds';
import parse from './parser';

const validatorOutput = document.querySelector('.feedback');

const rss = {};

const fetchData = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then((response) => response.data.contents)
  .then((data) => parse(data));

const fetch = (url) => {
  fetchData(url)
    .then((data) => {
      let rssPosts = {};
      if (!rss[url] || !rss[url].rssPosts) {
        rssPosts = new Map();
      } else {
        rssPosts = rss[url].rssPosts;
      }
      data.rssPosts.forEach((post) => {
        if (!rssPosts.has(post.link)) {
          rssPosts.set(post.link, post);
        }
      });
      rss[url] = {
        rssPosts,
        rssFeeds: data.rssFeeds,
      };
    })
    .then(() => render(rss));
};

export const autoupdate = (url) => {
  fetch(url);
  // setTimeout(() => autoupdate(url), 5000);
};

export const addUrl = (url) => {
  validatorOutput.classList.remove('is-hidden');
  validatorOutput.classList.remove('text-muted');
  if (rss[url]) {
    validatorOutput.classList.toggle('text-danger', true);
    validatorOutput.classList.toggle('text-success', false);
    validatorOutput.textContent = (i18next.t('already-exist'));
  } else {
    validatorOutput.classList.toggle('text-danger', false);
    validatorOutput.classList.toggle('text-success', true);
    validatorOutput.textContent = (i18next.t('success-url'));
    autoupdate(url);
  }
};

export const getPost = (feedUrl, postUrl) => {
  const post = rss[feedUrl].rssPosts.get(postUrl);
  return post;
};
