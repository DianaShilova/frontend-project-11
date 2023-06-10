import onChange from 'on-change';
import getPost from './getPost';

const rssInput = document.querySelector('.form-control');
const validatorOutput = document.querySelector('.feedback');
const rssFeedsElement = document.querySelector('.feeds');
const rssPostsElement = document.querySelector('.posts');
const exampleModal = document.querySelector('#modal');

const renderResult = (error, message) => {
  const isError = !!error;
  rssInput.classList.toggle('is-invalid', isError);
  rssInput.classList.toggle('is-valid', !isError);
  validatorOutput.classList.remove('is-hidden');
  validatorOutput.classList.toggle('text-danger', isError);
  validatorOutput.classList.toggle('text-success', !isError);
  if (isError) {
    validatorOutput.textContent = error.message;
  } else {
    validatorOutput.textContent = message;
  }
};

export const renderFeeds = (data) => {
  rssFeedsElement.innerHTML = '';
  const h2 = document.createElement('h2');
  h2.textContent = 'Фиды';
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  card.append(cardBody);
  cardBody.append(h2);

  Object.values(data).forEach((rssData) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    ul.append(li);
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = rssData.title;

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = rssData.description;

    li.append(h3);
    li.append(p);
    card.append(ul);
    rssFeedsElement.append(card);
  });
};

export const renderPosts = (data) => {
  rssPostsElement.innerHTML = '';
  let i = 0;
  const h2 = document.createElement('h2');
  h2.textContent = 'Посты';
  h2.classList.add('card-title', 'h4');
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  card.append(cardBody);
  cardBody.append(h2);
  data.forEach((feed) => {
    feed.posts.forEach((post) => {
      i += 1;
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      ul.append(li);
      const a = document.createElement('a');
      a.setAttribute('href', post.link);
      a.textContent = post.title;
      a.dataset.id = i;
      if (post.read !== true) {
        a.classList.add('fw-bold');
      }
      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.textContent = 'Просмотр';
      button.dataset.id = i;
      button.dataset.bsToggle = 'modal';
      button.dataset.bsTarget = '#modal';
      button.dataset.feedUrl = feed.url;
      button.dataset.postUrl = post.link;

      li.append(a);
      li.append(button);
    });
  });

  rssPostsElement.append(card);
  card.append(ul);
};

export const handleShowModal = (target, post) => {
  post.read = true;

  const modalTitle = exampleModal.querySelector('.modal-title');
  const modalBody = exampleModal.querySelector('.modal-body');
  const buttonPost = exampleModal.querySelector('.full-article');
  const postTitle = target.parentElement.querySelector('a');

  modalTitle.textContent = post.title;
  modalBody.textContent = post.description;
  buttonPost.setAttribute('href', post.link);
  postTitle.classList.remove('fw-bold');
  postTitle.classList.add('fw-normal');
};

export const createWatchState = (state) => {
  const watchState = onChange(state, (path) => {
    if (path === 'input') {
      rssInput.value = state.input;
    } else if (path === 'form.error') {
      renderResult(watchState.form.error);
    } else if (path.startsWith('data')) {
      renderFeeds(watchState.data);
      renderPosts(watchState.data);
    } else if (path === 'modal') {
      const post = getPost(state, state.modal.feedUrl, state.modal.postUrl);
      handleShowModal(state.modal.target, post);
    }
  });
  return watchState;
};

export const clearInput = () => {
  rssInput.value = '';
};

export default renderResult;
