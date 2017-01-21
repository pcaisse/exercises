function isObject(obj) {
    return obj === Object(obj);
}
function findCommandInKeys(obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        console.log('key', key);
        var value = obj[key];
        if (isObject(value)) {
            console.log('must go deeper with value ', value);
            return findCommandInKeys(value);
        } else if (['$merge', '$set'].includes(key)) {
            console.log('found key!', key);
            return key;
        } else {
            throw new Error('Command not found in object');
        }
    }
};
function update(state, commands) {
    console.log('command is', findCommandInKeys(commands));
}

module.exports = update;

