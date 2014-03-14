/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 */
Template["admin-index"].events({
    'click #logout': function( e ) {
        e.preventDefault();
        Meteor.logout();
    }
});

