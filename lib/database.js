/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 10/10/13
 * @version 0.1
 *
 * This file contains all the databases that are used as
 * a reactive datasource for our Meteor application.
 * Make sure that you do not define the collection with
 * a preceding 'var', doing so will not make the object
 * available globally.
 */
/**
 * Collection which stores the state
 * of the screens used to display the
 * application on. Example doc:
 * {
 *      name: "Name"                // The name of the screen
 *      currentSlide: "SlideName"   // The slide currently on display
 *      nextSlideAt: Date()         // The time the next slide will be displayed
 *      previousSlides: Array()     // An array with all the previously displayed slides
 *      category: "dev"             // Category tag which indicates what kind of slides should be displayed
 * }
 * @type {Meteor.Collection}
 */
Screens = new Meteor.Collection( 'screens' );

/**
 * Collection which stores the slide
 * settings. Example doc:
 * {
 *   "name": "example",          // The name of the slide, used as a unique identifier
 *   "screenTime": 9000,         // The time (in ms) that the slide should be on the screen.
 *   "category": "all"           // The category of the screen this slide should be shown on.
 *   "timeSlot": {               // The time slot in which this slide should be shown.
 *       "mon": "all",
 *       "tue": "all",
 *       "wed": "all",
 *       "thu": "all",
 *       "fri": "08:00-10:00"
 *   }
 * }
 * @type {Meteor.Collection}
 */
Slides = new Meteor.Collection( 'slides' );

/**
 * Collection for storing the precipitation data.
 * @type {Meteor.Collection}
 */
Druppel = new Meteor.Collection( 'druppel' );

/**
 * Collection for storing available slide data
 * @type {Meteor.Collection}
 */
AvailableSlides = new Meteor.Collection( 'availableSlides' );