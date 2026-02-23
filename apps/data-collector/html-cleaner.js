const { load } = require('cheerio');

const ELEMENTS_TO_REMOVE = [
  'script',
  'style',
  'nav',
  'footer',
  'aside',
  'header',
  'noscript',
  'iframe',
  'svg',
  'form',
];

const AD_CLASS_PATTERNS = [
  /\bad[-_]?\b/i,
  /\badvertis/i,
  /\bsponsored\b/i,
  /\bpromo\b/i,
  /\bsidebar\b/i,
  /\bpopup\b/i,
  /\bmodal\b/i,
  /\bcookie/i,
  /\bbanner\b/i,
];

function cleanHtml(rawHtml) {
  const $ = load(rawHtml);

  // Remove unwanted elements
  ELEMENTS_TO_REMOVE.forEach((tag) => $(tag).remove());

  // Remove elements with ad-related class names
  $('[class]').each((_, el) => {
    const className = $(el).attr('class') || '';
    if (AD_CLASS_PATTERNS.some((pattern) => pattern.test(className))) {
      $(el).remove();
    }
  });

  // Return cleaned HTML body content
  return $('body').html() || $.html();
}

module.exports = { cleanHtml };
