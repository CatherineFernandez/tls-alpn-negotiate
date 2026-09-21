import { test } from 'node:test';
import assert from 'node:assert/strict';

import { selectAlpnProtocol } from '../src/core.js';

test('returns the most preferred server protocol when it is offered', () => {
  assert.equal(
    selectAlpnProtocol(['h2', 'http/1.1'], ['h2', 'http/1.1']),
    'h2'
  );
});

test('skips client-only protocols and selects the first server preference present', () => {
  assert.equal(
    selectAlpnProtocol(['http/1.1', 'spdy/3.1'], ['h2', 'http/1.1']),
    'http/1.1'
  );
});

test('respects server preference order over client order', () => {
  assert.equal(
    selectAlpnProtocol(['http/1.1', 'h2'], ['h2', 'http/1.1']),
    'h2'
  );
});

test('returns null when there is no shared protocol', () => {
  assert.equal(
    selectAlpnProtocol(['h2'], ['http/1.1']),
    null
  );
});

test('returns null when the client list is empty', () => {
  assert.equal(selectAlpnProtocol([], ['h2', 'http/1.1']), null);
});

test('returns null when the server list is empty', () => {
  assert.equal(selectAlpnProtocol(['h2', 'http/1.1'], []), null);
});

test('handles duplicate client protocols without changing the result', () => {
  assert.equal(
    selectAlpnProtocol(['h2', 'h2', 'http/1.1'], ['h2', 'http/1.1']),
    'h2'
  );
});

test('throws TypeError when clientProtocols is not an array', () => {
  assert.throws(
    () => selectAlpnProtocol('h2', ['h2']),
    TypeError
  );
});

test('throws TypeError when serverProtocols is not an array', () => {
  assert.throws(
    () => selectAlpnProtocol(['h2'], 'h2'),
    TypeError
  );
});

test('treats protocol names as exact, case-sensitive strings', () => {
  assert.equal(
    selectAlpnProtocol(['H2', 'h2'], ['h2', 'http/1.1']),
    'h2'
  );
});

test('returns null for empty string protocol names when both sides include them', () => {
  // Empty strings are not valid ALPN protocol names in practice, but the
  // function's contract is plain string comparison; it does not validate
  // protocol name syntax.
  assert.equal(selectAlpnProtocol([''], ['']), '');
});
