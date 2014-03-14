/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 12/5/13
 * @version 0.1
 */

/**
 * Get all the weather entries, neatly formatted.
 * @returns {Array} All weather entries
 */
Template.weatherTimeline.weatherEntries = function() {
    var druppel = Druppel.findOne( { date: utils.calcTime('+1').toDateString() } );
    if( druppel ) {
        var i = -1;
        var weatherEntries = _.map( druppel.weather_data, function( entry ) {
            var data = entry.split( "|" );
            var chance = parseInt( data[0] );
            var time = data[1];
            i++;
            return { index: i, chance: chance, time: time };
        });
        return weatherEntries;
    }
};

/**
 * Helper function to check if the current weather entry predicts rain.
 * @param {Object} entry - A weather entry
 * @returns {Boolean} Rain predicted?
 */
Template.weatherTimeline.raining = function( entry ) {
    return entry.chance > 0;
};

/**
 * Checks whether a given weather entry is about the present moment
 * @param {Object} entry - A weather entry
 * @returns {Boolean} Now?
 */
Template.weatherTimeline.now = function( entry ) {
    var now = utils.calcTime('+1');

    var timeUnits = entry.time.split( ":" );
    var entryTime = utils.calcTime('+1');
    entryTime.setHours( timeUnits[0] );
    entryTime.setMinutes( timeUnits[1] );
    entryTime.setSeconds(0);

    var upperBound = entryTime.getTime() + (1000 * 60 * 5);

    return now.getTime() > entryTime.getTime() && now.getTime() < upperBound;
};

/**
 * Checks if there is no predicted rain
 * @param {Object} entry - A weather entry
 * @returns {Boolean} Will it stay dry?
 */
Template.weatherTimeline.noRain = function( entry ) {
    return entry.chance <= 0;
};

/**
 * Helper function which outputs a CSS class based on the
 * weather conditions.
 * @returns {String} CSS Class to use in an HTML element
 */
Template.weatherTimeline.backgroundClass = function() {
    if( Template.druppel.staysClear() || Template.druppel.minutesToDry() ) {
        return 'sunny-div'
    } else if( Template.druppel.doesntStopRaining() || Template.druppel.minutesToRain() ) {
        return 'rainy-div'
    }
};

/**
 * Checks if a weather entry is either 15, 30, 45 or 00 minutes into the hour
 * @param {Object} entry - A weather entry
 * @returns {Boolean} Is it 15, 30, 45 or 00 minutes?
 */
Template.weatherTimeline.isQuarter = function( entry ) {
    var timeUnits = entry.time.split( ":" );
    var entryTime = utils.calcTime('+1');
    entryTime.setHours( timeUnits[0] );
    entryTime.setMinutes( timeUnits[1] );
    entryTime.setSeconds(0);

    return timeUnits[1] === "15" || timeUnits[1] === "30" ||timeUnits[1] === "45" ||timeUnits[1] === "00";
};