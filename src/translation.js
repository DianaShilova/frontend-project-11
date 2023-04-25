import i18next from 'i18next';

i18next.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru: {
      translation: {
        'error-url': 'Ссылка должна быть валидным URL',
        'success-url': 'RSS успешно загружен',
        // 'required': 'Ссылка не должна быть пустой',
        'already-exist': 'RSS уже существует',
        'not-rss': 'Ресурс не содержит валидный RSS',
      },
    },
  },
});
