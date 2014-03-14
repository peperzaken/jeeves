/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/27/13
 * @version 0.1
 */
var restify = Meteor.require( 'restify' );

/**
 * This function gets the weather forecast (percentages per 15 minutes)
 * @param {String} long - Longitude to get the precipitation for
 * @param {String} lat - Latitude to get the precipitation for
 */
function getPrecipitation( lat, long ) {
    var client = restify.createJsonClient({
        url: 'http://druppel.nu'
    });

    var params = utils.serializeUrl({
        lat: lat,
        lon: long
    });

    var onComplete = Meteor.bindEnvironment( function( err, req, res, data) {
        // Split on newlines (every new line is another value)
        var values = res.body.split(/\r\n|\r|\n/g);

        // Pop it to remove the empty value (last empty line)
        values.pop();

        var timeNow = new Date();

        for ( var i = 0; i < values.length; i++ ) {
            var value = values[i];
            var timeAndChance = value.split( "|" );
            var chance = parseInt( timeAndChance[0] );
            var time = timeAndChance [1];

            var checkDate = new Date();
            checkDate.setHours( time.split( ":" )[0] );
            checkDate.setMinutes( time.split( ":" )[1] );
            checkDate.setSeconds( 0 );

            // Dingen die we willen weten:
            // - Over hoeveel minuten gaat het regenen?
            // - Als het regent, wanneer stopt het weer?

            if( checkDate.getTime() < timeNow.getTime()  ) {
                continue;
            }
            if( chance > 0 ) {
                // It's already raining.
                var endRain = _.find( values.slice(i, values.length), function( value ) {
                    var timeAndChance = value.split("|");
                    var chance = parseInt(timeAndChance[0]);
                    var time = timeAndChance [1];

                    return chance === 0;
                });

                if( !endRain ) {
                    Druppel.update( { date: new Date().toDateString() }, { $set:
                    {
                        date: new Date().toDateString(),
                        weather_data: values,
                        minutes_to_rain: -1,
                        minutes_to_dry: -1
                    }
                    }, { upsert: true });
                    break;
                }

                // There is a date where the rain will end (luckily for us), get the time untill then
                var time = endRain.split("|")[1];

                var checkDate = new Date();
                checkDate.setHours( time.split( ":" )[0] );
                checkDate.setMinutes( time.split( ":" )[1] );

                // Difference between the two dates in ms.
                var difference = Math.round( Math.abs( timeNow - checkDate ) / 60000 );

                Druppel.update( { date: new Date().toDateString() }, { $set:
                {
                    date: new Date().toDateString(),
                    weather_data: values,
                    minutes_to_rain: difference,
                    minutes_to_dry: 0
                }
                }, { upsert: true });
                break;
            } else {
                // It's not raining yet
                var firstRain = _.find( values.slice(i, values.length), function( value ) {
                    var timeAndChance = value.split("|");
                    var chance = parseInt(timeAndChance[0]);
                    var time = timeAndChance [1];

                    return chance > 0;
                });

                if( !firstRain ) {
                    Druppel.update( { date: new Date().toDateString() }, { $set:
                    {
                        date: new Date().toDateString(),
                        weather_data: values,
                        minutes_to_rain: 0,
                        minutes_to_dry: 0
                    }
                    }, { upsert: true });
                    break;
                }

                // There is a date where the rain will end (luckily for us), get the time untill then
                var time = firstRain.split("|")[1];

                var checkDate = new Date();
                checkDate.setHours( time.split( ":" )[0] );
                checkDate.setMinutes( time.split( ":" )[1] );

                // Difference between the two dates in ms.
                var difference = Math.round( Math.abs( timeNow - checkDate ) / 60000 );

                Druppel.update( { date: new Date().toDateString() }, { $set:
                {
                    date: new Date().toDateString(),
                    weather_data: values,
                    minutes_to_rain: 0,
                    minutes_to_dry: difference
                }
                }, { upsert: true });
                break;
            }
        }
    }, function( err) {
        log.error("Error while getting precipitation results:" + err.toString());
    });

    client.get( '/get_rain.php?' + params, onComplete );
}

Meteor.startup( function() {
    //TODO: Get lat and long from another source
    var defaultLatitude = '53.204237299999996',
        defaultLongitude = '6.589548799999989';

    var latitude = null,
        longitude = null;

    if( !latitude || !longitude ) {
        log.warn("You're still using the default location settings for the druppel slide, " +
            "to change this behaviour set your own values in server/slides/druppel/source.js");
        getPrecipitation( defaultLatitude, defaultLongitude );
        Meteor.setInterval( function() {
            getPrecipitation( '53.204237299999996', '6.589548799999989' );
        }, 10 * 1000);
    } else {
        getPrecipitation( latitude, longitude );
        Meteor.setInterval( function() {
            getPrecipitation( latitude, longitude );
        }, 10 * 1000);
    }
});