/*******************************************************************************
 * F A C E B O O K
 ******************************************************************************/
function Facebook() {

    /*==========================================================================
     * Function
     */
    this.fInit = function () {
        $.getScript("//connect.facebook.net/en_US/sdk.js");
    };

    this.fShare = function () {
        FB.init({
            appId: "169906490031008",
            xfbml: true,
            version: "v2.5"
        });
        FB.getLoginStatus(function (response) {
            if (response.status === "connected") {
                facebook.fFeed();
            } else {
                FB.login(function () {
                    facebook.fFeed();
                }, {scope: "public_profile,user_friends"});
            }
        });
    };

    this.fFeed = function () {
        FB.ui({
            method: "feed",
            link: C_APPLICATION.URL,
            picture: C_APPLICATION.ICON,
            caption: "Zling Puzzle",
            description: "I scored " + game.vScore + " at Zling Puzzle. Can you beat me?"
        }, function (response) {
            if (response !== null) {
                if (typeof response.post_id !== "undefined") {
                    $(".share .ui.success.message .media").text("Facebook");
                    $(".share .ui.success.message").removeClass("hidden");
                }
            }
        });
    };
}