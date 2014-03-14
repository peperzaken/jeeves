/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 10/14/13
 * @version 0.1
 *
 * This file is used to register global functions used
 * in a variety of templates. If there's a function you need
 * to write for multiple templates, do it here.
 */

/**
 * Set up the subscriptions, for examples to slides.
 */
Meteor.subscribe('slides');
Meteor.subscribe('screens');

/**
 * This helper should be used on every slide. It loads a slide based
 * on the value of Session.get('currentSlide'). It takes the name
 * of the template as an argument to not end up in a recursive loop.
 * @example {{current_slide "mySlide"}}
 */
Handlebars.registerHelper( 'current_slide', function( slide ) {
    var screen = Screens.findOne( amplify.store( 'screenId' ) );
    if( screen ) {
        if( screen.hasOwnProperty("currentSlide") && screen.currentSlide !== slide ) {
            $("div[id^='outer']").each(function( index, item ) {
                $(item).removeClass("active");
                $(item).addClass("transitioning");
            });

            setTimeout(function() {
                // Reset the countdown timer for the next slide.
                var now = new Date().getTime();
                var difference = screen.nextSlideAt - now;
                var seconds = utils.toSeconds( difference );

                Session.set( 'totalCountdownTime', seconds );
                Router.go(screen.currentSlide, {}, {replaceState:true});
            }, 2000);
        }
    }

    if( !screen && amplify.store( "screenSettings" ) ) {
        // A browser refresh happened and the screen didn't get re-registered.
        var settings = amplify.store( "screenSettings" );
        addScreen( settings.name, settings.category, settings.rememberMe, function( err ) {
            Accounts.createUser( { username: Random.id(), password: Random.id(), profile: { name: name } } );
        });
    }
});

/**
 * This helper should be used to check if a user has administrator access.
 */
Handlebars.registerHelper( 'isAdmin', function() {
    var user = Meteor.user();
    if( user ) {
        try {
            return user.profile.admin;
        } catch ( e ) {
            // NOP
        }
    }
});

/**
 * This helper redirects the user to the admin page.
 */
Handlebars.registerHelper( 'redirectToLogin', function() {
    Router.go( "admin" );
});

/**
 * Adds a screen to the scheduler, making it active in the system.
 * @param {String} name - The name of the screen
 * @param {String} category - The category of the screen
 * @param {Boolean} rememberMe - Whether someone wants to be remembered on our website
 * @param {Function} callback - The callback to execute once it's finished.
 */
addScreen = function addScreen( name, category, rememberMe, callback ) {
    // Register the screen
    Meteor.call( "addScreen", name, category, function( err, id ) {
        if ( err ) {
            callback( err );
        }
        if ( rememberMe ) {
            var screenSettings =
            {
                name: name,
                category: category,
                rememberMe: rememberMe
            };
            amplify.store( "screenSettings", screenSettings );
        }
        amplify.store('screenId', id);
        Router.go('welcome', {}, {replaceState:true});
        callback();
    });
};