/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/14/13
 */
var countdownTimer = {

    // keys look like { "name": "Chris" }
    keys: { "percentage" : 0},

    // deps store the same keys as above but the value
    // is a Deps.Dependency instance like this:
    // { "name": new Deps.Dependency }
    deps: {},

    // Make sure we've created a dependency object for the key
    // and then call the depend() method to create a dependency.
    // Finally, return the value.
    get: function (key) {
        this.ensureDeps(key);
        this.deps[key].depend();
        return this.keys[key];
    },

    // Set the value of the key to the new value and then call
    // the changed() method on the dependency object which will
    // trigger any dependent functions to be re-run.
    set: function (key, value) {
        this.ensureDeps(key);
        this.keys[key] = value;
        this.deps[key].changed();
    },

    // Make sure we create the Deps.Dependency object for the first
    // time
    ensureDeps: function (key) {
        if (!this.deps[key])
            this.deps[key] = new Deps.Dependency;
    }
};

Template.slideCountdown.percentage = function() {
    var percentage = countdownTimer.get( "percentage" );
    $('.progress-bar-slide-countdown').css('width', percentage + '%')
};

function updateCountdownPercentage() {
    var screen = Screens.findOne( amplify.store( 'screenId' ) );
    if ( screen && Session.get( 'totalCountdownTime' ) && Router._currentController.route.name === screen.currentSlide ) {
        var now = new Date().getTime();
        var difference = screen.nextSlideAt - now;
        if( difference >= 0 ) {
            var percentage = Math.floor( ( utils.toSeconds( difference ) / Session.get( 'totalCountdownTime' ) ) * 100 );
            percentage = percentage > 100 ? 100 : 100 - percentage;
            countdownTimer.set( "percentage", percentage );
        }
    }
}

updateCountdownPercentage();
countdownInterval = Meteor.setInterval(updateCountdownPercentage, 1000);
Deps.autorun(Template.slideCountdown.percentage);