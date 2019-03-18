import stringSimilarity from './stringSimilarity';

describe('stringSimilarity', () => {
  const WILDCARD = '{{*}}';

  it('should match a target with a valid pattern', () => {
    expect(stringSimilarity(`before${WILDCARD}after`, 'beforesomethingafter')).toBe(true);
  });

  it('should match a target with a valid pattern at the beginning', () => {
    expect(stringSimilarity(`${WILDCARD}after`, 'somethingafter')).toBe(true);
  });

  it('should match a target with a valid pattern at the end', () => {
    expect(stringSimilarity(`before${WILDCARD}`, 'beforesomething')).toBe(true);
  });

  it('should match a target without populated pattern', () => {
    expect(stringSimilarity(`before${WILDCARD}after`, 'beforeafter')).toBe(true);
  });

  it('should match a target against a source without a wildcard', () => {
    expect(stringSimilarity('string1', 'string1')).toBe(true);
  });

  it('should not match a target against a source without a wildcard', () => {
    expect(stringSimilarity('string1', 'string2')).toBe(false);
  });

  it('should not match a target with an empty source', () => {
    expect(stringSimilarity('', 'something')).toBe(false);
  });

  it('should match an empty target against a wildcarded source', () => {
    expect(stringSimilarity(`${WILDCARD}`, '')).toBe(true);
  });

  it('should match a target that has asterisks against a wildcarded source', () => {
    expect(stringSimilarity(`before${WILDCARD}after*`, 'beforeabceafter*')).toBe(true);
  });

  it('should match an null target against a wildcarded source', () => {
    expect(stringSimilarity(`${WILDCARD}`, null)).toBe(true);
  });

  it('should match if the source and target are both null', () => {
    expect(stringSimilarity(null, null)).toBe(true);
  });

  it('should not match if the source and target are undefined and null', () => {
    expect(stringSimilarity(null, undefined)).toBe(false);
  });

  it('should not match if the source and target are undefined and null', () => {
    expect(stringSimilarity(null, 'something')).toBe(false);
  });
});
