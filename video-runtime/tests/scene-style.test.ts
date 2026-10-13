import {test} from 'node:test';
import assert from 'node:assert/strict';
import {headingFontFamily} from '../src/scene-style';

test('storyboard headlines use the loaded custom font when supplied', () => {
  assert.equal(headingFontFamily('A profile heading font', true), 'ProductionFont');
});

test('storyboard headlines retain the profile font when no custom font is supplied', () => {
  assert.equal(headingFontFamily('A profile heading font', false), 'A profile heading font, Arial, sans-serif');
});
