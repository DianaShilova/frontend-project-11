import { XMLParser } from "fast-xml-parser";

const parse = (data) => {
  try {
    const parser = new XMLParser();
    const xml = parser.parse(data);
    const { title, description, link } = xml.rss.channel;
    const rssFeeds = { title, description, link };
    const rssPosts = xml.rss.channel.item;
    return { rssFeeds, rssPosts };
  } catch {
    throw new Error('Parsing Error');
  }
};

export { parse };