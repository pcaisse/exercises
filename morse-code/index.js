var DURATIONS = {
    dot: 1,
    dash: 3,
    betweenDotOrDash: 1,
    betweenLetter: 3,
    betweenWord: 7
};
var DOT = '.';
var DASH = '-';
var SPACE = ' ';

/**
 * Recursively build out a chain of functions, one for each duration,
 * ending with the final callback signaling completion.
 */
function makeFunc(timeouter, toggle, durations, index, callback) {
    console.log('makeFunc called');
    console.log('index', index);
    var isFirst = index === 0;
    var isLast = index === durations.length - 1;
    var currDuration = durations[index];
    if (isFirst) {
        toggle();
    }
    if (isLast) {
        return function() {
            timeouter(function() {
                toggle();
                callback();
            }, currDuration);
        };
    }
    return function() {
        var nextFunc = makeFunc(timeouter, toggle, durations, index + 1, callback)
        return timeouter(function() {
            toggle();
            nextFunc();
        }, currDuration);
    };
}

function transmitter(options, callback) {
    // destructuring would come in handy here...
    var codes = options.codes;
    var message = options.message;
    var timeouter = options.timeouter;
    var toggle = options.toggle;
    var messageLength = message.length;
    var nextLetter, isLastSymbolInCode, isLastLetterInMessage, duration;
    var durations = [];

    message.split('').forEach(function(letter, letterIndex) {
        if (!Object.keys(codes).includes(letter) && letter !== SPACE) {
            throw new Error('Letter missing from codes: ', letter);
        }

        console.log('current letter is', letter);
        code = codes[letter];
        if (code) {
            console.log('current code is', code);
            code.split('').forEach(function(symbol, symbolIndex) {  // symbol = dot or dash
                if (symbol === DOT) {
                    console.log('dot! toggle for ', DURATIONS.dot);
                    durations.push(DURATIONS.dot);
                } else if (symbol === DASH) {
                    console.log('dash! wait ', DURATIONS.dash);
                    durations.push(DURATIONS.dash);
                } else {
                    throw new Error('Invalid symbol in code: ', symbol);
                }
                var isLastSymbolInCode = symbolIndex === code.length - 1;
                if (!isLastSymbolInCode) {
                    console.log('new symbol coming up. wait ', DURATIONS.betweenDotOrDash);
                    durations.push(DURATIONS.betweenDotOrDash);
                }
            });
        }

        isLastLetterInMessage = letterIndex === message.length - 1;
        if (!isLastLetterInMessage) {
            nextLetter = message[letterIndex + 1];
            if (nextLetter === " ") {
                console.log('space found. wait ', DURATIONS.betweenWord);
                durations.push(DURATIONS.betweenWord);
            } else {
                console.log('new letter coming up. wait ', DURATIONS.betweenLetter);
                durations.push(DURATIONS.betweenLetter);
            }
        }
    });

    console.log('durations', durations);
    makeFunc(timeouter, toggle, durations, 0, callback)();
}

module.exports = transmitter;

