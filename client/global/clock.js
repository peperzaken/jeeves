/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 11/14/13
 */
Template.clock.hours = function() {
    return Clock.get( "hours" );
};

Template.clock.minutes = function() {
    return Clock.get("minutes");
};

Template.clock.date = function() {
    return Clock.get( "date" );
};

var Clock = {

    // keys look like { "name": "Chris" }
    keys: {},

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

function getTime() {
    var time = new Date();
    var hours = utils.padZeroes(time.getHours());
    var minutes = utils.padZeroes(time.getMinutes());
    Clock.set( "hours", hours );
    Clock.set( "minutes", minutes);
}

function getDate() {
    var date = new Date();
    var day = date.getDay();
    var dayNumber = date.getDate();
    var month = date.getMonth();

    var months = ['jan.', 'feb.', 'mrt.', 'apr.', 'mei.', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'];
    var days = ['Zondag','Maandag','Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];

    var dateString = days[day] + " " + dayNumber + " " + months[month];
    Clock.set( "date", dateString );
}


// Run at least once on startup.
getTime();
getDate();

// Set the interval to update the time and date whenever necessary.
Meteor.setInterval(getTime, 30 * 1000);
Meteor.setInterval(getDate, 60 * 1000);

// Re-run each of these functions (printName, printNameAgain) any time
// a value changes in a reactive data source
Deps.autorun(Template.clock.hours);
Deps.autorun(Template.clock.minutes);
Deps.autorun(Template.clock.date);