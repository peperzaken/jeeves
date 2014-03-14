/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 10/10/13
 * @version 0.1
 */
Meteor.startup(function () {
    // Clean up some collections before booting
    Screens.remove({});

    // Add all the available slides to the scheduler
    Slides.find().forEach( function( slide ) {
        Scheduler.addSlide( new Slide( slide ) );
    });

    Scheduler.populateSlideQueue();

    // Methods to be called by the client
    Meteor.methods({
        /**
         * Method to register a screen into the system.
         * @param {String} name - Name of the screen
         * @param {String} category - The category of slides the screen will show
         * @returns {String} ID of the inserted document
         */
        addScreen: function( name, category ) {
            if ( Screens.find( { name: name } ).count() <= 0 ) {
                log.info( "Screen \"" + name + "\" (" + category + ") added.");
                return Screens.insert( { name: name, category: category, currentSlide: "welcome", nextSlideAt: 0 } );
            } else {
                throw new Meteor.Error(418, "That name is already in use.");
            }
        },
        /**
         * Method to add a slide to the collection of all slides.
         * @param {String} name - Name of the slide
         * @param {String} category - The category of the slide
         * @param {Number} screenTime - Time in ms that the slide should be shown
         * @param {Object} timeSlot - Time slots when the slide should be shown.
         */
        addSlide: function( name, screenTime, category, timeSlot ) {
            if ( Slides.find( { name: name }).count() <= 0 ) {
                log.info( "Slide \"" + name + "\" (" + category + ") added.");
                Scheduler.addSlide( new Slide( name, timeSlot, category, screenTime ) );
                return Slides.insert( { name: name, category: category, screenTime: screenTime, timeSlot: timeSlot } );
            } else {
                throw new Meteor.Error(418, "That name is already in use.");
            }
        }
    });

    /**
     * This function is used to publish new slides to the screens.
     * It works as follows:
     * - Iterate over the active screens
     *      - Iterate over the slides in the slide queue
     *          - Find a fitting slide and show it on the screen
     */
    Meteor.setInterval( function() {
        // Create a correct queue which we can use for slides
        Scheduler.populateSlideQueue();

        // Find all the active screens to iterate over them
        var screens = Screens.find().fetch();
        var numberOfScreens = screens.length;
        for ( var i = 0; i < numberOfScreens; i++ ) {
            // Check to make sure the slide on the screen is expired and the screen needs a new one
            var screen = new Screen( screens[i] );
            if ( screen.isReady() ) {
                for ( var j = 0; j < Scheduler.slideQueue.length; j++ ) {
                    var slide = Scheduler.slideQueue[j];

                    if ( screen.getLastCorrectSlideInQueue().name === slide.name ) {
                        // Reset the slide queue because we've reached the end
                        Screens.update( screen.getId(), {$set: { previousSlides: [] } } );
                        screen.previousSlides = [];
                    }

                    if( screen.isCorrectSlide( slide ) ) {
                        // Push this slide into the previous slide array
                        screen.getPreviousSlides().push( slide.getName() );
                        var previous = screen.getPreviousSlides();
                        // Update the screen to show the slide
                        Screens.update( screen.getId(), { $set: { currentSlide: slide.getName(), nextSlideAt: (new Date().getTime() + slide.getScreenTime()), previousSlides: previous } } );
                        break;
                    }
                }
            }
        }
    }, (10*1000));

    /**
     * We use the 'user-status' package to track the screens (equivalent of users in our application)
     * and we're doing that by creating a user (Account.createUser(...)) for every screen. This way we
     * can use the package in this way to keep track of the online screens. When a screen goes offline,
     * disconnects or quits his account and Screen object will be instantly removed from their
     * respective collection.
     */
    Meteor.users.find( { "profile.online": true }).observe({
        removed: function(doc) {
            Meteor.users.remove(doc._id);
            Screens.remove( { name: doc.profile.name } );
        }
    });

    /**
     * Set up all subscriptions which we will share with the client
     */
    Meteor.publish('druppel', function() {
        return Druppel.find( { date: new Date().toDateString() } );
    });

    Meteor.publish('slides', function() {
        return Slides.find();
    });

    Meteor.publish('screens', function() {
        return Screens.find();
    });

    Meteor.publish( 'availableSlides', function() {
        return AvailableSlides.find();
    });

    /**
     * We need to make sure that there's at least one admin
     * account created to operate the administration panel.
     */
    if( !Meteor.users.findOne( { profile: { admin: true } } ) ) {
        Accounts.createUser( { username: "admin", password: "admin", profile: { admin: true } } );
        log.info("Created superuser 'admin' with password 'admin'.");
    }
});