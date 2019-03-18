import escapeRegExp from 'lodash.escaperegexp';
import matcher from 'matcher';

export const WILDCARD_MARKER_ESCAPED = '{{\\*}}';
export const WILDCARD_MARKER = '{{*}}';

export default (source, target) => {
  if (!source || (source || '') === (target || '')) {
    return source === target;
  }

  const wildcardedSource = source
    .replace(new RegExp(escapeRegExp('*'), 'g'), '\\*')
    .replace(new RegExp(escapeRegExp(WILDCARD_MARKER_ESCAPED), 'g'), '*');

  const escapedTarget = target
    ? target.replace(new RegExp(escapeRegExp('*'), 'g'), '\\*')
    : null;

  return matcher.isMatch(escapedTarget, wildcardedSource);
};
