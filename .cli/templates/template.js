/**
 * This function will be executed on render of the HTML
 * on the page. (http://docs.meteor.com/#template_rendered)
 * This does not mean that the data is ready, this can be
 * done by subscribing to a data set and using the onReady
 * callback. (http://docs.meteor.com/#meteor_subscribe)
 */
Template.$NAME.rendered = function() {
    setTimeout( function() {
        if( $( "#outer-$NAME" ).hasClass( "transitioning" ) ) {
            // NOP
        } else {
            $("#outer-$NAME").addClass("active");
        }
    }, 100);
};
