import {validate} from './validation.js'
import { parse } from './parser.js'
import { autoupdate } from './autoupdate.js';



const form = document.querySelector('.rss-form');
const input = document.querySelector('#url-input')

const onSubmit = (event) => {
    event.preventDefault();
    const data = {
        url: input.value,
    }
    validate(data)
    .then(() => autoupdate(data.url))
}



form.addEventListener('submit', onSubmit)
