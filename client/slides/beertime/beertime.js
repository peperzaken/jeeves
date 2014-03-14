/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 12/3/13
 */
Template.beertime.rendered = function() {
    Meteor.setTimeout( function() {
        if( $( "#outer-beertime" ).hasClass( "transitioning" ) ) {
        } else {
            $("#outer-beertime").addClass("active");
        }
    }, 100);
};

/**
 * This god function returns a CSS class based
 * on the current time. This class corresponds
 * to the current state of the beer glass.
 * @returns {String} CSS Class for animation
 */
Template.beertime.animationClass = function() {

    var twelveTwelve = utils.calcTime('+1');
    twelveTwelve.setHours(12);
    twelveTwelve.setMinutes(12);
    twelveTwelve.setSeconds(0);

    var twelveTwentyfour = utils.calcTime('+1');
    twelveTwentyfour.setHours(12);
    twelveTwentyfour.setMinutes(24);
    twelveTwentyfour.setSeconds(0);

    var twelveThirtysix = utils.calcTime('+1');
    twelveThirtysix.setHours(12);
    twelveThirtysix.setMinutes(36);
    twelveThirtysix.setSeconds(0);

    var twelveFortyeight = utils.calcTime('+1');
    twelveFortyeight.setHours(12);
    twelveFortyeight.setMinutes(48);
    twelveFortyeight.setSeconds(0);

    var thirteen = utils.calcTime('+1');
    thirteen.setHours(13);
    thirteen.setMinutes(0);
    thirteen.setSeconds(0);

    var thirteenTwelve = utils.calcTime('+1');
    thirteenTwelve.setHours(13);
    thirteenTwelve.setMinutes(12);
    thirteenTwelve.setSeconds(0);

    var thirteenTwentyfour = utils.calcTime('+1');
    thirteenTwentyfour.setHours(13);
    thirteenTwentyfour.setMinutes(24);
    thirteenTwentyfour.setSeconds(0);

    var thirteenThirtysix = utils.calcTime('+1');
    thirteenThirtysix.setHours(13);
    thirteenThirtysix.setMinutes(36);
    thirteenThirtysix.setSeconds(0);

    var thirteenFortyeight = utils.calcTime('+1');
    thirteenFortyeight.setHours(13);
    thirteenFortyeight.setMinutes(48);
    thirteenFortyeight.setSeconds(0);

    var fourteen = utils.calcTime('+1');
    fourteen.setHours(14);
    fourteen.setMinutes(0);
    fourteen.setSeconds(0);

    var fourteenTwelve = utils.calcTime('+1');
    fourteenTwelve.setHours(14);
    fourteenTwelve.setMinutes(12);
    fourteenTwelve.setSeconds(0);

    var fourteenTwentyfour = utils.calcTime('+1');
    fourteenTwentyfour.setHours(14);
    fourteenTwentyfour.setMinutes(24);
    fourteenTwentyfour.setSeconds(0);

    var fourteenThirtysix = utils.calcTime('+1');
    fourteenThirtysix.setHours(14);
    fourteenThirtysix.setMinutes(36);
    fourteenThirtysix.setSeconds(0);

    var fourteenFortyeight = utils.calcTime('+1');
    fourteenFortyeight.setHours(14);
    fourteenFortyeight.setMinutes(48);
    fourteenFortyeight.setSeconds(0);

    var fifteen = utils.calcTime('+1');
    fifteen.setHours(15);
    fifteen.setMinutes(0);
    fifteen.setSeconds(0);

    var fifteenTwelve = utils.calcTime('+1');
    fifteenTwelve.setHours(15);
    fifteenTwelve.setMinutes(12);
    fifteenTwelve.setSeconds(0);

    var fifteenTwentyfour = utils.calcTime('+1');
    fifteenTwentyfour.setHours(15);
    fifteenTwentyfour.setMinutes(24);
    fifteenTwentyfour.setSeconds(0);

    var fifteenThirtysix = utils.calcTime('+1');
    fifteenThirtysix.setHours(15);
    fifteenThirtysix.setMinutes(36);
    fifteenThirtysix.setSeconds(0);

    var fifteenFortyeight = utils.calcTime('+1');
    fifteenFortyeight.setHours(15);
    fifteenFortyeight.setMinutes(48);
    fifteenFortyeight.setSeconds(0);

    var sixteen = utils.calcTime('+1');
    sixteen.setHours(16);
    sixteen.setMinutes(0);
    sixteen.setSeconds(0);

    var beerDates = [
        twelveTwelve,
        twelveTwentyfour,
        twelveThirtysix,
        twelveFortyeight,
        thirteen,
        thirteenTwelve,
        thirteenTwentyfour,
        thirteenThirtysix,
        thirteenFortyeight,
        fourteen,
        fourteenTwelve,
        fourteenTwentyfour,
        fourteenThirtysix,
        fourteenFortyeight,
        fifteen,
        fifteenTwelve,
        fifteenTwentyfour,
        fifteenThirtysix,
        fifteenFortyeight,
        sixteen
    ];

    var now = utils.calcTime('+1');
    var beerDate = utils.nextDate(now, beerDates);

    // Base case: It's already later then 16:00, show a full glass.
    if( ! beerDate ) {
        return "animation:fillBeer-16-00 5s, bubbleUp-16-00 3.5s 5s infinite ease;\
                    -webkit-animation:fillBeer-16-00 5s, bubbleUp-16-00 3.5s 5s infinite ease;";
    }

    switch( beerDate.getTime() ) {
        case twelveTwelve.getTime():
            return "animation:fillBeer-12-12 5s, bubbleUp-12-12 3.5s 5s infinite ease;\
                    -webkit-animation:fillBeer-12-12 5s, bubbleUp-12-12 3.5s 5s infinite ease;";
            break;
        case twelveTwentyfour.getTime():
            return "animation:fillBeer-12-24 5s, bubbleUp-12-24 3.5s 5s infinite ease;\
                    -webkit-animation:fillBeer-12-24 5s, bubbleUp-12-24 3.5s 5s infinite ease;";
            break;
        case twelveThirtysix.getTime():
            return "animation:fillBeer-12-36 5s, bubbleUp-12-36 3.5s 5s infinite ease;\
                    -webkit-animation:fillBeer-12-36 5s, bubbleUp-12-36 3.5s 5s infinite ease;";
            break;
        case twelveFortyeight.getTime():
            return "animation:fillBeer-12-48 5s, bubbleUp-12-48 3.5s 5s infinite ease;\
                    -webkit-animation:fillBeer-12-48 5s, bubbleUp-12-48 3.5s 5s infinite ease;";
            break;
        case thirteen.getTime():
            return "animation:fillBeer-13-00 5s, bubbleUp-13-00 3.5s 5s infinite ease;\
                    -webkit-animation:fillBeer-13-00 5s, bubbleUp-13-00 3.5s 5s infinite ease;";
            break;
        case thirteenTwelve.getTime():
            return "animation:fillBeer-13-12 5s, bubbleUp-13-12 3.5s 5s infinite ease;\
                    -webkit-animation:fillBeer-13-12 5s, bubbleUp-13-12 3.5s 5s infinite ease;";
            break;
        case thirteenTwentyfour.getTime():
            return "animation:fillBeer-13-24 5s, bubbleUp-13-24 3.5s 5s infinite ease;\
                    -webkit-animation:fillBeer-13-24 5s, bubbleUp-13-24 3.5s 5s infinite ease;";
            break;
        case thirteenThirtysix.getTime():
            return "animation:fillBeer-13-36 5s, bubbleUp-13-36 3.5s 5s infinite ease;\
                    -webkit-animation:fillBeer-13-36 5s, bubbleUp-13-36 3.5s 5s infinite ease;";
            break;
        case thirteenFortyeight.getTime():
            return "animation:fillBeer-13-48 5s, bubbleUp-13-48 3.5s 5s infinite ease;\
                    -webkit-animation:fillBeer-13-48 5s, bubbleUp-13-48 3.5s 5s infinite ease;";
            break;
        case fourteen.getTime():
            return "animation:fillBeer-14-00 5s, bubbleUp-14-00 3.5s 5s infinite ease;\
                    -webkit-animation:fillBeer-14-00 5s, bubbleUp-14-00 3.5s 5s infinite ease;";
            break;
        case fourteenTwelve.getTime():
            return "animation:fillBeer-14-12 5s, bubbleUp-14-12 3.5s 5s infinite ease;\
                    -webkit-animation:fillBeer-14-12 5s, bubbleUp-14-12 3.5s 5s infinite ease;";
            break;
        case fourteenTwentyfour.getTime():
            return "animation:fillBeer-14-24 5s, bubbleUp-14-24 3.5s 5s infinite ease;\
                    -webkit-animation:fillBeer-14-24 5s, bubbleUp-14-24 3.5s 5s infinite ease;";
            break;
        case fourteenThirtysix.getTime():
            return "animation:fillBeer-14-36 5s, bubbleUp-14-36 3.5s 5s infinite ease;\
                    -webkit-animation:fillBeer-14-36 5s, bubbleUp-14-36 3.5s 5s infinite ease;";
            break;
        case fourteenFortyeight.getTime():
            return "animation:fillBeer-14-48 5s, bubbleUp-14-48 3.5s 5s infinite ease;\
                    -webkit-animation:fillBeer-14-48 5s, bubbleUp-14-48 3.5s 5s infinite ease;";
            break;
        case fifteen.getTime():
            return "animation:fillBeer-15-00 5s, bubbleUp-15-00 3.5s 5s infinite ease;\
                    -webkit-animation:fillBeer-15-00 5s, bubbleUp-15-00 3.5s 5s infinite ease;";
            break;
        case fifteenTwelve.getTime():
            return "animation:fillBeer-15-12 5s, bubbleUp-15-12 3.5s 5s infinite ease;\
                    -webkit-animation:fillBeer-15-12 5s, bubbleUp-15-12 3.5s 5s infinite ease;";
            break;
        case fifteenTwentyfour.getTime():
            return "animation:fillBeer-15-24 5s, bubbleUp-15-24 3.5s 5s infinite ease;\
                    -webkit-animation:fillBeer-15-24 5s, bubbleUp-15-24 3.5s 5s infinite ease;";
            break;
        case fifteenThirtysix.getTime():
            return "animation:fillBeer-15-36 5s, bubbleUp-15-36 3.5s 5s infinite ease;\
                    -webkit-animation:fillBeer-15-36 5s, bubbleUp-15-36 3.5s 5s infinite ease;";
            break;
        case fifteenFortyeight.getTime():
            return "animation:fillBeer-15-48 5s, bubbleUp-15-48 3.5s 5s infinite ease;\
                    -webkit-animation:fillBeer-15-48 5s, bubbleUp-15-48 3.5s 5s infinite ease;";
            break;
        case sixteen.getTime():
            return "animation:fillBeer-16-00 5s, bubbleUp-16-00 3.5s 5s infinite ease;\
                    -webkit-animation:fillBeer-16-00 5s, bubbleUp-16-00 3.5s 5s infinite ease;";
            break;
    }
};