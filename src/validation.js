import * as yup from 'yup';
import i18next from 'i18next';
import './translation'

const urlform = document.querySelector('.rss-form');
const rssInput = document.querySelector('#url-input')
const successLabel = document.querySelector('.success-url');
const errorLabel = document.querySelector('.error-url');

const schema = yup.object().shape({
    url: yup.string().url(i18next.t('error-url')).required(i18next.t('required')),

});

const testUrl = (isError, error) => {
    rssInput.classList.toggle('is-invalid', isError);
    rssInput.classList.toggle('is-valid', !isError);
    successLabel.classList.toggle('is-hidden', isError);
    errorLabel.classList.toggle('is-hidden', !isError);
    if (!isError) {
        successLabel.textContent = (i18next.t('success-url'))
    } else {
        errorLabel.textContent = (error.message);
    }    
} 


const onSubmit = (event) => {
    event.preventDefault();
    const data = {};
    const formData = new FormData(event.target);
    for (let [key, value] of formData) {
        data[key] = value;
    }
    schema.validate(data)
        .then(() => testUrl(false))
        .catch((error) => { testUrl(true, error)
        console.log(error)
    });
}

urlform.addEventListener('submit', onSubmit);
