/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/27/13
 */
Template.rainy.minutesToRain = function() {
    var druppel = Druppel.findOne( { date: utils.calcTime('+1').toDateString() } );
    if( druppel ) {
        return druppel.minutes_to_rain < 0 ? false : druppel.minutes_to_rain;
    }
};

Template.rainy.doesntStopRaining = function() {
    var druppel = Druppel.findOne( { date: utils.calcTime('+1').toDateString() } );
    if( druppel ) {
        return druppel.minutes_to_dry < 0 && druppel.minutes_to_rain < 0;
    }
};