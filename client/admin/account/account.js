/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 */
Template.account.username = function() {
    var user = Meteor.user();
    if( user ) {
        return user.username;
    }
};

Template.account.events({
    'click #save': function( e ) {
        e.preventDefault();
        var oldPassword = $("#old-password").val(),
            newPassword = $("#new-password").val();

        if( oldPassword == "" || newPassword == "" ) {
            FlashMessages.sendError( "You must enter both password fields to save your account." );
            return;
        }

        // Last case: User wants to update username and password.
        if( oldPassword != "" && newPassword != "" ) {
            Accounts.changePassword(oldPassword, newPassword, function( e ) {
                if( e )
                    FlashMessages.sendError("An error occured while saving your account:" + e.toString());
                else
                    FlashMessages.sendSuccess("Your account has been successfully updated.");
            });
        }
    }
});