/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 */
Template["adminIndex"].events({
    'click #logout': function( e ) {
        e.preventDefault();
        Meteor.logout();
    }
});

