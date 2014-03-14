/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 01/30/14
 * @version 0.1
 */

/**
 * Creates a reactive data source for finding out which slides have not yet been added to
 * the system.
 */
function getSlidesInClientMap() {
    var onComplete = Meteor.bindEnvironment(function( slides ) {
        AvailableSlides.upsert( { "pk": 1 }, { $set: { availableSlides: slides } } );
    }, function( err ) {
        log.error("Error while getting available slides for admin panel: " + err.toString());
    });

    var fs = Meteor.require('fs');

    // This is the path used for running localhost (non bundled)
    var localPath = '../../../../../client/slides/';

    // This is the path for external, bundled meteor apps
    var externalPath = "../client/app/slides";

    // If program.json exists in this director structure, it means we're running on a deployed application.
    if (fs.existsSync(externalPath)) {
        var slides = fs.readdirSync(externalPath);
        onComplete( slides );
    } else {
        var slides = fs.readdirSync(localPath);
        onComplete( slides );
    }

    // Call it this way so we can use the collection variables from Meteor.
    onComplete( slides );
}

// Setup polling for new data
Meteor.startup(function() {
    getSlidesInClientMap();
    Meteor.setInterval(getSlidesInClientMap, 30 * 1000);
});
