import * as mocks from '@test/mocks';
import * as utils from '../utils';

describe('compileTemplate', () => {
  test('common', () => {
    function testMethod(msg, payload, expected) {
      expect(utils.compileTemplate(msg, payload)).toBe(expected);
    }

    testMethod('A {0} {1}', [1, 'w'], 'A 1 w');
    testMethod('{a}{b}{c.d.e}', { a: 1, b: 2, c: { d: { e: 3 } }}, '123');
    testMethod('A{}', {}, 'A');
    testMethod('{numbers}', { numbers: [1, 2, 3] }, '1,2,3');
    testMethod('{a.0.b}', { a: [{ b: '#' }]}, '#');
  });
});

describe('calculateDelayToTypeMessage', () => {
  test('common', () => {
    function testMethod(msg, time, expected) {
      expect(utils.calculateDelayToTypeMessage(msg, time)).toBe(expected);
    }

    testMethod('Long message here', 40, 680);
    testMethod('Short', 40, 200);
    testMethod('', 40, 0);
  });
});

describe('isMatchAnswer', () => {
  test('common', () => {
    function testMethod(answer, option, expected) {
      expect(utils.isMatchAnswer(answer, option)).toBe(expected);
    }

    testMethod('word', 'Word', true);
    testMethod('Word', 'word', true);
    testMethod('123', 123, true);
    testMethod(123, '123', true);
  });
});

describe('findOptionByAnswer', () => {
  function testMethod(options, answer, expected) {
    expect(utils.findOptionByAnswer(options, answer)).toBe(expected);
  }

  test('match by value', () => {
    const options = [
      mocks.RuleOption({ label: 'Option 1' }),
      mocks.RuleOption({ label: 'Option 2' }),
    ];
    testMethod(options, 'option 1', options[0]);
    testMethod(options, 'OPTION 2', options[1]);
    testMethod(options, 'unknown', undefined);
  });

  test('match by label', () => {
    const options = [
      mocks.RuleOption({ label: 'Word 1', value: 'option-1' }),
      mocks.RuleOption({ label: 'Word 2', value: 'option-2' }),
    ];
    testMethod(options, 'option-1', options[0]);
    testMethod(options, 'OPTION-2', options[1]);
    testMethod(options, 'unknown', undefined);
  });
});

describe('ensureArray', () => {
  test('common', () => {
    function testMethod(val, expected) {
      expect(utils.ensureArray(val)).toEqual(expected);
    }
    testMethod(1, [1]);
    testMethod([1], [1]);
    testMethod([1, 'word'], [1, 'word']);
  });
});

describe('identifyAnswersInString', () => {
  test('common', () => {
    function testMethod(answer, options, expected) {
      expect(utils.identifyAnswersInString(answer, options)).toEqual(expected);
    }
    testMethod('Unknown', ['Option'], []);
    testMethod('Apple, banana and grAPE', ['Apple', 'Banana', 'Grape'], [
      'Apple', 'Banana', 'Grape',
    ]);
    testMethod('One+tWo+four', ['one', 'two', 'three'], ['one', 'two']);
  });
});
