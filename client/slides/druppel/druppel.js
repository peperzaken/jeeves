/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/27/13
 */

// Set up subscriptions
Meteor.subscribe('druppel');

/**
 * Check if there is rain upcoming
 * @returns {Boolean} Rain upcoming?
 */
Template.druppel.minutesToRain = function() {
    var druppel = Druppel.findOne( { date: utils.calcTime('+1').toDateString() } );
    if( druppel ) {
        return druppel.minutes_to_rain < 0 ? false : druppel.minutes_to_rain;
    }
};

/**
 * Checks if a dry period is upcoming.
 * @returns {Boolean} Dry period upcoming?
 */
Template.druppel.minutesToDry = function() {
    var druppel = Druppel.findOne( { date: utils.calcTime('+1').toDateString() } );
    if( druppel ) {
        return druppel.minutes_to_dry < 0 ? false : druppel.minutes_to_dry;
    }
};

/**
 * Checks if it doesnt stop raining for at least two hours
 * @returns {Boolean} Doesn't stop raining?
 */
Template.druppel.doesntStopRaining = function() {
    var druppel = Druppel.findOne( { date: utils.calcTime('+1').toDateString() } );
    if( druppel ) {
        return druppel.minutes_to_dry < 0 && druppel.minutes_to_rain < 0;
    }
};

/**
 * Checks whether the weather stays clear
 * @returns {Boolean} Will it stay clear?
 */
Template.druppel.staysClear = function() {
    var druppel = Druppel.findOne( { date: utils.calcTime('+1').toDateString() } );
    if( druppel ) {
        return druppel.minutes_to_dry === 0 && druppel.minutes_to_rain === 0;
    }
};

/**
 * Returns a different CSS class depending on the weather.
 * @returns {String} CSS Class to use in an HTML element
 */
Template.druppel.backgroundClass = function() {
    if( Template.druppel.staysClear() || Template.druppel.minutesToDry() ) {
        return 'center-row-druppel-sunny'
    } else if( Template.druppel.doesntStopRaining() || Template.druppel.minutesToRain() ) {
        return 'center-row-druppel-rainy'
    }
};

Template.druppel.rendered = function() {
    Meteor.setTimeout( function() {
        if( $( "#outer-druppel" ).hasClass( "transitioning" ) ) {
        } else {
            $("#outer-druppel").addClass("active");
        }
    }, 100);
};