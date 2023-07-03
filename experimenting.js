import _ from 'lodash';
import { setPathValue, get } from './setGet.js';

/** from object to path-value pairs */
function toLeaves(ob, mapLeaf = (x) => x) {
  // flatten
  const toReturn = {};
  _.forEach(ob, (value, key) => {
    if (!_.isObject(value)) {
      toReturn[key] = value; // leaf
      return;
    }
    const flat = toLeaves(value);
    _.forEach(flat, (subValue, subKey) => {
      const arr = _.isArray(value);
      const k = key + (arr ? `[${subKey}]` : `.${subKey}`);
      toReturn[k] = subValue;
    });
  });
  // map
  _.forEach(toReturn, (value, path) => {
    toReturn[path] = mapLeaf(value, path);
  });
  return toReturn;
}

/** from path-value pairs to object */
function toTree(obj, mapLeaf = (x) => x) {
  let toReturn = {};
  _.forEach(obj, (value, path) => {
    // setPathValue(toReturn, path, mapLeaf(value, path));
    _.set(toReturn, path, mapLeaf(value, path));
  });
  return toReturn;
}

const ob1 = {
  a: {
    b: ['davi', 'alexandre'],
    c: 'null',
  },
  x: {
    y: 'yplson',
  },
};

const ob2 = {
  a: {
    b: {
      0: 'davi',
      1: 'alexandre',
    },
    c: null,
  },
  x: {
    y: 'yplson',
  },
};

const ob3 = {
  a: {
    b: {
      0: 'davi',
      one: 'alexandre',
    },
    c: null,
  },
  x: {
    y: 'yplson',
  },
};

function test(ob) {
  const record = toLeaves(ob);
  const inversed = toTree(record);
  console.log(JSON.stringify(ob, null, 0));
  console.log(JSON.stringify(record, null, 0));
  console.log(JSON.stringify(inversed, null, 0));
}

test(ob2);

// console.log(_.toPath('a[0].2.f'));

// The problem with lodash's toPath is that it gives
// the same output for both 'a[0]' and 'a.0'
// and for that reason, it can't tell arrays and objects apart
// which is a problem if you want to inverse the path record and use the array's methods
// another problem arises if you mix numbers and words as keys

// a[0].b = ... ==>  {a: [   {b: ...} ]}
// a.0.b  = ... ==>  {a: {0: {b: ...} }}
