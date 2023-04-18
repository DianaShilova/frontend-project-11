import {validate} from './validation.js'
import { autoupdate, getPost } from './autoupdate.js';




const form = document.querySelector('.rss-form');
const input = document.querySelector('#url-input');
const exampleModal = document.querySelector('#modal');

const onSubmit = (event) => {
    event.preventDefault();
    const data = {
        url: input.value,
    }
    validate(data)
    .then(() => autoupdate(data.url))
}



form.addEventListener('submit', onSubmit)

exampleModal.addEventListener('shown.bs.modal', function (e) {
    const target = e.relatedTarget ;
    const postUrl = target.getAttribute('data-post-url');
    const feedUrl = target.getAttribute('data-feed-url');
    const post = getPost(feedUrl, postUrl);
    
    const modalTitle = exampleModal.querySelector('.modal-title');
    const modalBody = exampleModal.querySelector('.modal-body');
    const buttonPost = exampleModal.querySelector('.full-article');
    const postTitle = target.parentElement.querySelector('a');

    modalTitle.textContent = post.title;
    modalBody.textContent = post.description;
    buttonPost.setAttribute('href', postUrl);
    postTitle.classList.remove('fw-bold');
    postTitle.classList.add('fw-normal');
  })

  