/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 10/11/13
 */
Template.lobby.screenName = function() {
    if ( amplify.store( "screenSettings" ) ) {
        return amplify.store( "screenSettings").name
    }
};

Template.lobby.selected = function( category ) {
    if ( amplify.store("screenSettings") && amplify.store( "screenSettings" ).category === category ) {
        return 'selected="selected"';
    }
};

Template.lobby.checked = function() {
    if ( amplify.store("screenSettings") && amplify.store( "screenSettings").rememberMe ) {
        return "checked";
    }
};

Template.lobby.onRemember = function() {
    var screenSettings = amplify.store( "screenSettings" );
    if ( screenSettings && screenSettings.rememberMe ) {
        addScreen( screenSettings.name, screenSettings.category, screenSettings.rememberMe, function( err ) {
            if( err ) {
                FlashMessages.sendError( err.reason );
            }
        });
    }
};

Template.lobby.events({
    'submit': function( event ) {
        // Prevent actual form submission
        event.preventDefault();

        // Gather the fields
        var name = $( "#name" ).val();
        var category = $( ":selected").val();
        var rememberMe = $( "#remember" ).prop( "checked" );

        // Register the screen
        addScreen( name, category, rememberMe, function( err ) {
            if( err ) {
                FlashMessages.sendError( err.reason );
            }
        } );
        Accounts.createUser( { username: Random.id(), password: Random.id(), profile: { name: name } } );
    }
});