function isObject(obj) {
    return obj === Object(obj);
}
function safeHasOwnProperty(obj, key) {
    // Note: this will still work even if obj.hasOwnProperty has been overridden
    return Object.prototype.hasOwnProperty.call(obj, key);
}
/**
 * Recursively search through object for command
 */
function findCommandInKeys(obj) {
    for (var key in obj) {
        console.log('obj', obj);
        if (safeHasOwnProperty(obj, key)) {
            console.log('key', key);
            var value = obj[key];
            if (['$merge', '$set', '$push', '$unshift', '$merge', '$apply', '$splice'].indexOf(key) !== -1) {
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
}
/**
 * Mutate value in object using value found within its own nested object like {'$set': <value>}
 */
function setValueInObj(obj) {
    console.log('obj', obj);
    for (var key in obj) {
        if (safeHasOwnProperty(obj, key)) {
            var value = obj[key];
            console.log('key', key, 'value', value);
            if (key === '$set') {
                // replace $set object with just its value
                console.log('replace set');
                return value;
            } else if (isObject(value)) {
                // call on value which is itself an object
                // and update with new value
                var newValue = setValueInObj(value);
                obj[key] = newValue;
                return obj;
            }
        }
    }
}
var FUNCS = {
    $set: function(a, b) {
        if (safeHasOwnProperty(b, '$set')) {
            // replace a with value of b
            return b['$set'];
        }
        return Object.assign({}, a, setValueInObj(b));
    },
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

