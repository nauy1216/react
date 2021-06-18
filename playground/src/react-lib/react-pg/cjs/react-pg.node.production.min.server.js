/** @license React vundefined
 * react-pg.node.production.min.server.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

var react = require('react');
var pg = require('pg');
var utils = require('pg/lib/utils');

// Do not require this module directly! Use normal `invariant` calls with
// template literal strings. The messages will be replaced with error codes
// during build.
function formatProdErrorMessage(code) {
  let url = 'https://reactjs.org/docs/error-decoder.html?invariant=' + code;

  for (let i = 1; i < arguments.length; i++) {
    url += '&args[]=' + encodeURIComponent(arguments[i]);
  }

  return "Minified React error #" + code + "; visit " + url + " for the full message or " + 'use the non-minified dev environment for full errors and additional ' + 'helpful warnings.';
}

const Pending = 0;
const Resolved = 1;
const Rejected = 2;

function createRecordFromThenable(thenable) {
  const record = {
    status: Pending,
    value: thenable
  };
  thenable.then(value => {
    if (record.status === Pending) {
      const resolvedRecord = record;
      resolvedRecord.status = Resolved;
      resolvedRecord.value = value;
    }
  }, err => {
    if (record.status === Pending) {
      const rejectedRecord = record;
      rejectedRecord.status = Rejected;
      rejectedRecord.value = err;
    }
  });
  return record;
}

function readRecordValue(record) {
  if (record.status === Resolved) {
    return record.value;
  } else {
    throw record.value;
  }
}

function Pool(options) {
  this.pool = new pg.Pool(options); // Unique function per instance because it's used for cache identity.

  this.createRecordMap = function () {
    return new Map();
  };
}

Pool.prototype.query = function (query, values) {
  const pool = this.pool;
  const outerMap = react.unstable_getCacheForType(this.createRecordMap);
  let innerMap = outerMap;
  let key = query;

  if (values != null) {
    // If we have parameters, each becomes as a nesting layer for Maps.
    // We want to find (or create as needed) the innermost Map, and return that.
    for (let i = 0; i < values.length; i++) {
      let nextMap = innerMap.get(key);

      if (nextMap === undefined) {
        nextMap = new Map();
        innerMap.set(key, nextMap);
      } else if (!(nextMap instanceof Map)) {
        {
          {
            throw Error( formatProdErrorMessage(382));
          }
        }
      }

      innerMap = nextMap; // Postgres bindings convert everything to strings:
      // https://node-postgres.com/features/queries#parameterized-query
      // We reuse their algorithm instead of reimplementing.

      key = utils.prepareValue(values[i]);
    }
  }

  let record = innerMap.get(key);

  if (!record) {
    const thenable = pool.query(query, values);
    record = createRecordFromThenable(thenable);
    innerMap.set(key, record);
  } else if (record instanceof Map) {
    {
      {
        throw Error( formatProdErrorMessage(383));
      }
    }
  }

  const result = readRecordValue(record);
  return result;
};

exports.Pool = Pool;
