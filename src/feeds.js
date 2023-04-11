const rssPostsElement = document.querySelector('#rss-posts');
const rssFeedsElement = document.querySelector('#rss-feeds');


export const render = (rss) => {
    feeds(rss);
    posts(rss);
}

export const feeds = (rss) => {
    rssFeedsElement.innerHTML = '';
    
    const h2 = document.createElement('h2');
    h2.textContent = 'Фиды';
    const ul = document.createElement('ul');

    for (let url in rss) {
        const rssData = rss[url];
        const li = document.createElement('li');
        ul.append(li);
        const h3 = document.createElement('h3');
        h3.textContent = rssData.rssFeeds.title;

        const p = document.createElement('p');
        p.textContent = rssData.rssFeeds.description;
        
        
        li.append(h3);
        li.append(p);
        };
    rssFeedsElement.append(ul);
}


export const posts = (rss) => {
    rssPostsElement.innerHTML = '';

    const h2 = document.createElement('h2');
    h2.textContent = 'Посты';
    const ul = document.createElement('ul');

    for (let url in rss) {
        const rssData = rss[url];
            rssData.rssPosts.forEach(post => {
                const li = document.createElement('li');
                ul.append(li);
                const a = document.createElement('a');
                a.setAttribute('href', post.link)
                
                a.textContent = post.title;
                li.append(a);
            });
            
        };
    rssPostsElement.append(ul);
}
