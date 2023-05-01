import { XMLParser } from 'fast-xml-parser';
// import i18next from 'i18next';

// const validatorOutput = document.querySelector('.feedback');

const parse = (data) => {
  try {
    const parser = new XMLParser();
    const xml = parser.parse(data);
    const { title, description, link } = xml.rss.channel;
    const rssFeeds = { title, description, link };
    const rssPosts = xml.rss.channel.item;
    return { rssFeeds, rssPosts };
  } catch (error) {
    // validatorOutput.classList.remove('is-hidden');
    // validatorOutput.classList.remove('text-muted');
    // validatorOutput.textContent = (i18next.t('not-rss'));
    // validatorOutput.classList.toggle('text-danger', true);
    // validatorOutput.classList.toggle('text-success', false);
    // throw new Error(i18next.t('not-rss'));
    throw new Error('Parsing error');
  }
};

export default parse;
