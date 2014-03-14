/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 */
Template.admin.events({
    // Event: user wants to log in
    'submit #login-form': loginUser,

    // Event: user wants to log in
    'click #login-button': loginUser,

    // Event: user wants to log out
    'click #logout': function( e ) {
        e.preventDefault();
        Meteor.logout();
    }
});

/**
 * @returns {Boolean} Admin?
 */
Template.admin.isAdmin = function() {
    var user = Meteor.user();
    try {
        return user.profile.admin
    } catch ( e ) {
        return false
    }
};

/**
 * This function finds the login values given by a user
 * and tries to log him in.
 */
function loginUser( e, t ) {
    e.preventDefault();

    var username = t.find("#login-username").value,
        password = t.find("#login-password").value;

    Meteor.loginWithPassword( username, password, function( err ) {
        if( err )
            FlashMessages.sendError("Could not log you in, details: " + err.toString() );
        var user = Meteor.user();
        try {
            if( user.profile.admin ) {
                // NOP
            }
        } catch ( e ) {
            FlashMessages.sendError("You need to be a superuser to login.");
        }
    });
}