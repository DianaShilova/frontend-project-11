import * as yup from 'yup';


const urlform = document.querySelector('.rss-form');
const rssInput = document.querySelector('#url-input')
const succesLabel = document.querySelector('.success-url');
const errorLabel = document.querySelector('.error-url');

const schema = yup.object().shape({
    url: yup.string().url().required(),
});

const onSuccess = () => {
    rssInput.classList.remove('is-invalid');
    rssInput.classList.add('is-valid');
    succesLabel.classList.remove('is-hidden');
    errorLabel.classList.add('is-hidden');
}

const onError = () => {
    rssInput.classList.remove('is-valid');
    rssInput.classList.add('is-invalid');
    errorLabel.classList.remove('is-hidden');
    succesLabel.classList.add('is-hidden');
}

const onSubmit = (event) => {
    event.preventDefault();
    const data = {};
    const formData = new FormData(event.target);
    for (let [key, value] of formData) {
        data[key] = value;
    }
    schema.validate(data)
        .then(onSuccess)
        .catch(onError);
}

urlform.addEventListener('submit', onSubmit);
