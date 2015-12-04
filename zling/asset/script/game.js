/*******************************************************************************
 * G A M E
 * @param {number}  numRows     Number of rows in the game.
 * @param {number}  numColumns  Number of columns in the game.
 ******************************************************************************/
function Game(numRows, numColumns) {

    /*==========================================================================
     * Variable
     */
    this.vState = C_GAME.STATE.COMPUTER_PROCESS;
    this.vMode = C_GAME.MODE.SLIDE;
    this.vSlideForSwing = C_GAME.STEP.SLIDE_FOR_SWING;
    this.vNumCorrect = 0;
    this.vNumCorrectMax = 0;
    this.vScore = 0;

    /*==========================================================================
     * Object
     */
    this.oSlide = new Step(numRows * numColumns * C_GAME.STEP.MAX_SLIDE);
    this.oSwing = new Step(1);
    this.oDimension = {
        row: numRows,
        column: numColumns,
        tile: numRows * numColumns
    };
    this.oHole = {
        row: 0,
        column: 0
    };
    /*==========================================================================
     * Array
     */
    this.aTiles = [];

    /*==========================================================================
     * Function
     */

    this.fInit = function () {
        if (typeof $.cookie("game_vState") !== "undefined") {
            this.fLoad();
        } else {
            this.fNew();
        }
    };

    this.fNew = function () {
        var tiles = this.fRandomizeTiles();
        this.fAsignTiles(tiles);
        this.fReadjustCorrectTiles();
        this.fRandomizeHole();
        this.fUpdateTilesType();
        this.fUpdateTilesCorrectness();
        this.fSave();
    };

    this.fLoad = function () {
        //load variable
        this.vState = parseInt($.cookie("game_vState"));
        this.vMode = parseInt($.cookie("game_vMode"));
        this.vSlideForSwing = parseInt($.cookie("game_vSlideForSwing"));
        this.vNumCorrect = parseInt($.cookie("game_vNumCorrect"));
        this.vNumCorrectMax = parseInt($.cookie("game_vNumCorrectMax"));
        this.vScore = parseInt($.cookie("game_vScore"));

        //load object
        this.oSlide.vCount = $.cookie("game_oSlide_vCount");
        this.oSlide.vMaximum = $.cookie("game_oSlide_vMaximum");
        this.oSwing.vCount = $.cookie("game_oSwing_vCount");
        this.oSwing.vMaximum = $.cookie("game_oSwing_vMaximum");
        this.oDimension.row = $.cookie("game_oDimension_row");
        this.oDimension.column = $.cookie("game_oDimension_column");
        this.oDimension.tile = $.cookie("game_oDimension_tile");
        this.oHole.row = $.cookie("game_oHole_row");
        this.oHole.column = $.cookie("game_oHole_column");

        //load array
        var temp = $.cookie("game_aTiles").split("-");
        var tiles = [];
        for (var i = 0; i < temp.length; i++) {
            tiles[i] = new Tile(parseInt(temp[i]));
        }

        //adjust game
        this.fAsignTiles(tiles);
        this.fUpdateTilesType();
        this.fUpdateTilesCorrectness();
    };

    this.fSave = function () {
        var option = {expires: C_GAME.COOKIE.EXPIRES};

        //save variable
        $.cookie("game_vState", this.vState, option);
        $.cookie("game_vMode", this.vMode, option);
        $.cookie("game_vSlideForSwing", this.vSlideForSwing, option);
        $.cookie("game_vNumCorrect", this.vNumCorrect, option);
        $.cookie("game_vNumCorrectMax", this.vNumCorrectMax, option);
        $.cookie("game_vScore", this.vScore, option);

        //save object
        $.cookie("game_oSlide_vCount", this.oSlide.vCount, option);
        $.cookie("game_oSlide_vMaximum", this.oSlide.vMaximum, option);
        $.cookie("game_oSwing_vCount", this.oSwing.vCount, option);
        $.cookie("game_oSwing_vMaximum", this.oSwing.vMaximum, option);
        $.cookie("game_oDimension_row", this.oDimension.row, option);
        $.cookie("game_oDimension_column", this.oDimension.column, option);
        $.cookie("game_oDimension_tile", this.oDimension.tile, option);
        $.cookie("game_oHole_row", this.oHole.row, option);
        $.cookie("game_oHole_column", this.oHole.column, option);

        //save array
        var tiles = "";
        for (var i = 0; i < this.oDimension.row; i++) {
            for (var j = 0; j < this.oDimension.column; j++) {
                tiles += this.aTiles[i][j].vId + "-";
            }
        }
        $.cookie("game_aTiles", tiles, option);
    };

    this.fRandomizeTiles = function () {
        var tiles = [];

        //initialize id (1 to number of tiles)
        for (var i = 0; i < this.oDimension.tile; i++) {
            tiles[i] = new Tile((i + 1));
        }

        //randomize position
        for (var i = 0; i < this.oDimension.tile; i++) {
            var indexA = Math.floor((Math.random() * this.oDimension.tile));
            var indexB = Math.floor((Math.random() * this.oDimension.tile));
            var temp = tiles[indexA];
            tiles[indexA] = tiles[indexB];
            tiles[indexB] = temp;
        }

        return tiles;
    };

    this.fAsignTiles = function (tiles) {
        var k = 0;
        for (var i = 0; i < this.oDimension.row; i++) {
            this.aTiles[i] = [];
            for (var j = 0; j < this.oDimension.column; j++) {
                this.aTiles[i][j] = tiles[k];
                k++;
            }
        }
    };

    this.fReadjustCorrectTiles = function () {
        var numCorrect = 0;

        do {
            numCorrect = 0;
            var k = 1;

            for (var i = 0; i < this.oDimension.row; i++) {
                for (var j = 0; j < this.oDimension.column; j++) {
                    if (this.aTiles[i][j].vId === k) {
                        numCorrect++;
                        var indexI = Math.floor((Math.random() * this.oDimension.row));
                        var indexJ = Math.floor((Math.random() * this.oDimension.column));
                        var temp = this.aTiles[i][j];
                        this.aTiles[i][j] = this.aTiles[indexI][indexJ];
                        this.aTiles[indexI][indexJ] = temp;
                    }
                    k++;
                }
            }

        } while (numCorrect !== 0);
    };

    this.fRandomizeHole = function () {
        this.oHole.row =
                Math.floor((Math.random() * this.oDimension.row));
        this.oHole.column =
                Math.floor((Math.random() * this.oDimension.column));
    };

    this.fUpdateTilesType = function () {
        for (var i = 0; i < this.oDimension.row; i++) {
            for (var j = 0; j < this.oDimension.column; j++) {
                var distance = Math.abs(this.oHole.row - i) +
                        Math.abs(this.oHole.column - j);
                switch (distance) {
                    case C_TILE.TYPE.NEIGHBOR:
                        this.aTiles[i][j].vType =
                                C_TILE.TYPE.NEIGHBOR;
                        break;
                    case C_TILE.TYPE.HOLE:
                        this.aTiles[i][j].vType =
                                C_TILE.TYPE.HOLE;
                        break;
                    default:
                        this.aTiles[i][j].vType =
                                C_TILE.TYPE.COMMON;
                        break;
                }
            }
        }
    };

    this.fUpdateTilesCorrectness = function () {
        var k = 1;
        for (var i = 0; i < this.oDimension.row; i++) {
            for (var j = 0; j < this.oDimension.column; j++) {
                if (k === this.aTiles[i][j].vId) {
                    this.aTiles[i][j].vCorrectness =
                            C_TILE.CORRECTNESS.CORRECT;
                } else {
                    this.aTiles[i][j].vCorrectness =
                            C_TILE.CORRECTNESS.INCORRECT;
                }
                k++;
            }
        }
    };

    this.fUpdateGameMode = function (mode) {
        switch (mode) {
            case C_GAME.MODE.SLIDE:
                if (this.oSlide.vCount < this.oSlide.vMaximum) {
                    this.vMode = C_GAME.MODE.SLIDE;
                    return this.vMode;
                }
                break;
            case C_GAME.MODE.SWING:
                if (this.oSwing.vCount < this.oSwing.vMaximum) {
                    this.vMode = C_GAME.MODE.SWING;
                    return this.vMode;
                }
                break;
            default:
                break;
        }
        return false;
    };

    this.fUpdateGameState = function () {
        this.vNumCorrect = 0;
        var k = 1;
        for (var i = 0; i < this.oDimension.row; i++) {
            for (var j = 0; j < this.oDimension.column; j++) {
                if (k === this.aTiles[i][j].vId) {
                    this.vNumCorrect++;
                }
                k++;
            }
        }

        if (this.vNumCorrect == this.oDimension.tile) {
            this.vState = C_GAME.STATE.COMPLETE;
        } else if (this.oSlide.vCount >= this.oSlide.vMaximum &&
                this.oSwing.vCount >= this.oSwing.vMaximum) {
            this.vState = C_GAME.STATE.OVER;
        }

        this.fUpdateGameScore();
    };

    this.fUpdateGameScore = function () {
        if (this.vNumCorrectMax < this.vNumCorrect) {
            this.vNumCorrectMax = this.vNumCorrect;
        }
        this.vScore = this.vNumCorrectMax * C_GAME.SCORE.CORRECT +
                this.oSlide.vCount * C_GAME.SCORE.SLIDE +
                this.oSwing.vCount * C_GAME.SCORE.SWING;
        if (this.vScore < 0) {
            this.vScore = 0;
        }
    };

    this.fLockGame = function () {
        this.vState = C_GAME.STATE.COMPUTER_PROCESS;
    };

    this.fUnlockGame = function () {
        if (this.vState !== C_GAME.STATE.OVER &&
                this.vState !== C_GAME.STATE.COMPLETE) {
            this.vState = C_GAME.STATE.USER_ACTION;
        }
        this.fSave();
    };

    this.fMoveTileToHole = function (row, column) {
        var hole = this.aTiles[this.oHole.row][this.oHole.column];

        this.aTiles[this.oHole.row][this.oHole.column] =
                this.aTiles[row][column];
        this.aTiles[row][column] =
                hole;

        this.oHole.row = row;
        this.oHole.column = column;
    };

    this.fSlide = function (row, column) {
        if (this.vMode !== C_GAME.MODE.SLIDE) {
            return false;
        }
        this.fMoveTileToHole(row, column);
        this.oSlide.vCount++;

        //update maximum steps of swing based on slide steps
        this.vSlideForSwing--;
        if (this.vSlideForSwing === 0) {
            this.oSwing.vMaximum++;
            this.vSlideForSwing = C_GAME.STEP.SLIDE_FOR_SWING;
        }

        //change to swing mode if maximum steps of slide is exceeded
        if (this.oSlide.vCount >= this.oSlide.vMaximum) {
            if (this.oSwing.vCount < this.oSwing.vMaximum) {
                this.vMode = C_GAME.MODE.SWING;
            } else {
                this.vState = C_GAME.STATE.OVER;
            }
        }

        this.fUpdateTilesType();
        this.fUpdateTilesCorrectness();
        this.fUpdateGameState();
        return true;
    };

    this.fSwing = function (row, column) {
        if (this.vMode !== C_GAME.MODE.SWING) {
            return false;
        }

        this.fMoveTileToHole(row, column);
        this.oSwing.vCount++;

        //change to slide mode if maximum steps of swing is exceeded
        if (this.oSwing.vCount >= this.oSwing.vMaximum) {
            if (this.oSlide.vCount < this.oSlide.vMaximum) {
                this.vMode = C_GAME.MODE.SLIDE;
            } else {
                this.vState = C_GAME.STATE.OVER;
            }
        }

        this.fUpdateTilesType();
        this.fUpdateTilesCorrectness();
        this.fUpdateGameState();
        return true;
    };
}