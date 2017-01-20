function debounce(func, ms) {
    var isWaitingToExecute = false;
    return function() {
        if (!isWaitingToExecute) {
            setTimeout(function() {
                func();
                isWaitingToExecute = false;
            }, ms);
            isWaitingToExecute = true;
        }
    };
}

module.exports = debounce;

