/**
 * Wait a certain number of ms before executing function, resetting timer for each subsequent call.
 */
function debounce(func, ms) {
    var currCount = 0;
    return function() {
        var args = arguments;  // save off arguments so they can be passed to function call
        currCount++;
        setTimeout(function(count) {
            // Only call function if another subsequent call was not made in the interim
            if (count === currCount) {
                func.apply(this, args);
                currCount = 0;
            }
        }.bind(this, currCount), ms);  // bind context explicitly
    };
}

module.exports = debounce;

