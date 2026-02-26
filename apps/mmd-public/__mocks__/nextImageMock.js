const React = require('react');

function MockImage({ src, alt, width, height }) {
  const srcValue = typeof src === 'object' && src !== null ? (src.src || '') : (src || '');
  return React.createElement('img', { src: srcValue, alt, width, height });
}

module.exports = MockImage;
module.exports.default = MockImage;
