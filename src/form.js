import {validate} from './validation.js'
import axios from 'axios';
import { parse } from './parser.js'
import { render } from './feeds.js'


const form = document.querySelector('.rss-form');
const input = document.querySelector('#url-input')

const onSubmit = (event) => {
    event.preventDefault();
    const data = {
        url: input.value,
    }
    validate(data)
    .then(() => fetchData(data.url))
    .then((data) => parseData(data))
    .then((rssData) => render(rssData))
    
}

const fetchData = (url) => {
    return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
        .then((response) => {
            return response.data.contents;
        })
}

form.addEventListener('submit', onSubmit)

const parseData = (data) => {
    return parse(data);
    
}