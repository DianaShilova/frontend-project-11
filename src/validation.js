import * as yup from 'yup';
import i18next from 'i18next';
import './translation'

const urlform = document.querySelector('.rss-form');
const rssInput = document.querySelector('#url-input')
const validatorOutput = document.querySelector('.validator-output')


const schema = yup.object().shape({
    url: yup.string().url(i18next.t('error-url')).required(i18next.t('required')),

});

const testUrl = (isError, error) => {
    rssInput.classList.toggle('is-invalid', isError);
    rssInput.classList.toggle('is-valid', !isError);
    validatorOutput.classList.remove('is-hidden');
    validatorOutput.classList.toggle('error-url', isError)
    validatorOutput.classList.toggle('success-url', !isError)
    if (!isError) {
        validatorOutput.textContent = (i18next.t('success-url'))
    
    } else {
        validatorOutput.textContent = (error.message);
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
    });
}

urlform.addEventListener('submit', onSubmit);
