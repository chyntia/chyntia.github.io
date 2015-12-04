/*******************************************************************************
 * C O N T R O L L E R
 ******************************************************************************/
function Controller() {

    /*==========================================================================
     * Object
     */
    this.oDimension = {
        row: 3,
        column: 3
    };
    this.oTile = {
        width: 0,
        height: 0
    };

    /*==========================================================================
     * Array
     */
    this.aPositionTop = [];
    this.aPositionLeft = [];

    /*==========================================================================
     * Function
     */
    this.fInit = function () {
        if (typeof $.cookie("controller_oDimension_row") !== "undefined") {
            this.fLoad();
        }

        game = new Game(this.oDimension.row, this.oDimension.column);
        game.fInit();

        this.fSave();
        this.fRender();

        game.fUnlockGame();
    };

    this.fNew = function (numRows, numColumns) {
        if (numRows !== 0 && numColumns !== 0) {
            this.oDimension.row = numRows;
            this.oDimension.column = numColumns;
        }
        game = new Game(this.oDimension.row, this.oDimension.column);
        game.fNew();

        this.fSave();
        this.fRender();

        game.fUnlockGame();
    };

    this.fLoad = function () {
        this.oDimension.row = $.cookie("controller_oDimension_row");
        this.oDimension.column = $.cookie("controller_oDimension_column");
    };

    this.fSave = function () {
        var option = {expires: C_GAME.COOKIE.EXPIRES};

        $.cookie("controller_oDimension_row", this.oDimension.row, option);
        $.cookie("controller_oDimension_column", this.oDimension.column, option);
    };

    this.fRender = function () {
        $(".board").empty();
        this.fCalculateSize();
        this.fCalculatePosition();
        this.fRenderBoard();
        this.fRenderControl();
    };

    this.fCalculateSize = function () {
        var width = $(".board").width();
        var height = $(".board").width();

        var innerSpaceColumn = 2 * (game.oDimension.column - 1);
        var innerSpaceRow = 2 * (game.oDimension.row - 1);

        this.oTile.width =
                (width - innerSpaceColumn * C_CONTROLLER.BORDER_WIDTH) /
                game.oDimension.column;
        this.oTile.height =
                (height - innerSpaceRow * C_CONTROLLER.BORDER_WIDTH) /
                game.oDimension.row;
    };

    this.fCalculatePosition = function () {
        this.aPositionTop[0] = 0;
        for (var i = 1; i < game.oDimension.row; i++) {
            this.aPositionTop[i] = this.aPositionTop[i - 1] + this.oTile.height +
                    2 * C_CONTROLLER.BORDER_WIDTH;
        }

        this.aPositionLeft[0] = 0;
        for (var i = 1; i < game.oDimension.column; i++) {
            this.aPositionLeft[i] = this.aPositionLeft[i - 1] + this.oTile.width +
                    2 * C_CONTROLLER.BORDER_WIDTH;
        }
    };

    this.fRenderBoard = function () {
        var $board = $(".board");

        for (var i = 0; i < game.oDimension.row; i++) {
            for (var j = 0; j < game.oDimension.column; j++) {
                var $tile = $("<div class='tile'><span>" + game.aTiles[i][j].vId + "</span></div>");
                this.fUpdateTileIndex($tile, i, j);
                this.fUpdateTileClass($tile, i, j);
                $tile.css({
                    top: this.aPositionTop[i],
                    left: this.aPositionLeft[j],
                    width: this.oTile.width,
                    height: this.oTile.height
                });
                $tile.appendTo($board);
            }
        }

        this.fUpdateGameState();
    };

    this.fRenderControl = function () {
        $(".control .slide .button").data("mode", C_GAME.MODE.SLIDE);
        $(".control .swing .button").data("mode", C_GAME.MODE.SWING);
    };

    this.fRenderEndGame = function () {
        switch (game.vState) {
            case C_GAME.STATE.OVER:
                $(".share .ui.success.message").addClass("hidden");
                $(".over").show();
                $(".complete").hide();
                $(".game.end.ui.modal").modal("show");
                break;
            case C_GAME.STATE.COMPLETE:
                $(".share .ui.success.message").addClass("hidden");
                $(".complete").show();
                $(".over").hide();
                $(".game.end.ui.modal").modal("show");
                break;
            default:
                break;
        }
    };

    this.fUpdate = function () {
        for (var i = 0; i < game.oDimension.row; i++) {
            for (var j = 0; j < game.oDimension.column; j++) {
                var $tile = $($(".row-" + i + ".column-" + j)[0]);
                this.fUpdateTileClass($tile, i, j);
            }
        }
        this.fUpdateGameState();
    };

    this.fUpdateTileIndex = function ($tile, i, j) {
        var row = $tile.data("row");
        var column = $tile.data("column");

        $tile.removeClass("row-" + row);
        $tile.removeClass("column-" + column);

        $tile.data("row", i);
        $tile.data("column", j);

        $tile.addClass("row-" + i);
        $tile.addClass("column-" + j);
    };

    this.fUpdateTileClass = function ($tile, i, j) {
        //tile type
        $tile.removeClass("common");
        $tile.removeClass("neighbor");
        $tile.removeClass("hole");

        switch (game.aTiles[i][j].vType) {
            case C_TILE.TYPE.COMMON:
                $tile.addClass("common");
                break;
            case C_TILE.TYPE.NEIGHBOR:
                $tile.addClass("neighbor");
                break;
            case C_TILE.TYPE.HOLE:
                $tile.addClass("hole");
                break;
            default:
                break;
        }

        //tile correctness
        $tile.removeClass("correct");
        $tile.removeClass("incorrect");

        switch (game.aTiles[i][j].vCorrectness) {
            case C_TILE.CORRECTNESS.CORRECT:
                $tile.addClass("correct", "slow");
                break;
            case C_TILE.CORRECTNESS.INCORRECT:
                $tile.addClass("incorrect", "slow");
                break;
        }
    };

    this.fUpdateGameState = function () {
        //update score 
        $(".score .value").text(game.vScore);

        //update steps
        $(".control .slide .count").text(game.oSlide.vCount);
        $(".control .slide .maximum").text(game.oSlide.vMaximum);
        $(".control .swing .count").text(game.oSwing.vCount);
        $(".control .swing .maximum").text(game.oSwing.vMaximum);

        //enable/disable slide button based on steps
        if (game.oSlide.vCount < game.oSlide.vMaximum) {
            $(".control .slide .button").removeClass("disabled");
            $(".control .slide .button").addClass("enabled");
        } else {
            $(".control .slide .button").removeClass("enabled");
            $(".control .slide .button").addClass("disabled");
        }

        //enable/disable swing button based on steps
        if (game.oSwing.vCount < game.oSwing.vMaximum) {
            $(".control .swing .button").removeClass("disabled");
            $(".control .swing .button").addClass("enabled");
        } else {
            $(".control .swing .button").removeClass("enabled");
            $(".control .swing .button").addClass("disabled");
        }

        //display active mode
        $(".control .button.active").removeClass("active");
        switch (game.vMode) {
            case C_GAME.MODE.SLIDE:
                $(".control .slide .button").addClass("active");
                break;
            case C_GAME.MODE.SWING:
                $(".control .swing .button").addClass("active");
                break;
            default:
                break;
        }
    };

    this.fUpdateGameMode = function ($selectedMode) {
        var mode = $selectedMode.data("mode");
        var result = game.fUpdateGameMode(mode);

        if (result) {
            $(".control .button.active").removeClass("active");
            switch (result) {
                case C_GAME.MODE.SLIDE:
                    $(".control .slide .button").addClass("active");
                    break;
                case C_GAME.MODE.SWING:
                    $(".control .swing .button").addClass("active");
                    break;
            }
        }
        game.fUnlockGame();
    };

    this.fSlide = function ($neighbor, $hole) {
        //validation: only neighbor tiles may slide
        if (!$neighbor.hasClass("neighbor")) {
            game.fUnlockGame();
            return false;
        }

        var neighborRow = $neighbor.data("row");
        var neighborColumn = $neighbor.data("column");

        var holeRow = $hole.data("row");
        var holeColumn = $hole.data("column");

        var result = game.fSlide(neighborRow, neighborColumn);

        if (result) {
            $neighbor = $(".row-" + neighborRow + ".column-" + neighborColumn);
            $hole = $(".row-" + holeRow + ".column-" + holeColumn);

            this.fUpdateTileIndex($neighbor, holeRow, holeColumn);
            this.fUpdateTileIndex($hole, neighborRow, neighborColumn);

            this.fUpdate();
            this.fAnimate($neighbor, $hole);
        }
    };

    this.fSwing = function ($tile, $hole) {
        var tileRow = $tile.data("row");
        var tileColumn = $tile.data("column");

        var holeRow = $hole.data("row");
        var holeColumn = $hole.data("column");

        var result = game.fSwing(tileRow, tileColumn);

        if (result) {
            $tile = $(".row-" + tileRow + ".column-" + tileColumn);
            $hole = $(".row-" + holeRow + ".column-" + holeColumn);

            this.fUpdateTileIndex($tile, holeRow, holeColumn);
            this.fUpdateTileIndex($hole, tileRow, tileColumn);

            this.fUpdate();
            this.fAnimate($tile, $hole);
        }
    };

    this.fAnimate = function ($tile, $hole) {
        var tileTop = $tile.css("top");
        var tileLeft = $tile.css("left");

        var holeTop = $hole.css("top");
        var holeLeft = $hole.css("left");

        $hole.animate({
            top: tileTop,
            left: tileLeft
        }, 0);

        $tile.animate({
            top: holeTop,
            left: holeLeft
        }, {
            duration: 500,
            complete: function () {
                game.fUnlockGame();
                controller.fRenderEndGame();
            }
        });
    };

}
