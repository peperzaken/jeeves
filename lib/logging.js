/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 10/24/13
 */
if ( Meteor.isServer ) {
    // Creating a global server logger
    log = Winston;

    // Use a log file
    log.add( log.transports.File, { filename: "jeeves.log" } );
}