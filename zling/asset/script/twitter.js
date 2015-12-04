/*******************************************************************************
 * T W I T T E R
 ******************************************************************************/
function Twitter() {

    /*==========================================================================
     * Function
     */
    this.fShare = function () {
        var url = "http://twitter.com/share";
        url += "?url=" + C_APPLICATION.URL;
        url += "&text=I scored " + game.vScore + " at Zling Puzzle. Can you beat me?";
        url += "&hashtags=ZlingPuzzle";
        $(".twitter.button").attr("href", url);
    };

}