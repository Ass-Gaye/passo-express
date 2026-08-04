const test = require('node:test');
const assert = require('node:assert/strict');
const { checkRole } = require('../middleware/auth.middleware');

test('checkRole allows OPERATOR and denies PASSENGER', (t) => {
  // Allowed case: OPERATOR
  let nextCalled = false;
  const reqAllowed = { user: { id: 1, role: 'OPERATOR' } };
  const resAllowed = {};
  const nextAllowed = () => { nextCalled = true; };

  const middleware = checkRole(['OPERATOR']);
  middleware(reqAllowed, resAllowed, nextAllowed);
  assert.equal(nextCalled, true, 'Operator should be allowed and next() called');

  // Forbidden case: PASSENGER
  let statusCode = null;
  let jsonBody = null;
  const reqDenied = { user: { id: 2, role: 'PASSENGER' } };
  const resDenied = {
    status: function (code) { statusCode = code; return this; },
    json: function (body) { jsonBody = body; return this; },
  };
  let nextDeniedCalled = false;
  const nextDenied = () => { nextDeniedCalled = true; };

  const middlewareDenied = checkRole(['OPERATOR']);
  middlewareDenied(reqDenied, resDenied, nextDenied);

  assert.equal(nextDeniedCalled, false, 'Passenger should not be allowed');
  assert.equal(statusCode, 403, 'Response status should be 403 for insufficient permissions');
  assert.equal(jsonBody.message, 'Insufficient permissions');
});
