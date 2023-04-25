const rssPostsElement = document.querySelector('.posts');
const rssFeedsElement = document.querySelector('.feeds');

export const feeds = (rss) => {
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

  Object.values(rss).forEach((rssData) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    ul.append(li);
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = rssData.rssFeeds.title;

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = rssData.rssFeeds.description;

    li.append(h3);
    li.append(p);
    card.append(ul);
    rssFeedsElement.append(card);
  });
};

export const posts = (rss) => {
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

  Object.entries(rss).forEach(([url, rssData]) => {
    rssData.rssPosts.forEach((post) => {
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
      button.dataset.feedUrl = url;
      button.dataset.postUrl = post.link;

      li.append(a);
      li.append(button);
    });
  });

  rssPostsElement.append(card);
  card.append(ul);
};

export const render = (rss) => {
  feeds(rss);
  posts(rss);
};
