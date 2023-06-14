import i18next from 'i18next';
import { XMLParser } from 'fast-xml-parser';
import CustomError from './error';

const parse = (data) => {
  try {
    const parser = new XMLParser();
    const xml = parser.parse(data);
    const { title, description, link } = xml.rss.channel;

    const rssFeeds = { title, description, link };
    const rssPosts = xml.rss.channel.item;
    return { rssFeeds, rssPosts };
  } catch (error) {
    throw new CustomError(`${i18next.t('parsing-error')}: ${error.message}`);
  }
};

export default parse;
