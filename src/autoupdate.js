import axios from "axios";
import { render } from "./feeds";
import { parse } from "./parser";

const rss = {}

const fetchData = (url) => {
    return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
        .then((response) => {
            return response.data.contents;
        })
        .then((data) => parse(data))
}

const fetch = (url) => {
    fetchData(url)
    .then((data) => {
        let rssPosts = {};
        if (!rss[url] || !rss[url].rssPosts) {
            rssPosts = new Map();
        } else {
            rssPosts = rss[url].rssPosts;
        }
        data.rssPosts.forEach(post => {
            rssPosts.set(post.link, post);
        });
        rss[url] = {
            rssPosts: rssPosts, 
            rssFeeds: data.rssFeeds
        };
    })
    .then(() => render(rss))
}

export const autoupdate = (url) => {
    fetch(url);
    setTimeout(() => autoupdate(url), 5000)
}