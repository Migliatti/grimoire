import {test} from 'node:test';
import assert from 'node:assert/strict';
import {composeTransforms, movementTransform} from '../src/motion';

test('hold movement keeps a slide entrance transform valid', () => {
  const entrance = 'translateX(80px)';
  assert.equal(composeTransforms(entrance, movementTransform('hold', 0)), entrance);
});

