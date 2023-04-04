const rssPostsElement = document.querySelector('#rss-posts');
const rssFeedsElement = document.querySelector('#rss-feeds');

export const render = (rssData) => {
    feeds(rssData);
    posts(rssData);
}

export const feeds = (rssData) => {
    const { rssFeeds } = rssData;

    const h2 = document.createElement('h2');
    h2.textContent = 'Фиды';

    const h3 = document.createElement('h3');
    h3.textContent = rssFeeds.title;

    const p = document.createElement('p');
    p.textContent = rssFeeds.description;

    rssFeedsElement.innerHTML = '';
    rssFeedsElement.append(h2)
    rssFeedsElement.append(h3);
    rssFeedsElement.append(p);
}

export const posts = (rssData) => {
    const { rssPosts } = rssData;

    rssPostsElement.innerHTML = '';
    const h2 = document.createElement('h2');
    h2.textContent = 'Посты';

    const ul = document.createElement('ul');
    rssPosts.forEach((post, id) => {
        const li = document.createElement('li');
        ul.append(li);
        
        const a = document.createElement('a');
        a.setAttribute('href', post.link)
        a.dataset.id = id;
        a.textContent = post.title;
        li.append(a);
    });
    rssPostsElement.append(ul);
}

