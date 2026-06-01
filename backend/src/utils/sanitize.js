const sanitizeHtml = require('sanitize-html');

/**
 * Strips all HTML tags and attributes from a string.
 * Used to prevent stored XSS attacks on user-provided text fields.
 */
const sanitizeInput = (text) => {
  if (typeof text !== 'string') return text;
  return sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {}
  }).trim();
};

/**
 * Sanitize specific fields in an object.
 * Only sanitizes string values for the given keys.
 */
const sanitizeFields = (obj, fields) => {
  const sanitized = { ...obj };
  for (const field of fields) {
    if (sanitized[field] && typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeInput(sanitized[field]);
    }
  }
  return sanitized;
};

module.exports = { sanitizeInput, sanitizeFields };
