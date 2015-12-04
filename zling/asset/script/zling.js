/*******************************************************************************
 * G L O B A L   O B J E C T
 ******************************************************************************/
var controller = new Object();
var game = new Object();
var facebook = new Object();
var twitter = new Object();
/*******************************************************************************
 * I N I T I A L I Z A T I O N
 ******************************************************************************/
$.when(
        $.getScript("asset/script/constant.js"),
        $.getScript("asset/script/tile.js"),
        $.getScript("asset/script/step.js"),
        $.getScript("asset/script/game.js"),
        $.getScript("asset/script/controller.js"),
        $.getScript("asset/script/facebook.js"),
        $.getScript("asset/script/twitter.js"),
        $.Deferred(function (deferred) {
            $(deferred.resolve);
        })
        ).done(function () {

    controller = new Controller();
    controller.fInit();

    facebook = new Facebook();
    facebook.fInit();

    twitter = new Twitter();

    $(".game.miscellaneous.ui.modal").modal("setting", "transition", "horizontal flip");
    $(".game.miscellaneous.ui.modal").modal("attach events", ".trigger.button");
    $(".ui.menu .item").tab();
    $(".dimension.ui.checkbox").checkbox();
});
/*******************************************************************************
 * E V E N T   H A N D L E R
 ******************************************************************************/
$(document).ready(function () {

    /*==========================================================================
     * Window
     */
    $(window).on("resize", function () {
        controller.fRender();
    });

    /*==========================================================================
     * Page > Tool
     */

    //Replay Button
    $(".tool").on("click", ".replay.button", function () {
        game.fLockGame();
        controller.fNew(0, 0);
    });

    //Options Button
    $(".tool").on("click", ".options.button", function () {
        $(".ui.menu .item").removeClass("active");
        $.tab("change tab", "options");
        $(".options.item").addClass("active");
        $(".dimension.ui.checkbox").checkbox("uncheck");
        if (controller.oDimension.row === controller.oDimension.column) {
            var dimension = controller.oDimension.row;
            $(".dimension-" + dimension).checkbox("check");
        }
        $(".game.miscellaneous.ui.modal").modal("refresh");
    });

    //Help Button
    $(".tool").on("click", ".help.button", function () {
        $(".ui.menu .item").removeClass("active");
        $.tab("change tab", "help");
        $(".help.item").addClass("active");
        $(".game.miscellaneous.ui.modal").modal("refresh");
    });

    //About Button
    $(".tool").on("click", ".about.button", function () {
        $(".share .ui.success.message").addClass("hidden");
        $(".ui.menu .item").removeClass("active");
        $.tab("change tab", "about");
        $(".about.item").addClass("active");
        $(".game.miscellaneous.ui.modal").modal("refresh");
    });

    /*==========================================================================
     * Page > Control
     */
    $(".control").on("click", ".enabled", function () {
        if (game.vState !== C_GAME.STATE.USER_ACTION) {
            return false;
        }
        game.fLockGame();
        controller.fUpdateGameMode($(this));
    });

    /*==========================================================================
     * Page > Board
     */
    $(".board").on("click", ".tile:not(.hole)", function () {
        if (game.vState !== C_GAME.STATE.USER_ACTION) {
            return false;
        }
        game.fLockGame();
        switch (game.vMode) {
            case C_GAME.MODE.SLIDE:
                controller.fSlide($(this), $(".hole"));
                break;
            case C_GAME.MODE.SWING:
                controller.fSwing($(this), $(".hole"));
                break;
            default:
                break;
        }
    });

    /*==========================================================================
     * Game End Modal
     */

    //Replay Button 
    $(".game.end").on("click", ".replay.button", function () {
        game.fLockGame();
        controller.fNew(0, 0);
        $(".game.end.ui.modal").modal("hide");
    });

    /*==========================================================================
     * Game Miscellaneous Modal > Options
     */

    //Save and Apply Button
    $(".game.miscellaneous").on("click", ".save.button", function () {
        game.fLockGame();
        var dimension = $(".dimension.ui.checkbox.checked").data("dimension");
        controller.fNew(dimension, dimension);
        $(".game.miscellaneous.ui.modal").modal("hide");
    });

    //Cancel Button
    $("body").on("click", ".cancel.button", function () {
        $(".game.miscellaneous.ui.modal").modal("hide");
    });

    /*==========================================================================
     * Game End / Game Miscellaneous Modal 
     */

    //Facebook Button
    $(".ui.modal").on("click", ".facebook.button", function () {
        facebook.fShare();
    });

    //Twitter Button
    $(".ui.modal").on("click", ".twitter.button", function () {
        twitter.fShare();
    });

    /*==========================================================================
     * Message
     */
    $(".message .close").on("click", function () {
        $(this).closest(".message").transition("fly down");
    });
});