/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/27/13
 */

Template.sunny.minutesToDry = function() {
    var druppel = Druppel.findOne( { date: utils.calcTime('+1').toDateString() } );
    if( druppel ) {
        return druppel.minutes_to_dry < 0 ? false : druppel.minutes_to_dry;
    }
};

Template.sunny.staysClear = function() {
    var druppel = Druppel.findOne( { date: utils.calcTime('+1').toDateString() } );
    if( druppel ) {
        return druppel.minutes_to_dry === 0 && druppel.minutes_to_rain === 0;
    }
};