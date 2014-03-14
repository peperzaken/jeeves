/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/14/13
 * @version 0.1
 *
 * This file contains all helper functions needed in our application.
 * Things that belong here are usually function to transform data-structures
 * or proprietary functions belonging to a particular API such as transforming
 * arguments given, etc.
 */

utils = {
    /**
     * View helper function to pad zeroes.
     * @example 0 becomes 00, 1 becomes 01, etc.
     * @param {Number} number - The number to pad.
     * @returns {String|Number}
     */
    padZeroes: function( number ) {
        return number < 10 ? "0" + number : number;
    },

    /**
     * Helper function to serialize an object to correct
     * URL GET parameters.
     * @param {Object} obj - The object to serialize
     * @returns {String} Serialized arguments.
     */
    serializeUrl: function( obj ) {
        var str = "";
        for (var key in obj) {
            if (str != "") {
                str += "&";
            }
            str += key + "=" + obj[key];
        }
        return str;
    },

    /**
     * Given an array of Date objects and a start date,
     * return the entry from the array nearest to the
     * start date but greater than it.
     * Return undefined if no such date is found.
     */
    nextDate: function( startDate, dates ) {
        var startTime = +startDate;
        var nearestDate, nearestDiff = Infinity;
        for( var i = 0, n = dates.length;  i < n;  ++i ) {
            var diff = +dates[i] - startTime;
            if( diff > 0  &&  diff < nearestDiff ) {
                nearestDiff = diff;
                nearestDate = dates[i];
            }
        }
        return nearestDate;
    },

    /**
     * This function creates a date object with a given timezone offset.
     * @param {String} offset - The offset to calculate the current time for.
     * @returns {Date} - The current date at the given offset.
     */
    calcTime: function( offset ) {
        d = new Date();

        //Deal with dates in milliseconds for most accuracy
        var utc = d.getTime() + ( d.getTimezoneOffset() * 60000 );
        var newDateWithOffset = new Date( utc + ( 3600000 * offset ) );

        //This will return the date with the locale format (string), or just return newDateWithOffset
        //and go from there.
        return newDateWithOffset
    },

    /**
     * This function calculates the difference between two dates and
     * converts it to a humanly readable string.
     * @param {Date} aTime - The initial time.
     * @param {Date} bTime - The time to compare to.
     * @returns {String} Human readable time difference between the two dates.
     */
    prettyTimeDiff: (function() {

        var ints = {
            minute: 60,
            hour: 3600,
            day: 86400
        };

        return function(aTime, bTime) {

            aTime = +new Date(aTime);
            bTime = bTime === undefined ? +new Date() : +new Date(bTime);

            var timeGap = Math.abs(bTime - aTime) / 1000,
                amount, measure, remainder, smallest;

            for (var i in ints) {
                if (timeGap > ints[i] && ints[i] > (ints[measure] || 0)) {
                    measure = i;
                }
                if (!smallest || ints[i] < smallest) {
                    smallest = ints[i];
                }
            }

            amount = Math.floor(timeGap / ints[measure]);

            if (timeGap > 31536000) {
                /* Handle leap years */
                timeGap -= Math.floor(ints[measure] * amount / 31536000 / 4) * 86400;
            }

            amount += ' ' + measure  + (amount > 1 ? 's' : '');

            remainder = timeGap % ints[measure];

            if (remainder >= smallest) {
                amount += ', ' + arguments.callee( +new Date() - remainder*1000 );
            }

            return amount;
        };

    })(),

    /**
     * This function takes ms and converts them to seconds/
     * @param {Number} ms - The number of ms to convert.
     * @returns {Number} - Number of seconds.
     */
    toSeconds: function( ms ) {
        return Math.floor( ms / 1000 );
    },

    /**
     * This function checks the given timeslot for correct values.
     * @param {Object} timeSlot - The timeslot to check
     * @returns {boolean} Correct timeslot?
     */
    checkTimeInput: function( timeSlot ) {
        for( key in timeSlot ) {
            var slot = timeSlot[key];
            // Base case: No errors possible
            if(slot == "all")
                continue;
            var splitTimes = slot.split("-");
            var from = splitTimes[0];
            var to = splitTimes[1];

            if( from == "" || to == "" ) {
                FlashMessages.sendError("You must fill in all the days of the week.");
                return false;
            }

            // Get the hours and minutes of the date
            var fromHours = from.split(":")[0],
                fromMinutes = from.split(":")[1];
            var toHours = to.split(":")[0],
                toMinutes = to.split(":")[1];

            // Make a 'from' date object
            var fromDate = new Date();
            fromDate.setHours(fromHours);
            fromDate.setMinutes(fromMinutes);
            fromDate.setSeconds(0);
            fromDate.setMilliseconds(0);

            // Make a 'to' date object
            var toDate = new Date();
            toDate.setHours(toHours);
            toDate.setMinutes(toMinutes);
            toDate.setSeconds(0);
            toDate.setMilliseconds(0);

            if(fromDate > toDate) {
                FlashMessages.sendError("The 'from' field can not be later than the 'to' field.");
                return false;
            }
        }
        return true;
    },

    /**
     * This function is used to gap the bridge between the server timezone
     * and the client timezone. Say, for example, that the server has a
     * timezone offset of +0 (UTC Time) and the client has a timezone offset
     * of -60 (UTC +1, Amsterdam), then saving a timeslot to the database will result
     * in differences. In this example, a slide which should be shown between 11:00-12:00
     * would be shown between 12:00-13:00 because of the timezone difference. This method
     * will fix that, making all timeslot objects UTC standard time (+0).
     * @param {Object} timeSlot - The timeslot object to convert to the correct timezone.
     * @returns {Object} The correct timeslot.
     */
    fixTimezoneDifferences: function( timeSlot ) {
        for( key in timeSlot ) {
            var slot = timeSlot[key];
            if(slot == "all")
                continue;

            var splitTimes = slot.split("-");
            var from = splitTimes[0],
                to = splitTimes[1],
                offset = new Date().getTimezoneOffset();

            // Get the hours and minutes of the date
            var fromHours = parseInt( from.split( ":" )[0] ),
                fromMinutes = from.split(":")[1],
                toHours = parseInt( to.split( ":" )[0]),
                toMinutes = to.split(":")[1];

            var correctFromHours = ( ( fromHours * 60 ) + offset ) / 60,
                correctToHours = ( ( toHours * 60 ) + offset ) / 60;

            // Overflow happened, set the hours to 0, we're not going to overflow in the previous day
            if( correctFromHours < 0 )
                correctFromHours = 0;
            if( correctToHours < 0 )
                correctFromHours = 0;

            if( correctFromHours > 23 )
                correctFromHours = 23;
            if( correctToHours > 23 )
                correctToHours = 23;

            timeSlot[key] = correctFromHours + ":" + fromMinutes + "-" + correctToHours + ":" + toMinutes;
        }
        return timeSlot;
    },

    /**
     * This function converts server timezone to the timezone the client is in.
     * Use this for showing the timeschedules.
     * @param time
     * @returns {String} Time converted to the client's timezone.
     */
    createCorrectClientTime: function( time ) {
        var splitTimes = time.split("-");
        var from = splitTimes[0],
            offset = new Date().getTimezoneOffset();

        // Get the hours and minutes of the date
        var fromHours = parseInt( from.split( ":" )[0] ),
            fromMinutes = from.split(":")[1];

        var correctFromHours = ( ( fromHours * 60 ) - offset ) / 60;

        // Overflow happened, set the hours to 0, we're not going to overflow in the previous day
        if( correctFromHours < 0 )
            correctFromHours = 0;

        if( correctFromHours > 23 )
            correctFromHours = 23;

        return correctFromHours + ":" + fromMinutes;
    }
};

