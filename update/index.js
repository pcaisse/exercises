function isObject(obj) {
    return obj === Object(obj);
}
function findCommandInKeys(obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        console.log('key', key);
        var value = obj[key];
        if (['$merge', '$set', '$push', '$unshift', '$merge', '$apply', '$splice'].includes(key)) {
            console.log('found key!', key);
            return key;
        } else if (isObject(value)) {
            console.log('must go deeper with value ', value);
            return findCommandInKeys(value);
        } else {
            throw new Error('Command not found in object');
        }
    }
}
/**
 * Set value in objA using matching value found in objB like {'$set': <value>}
 */
function setValueInObj(objA, objB) {
    console.log('objA', objA);
    console.log('objB', objB);
    if (objB.hasOwnProperty('$set')) {
        return objB['$set'];
    }
    var keysA = Object.keys(objA);
    console.log('keysA', keysA);
    var key, value, newValue;
    // iterate over all keys in objA
    for (var i = 0; i < keysA.length; i++) {
        key = keysA[i];
        value = objA[key];
        console.log('key', key, 'value', value);
        if (isObject(value)) {
            // value is an object itself so we make a recursive call on current value
            // and the potentially matching value from objB if it exists
            // and set the key's value to that new value
            console.log('isObject(value)', isObject(value));
            newValue = setValueInObj(value, objB[key]);
            console.log('newValue', newValue);
            objA[key] = newValue;
            return objA;
        } else if (objA.hasOwnProperty(key) && objB.hasOwnProperty(key)) {
            // fix up our non-obj key values
            console.log('key is shared', key);
            console.log('objB[key]', objB[key]);
            if (isObject(objB[key]) && objB[key].hasOwnProperty('$set')) {
                objA[key] = objB[key]['$set'];
            }
            return objA;
        }
    }
}
var FUNCS = {
    $set: setValueInObj,
    $push: function(a, b) {
        return a.concat(b['$push']);
    },
    $unshift: function(a, b) {
        return b['$unshift'].concat(a);
    },
    $merge: function(a, b) {
        return Object.assign(a, b['$merge']);
    },
    $apply: function(param, funcObj) {
        var func = funcObj['$apply'];
        return func(param);
    },
    $splice: function(a, b) {
        // Note: would use the spread operator here and simply call Array.prototype.splice() if using ES6
        var spliceArgs = b['$splice'][0];
        var startIndex = spliceArgs[0];
        var deleteCount = spliceArgs[1];
        var itemToAdd = spliceArgs[2];
        a.splice(startIndex, deleteCount, itemToAdd);
        return a;
    }
};
function update(state, commands) {
    var command = findCommandInKeys(commands);
    console.log('command is', command);
    var result = FUNCS[command](state, commands); 
    console.log('result', result);
    return result;
}

module.exports = update;

