import * as yup from 'yup';
import i18next from 'i18next';
import './translation'

const rssInput = document.querySelector('#url-input')
const validatorOutput = document.querySelector('.validator-output')

const schema = yup.object().shape({
    url: yup.string().url(i18next.t('error-url')).required(i18next.t('required')),

});



const rendorResult = (isError, error) => {
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

const validate = (data) => {
    const promise = new Promise((resolve, reject) => {
        schema.validate(data)
        .then(() => { 
            rendorResult(false)
            resolve();
        })
        .catch((error) => { 
            rendorResult(true, error)
            reject();
        });
    })
    return promise;
}

export { validate };
