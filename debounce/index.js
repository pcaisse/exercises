function debounce(func, ms) {
    var isWaitingToExecute = false;
    return function() {
        if (!isWaitingToExecute) {
            setTimeout(function() {
                func.apply(this, arguments);
                isWaitingToExecute = false;
            }.bind(this), ms);  // bind context explicitly
            isWaitingToExecute = true;
        }
    };
}

module.exports = debounce;

