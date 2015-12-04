/*******************************************************************************
 * C O N S T A N T
 ******************************************************************************/
var C_APPLICATION = {
    URL: "http://chyntia.github.io/zling/",
    ICON: "http://chyntia.github.io/zling/asset/image/zling-puzzle.png"
};
var C_CONTROLLER = {
    BORDER_WIDTH: 5
};
var C_GAME = {
    STATE: {
        USER_ACTION: 0,
        COMPUTER_PROCESS: 1,
        OVER: 2,
        COMPLETE: 3
    },
    MODE: {
        SLIDE: 0,
        SWING: 1
    },
    SCORE: {
        CORRECT: 50,
        SLIDE: -1,
        SWING: -5
    },
    STEP: {
        MAX_SLIDE: 50,
        SLIDE_FOR_SWING: 10
    },
    COOKIE: {
        EXPIRES: 10
    }
};
var C_TILE = {
    TYPE: {
        COMMON: 2,
        NEIGHBOR: 1,
        HOLE: 0
    },
    CORRECTNESS: {
        INCORRECT: 0,
        CORRECT: 1
    }
};