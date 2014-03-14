/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 10/28/13
 */
Template.editSlide.rendered = function() {
    $(".timepicker-toggle").click( function( item ) {
        // Load all timepickers
        $(".timepicker-toggle").each( function( index, item ) {
            $(item).timepicker({
                minuteStep: 1,
                appendWidgetTo: 'body',
                showSeconds: false,
                showMeridian: false,
                defaultTime: false
            });
        });
        // Show the clicked timepicker
        var clicked = $(this)[0];
        $(clicked).timepicker('showWidget');
    });
};


/**
 * Getter for all the slides. Used to itterate over them in the view.
 * @returns {Array}
 */
Template.editSlide.slides = function() {
    return Slides.find().fetch();
};

Template.editSlide.slide = function() {
    var slide = Slides.findOne( { name: Session.get( 'editRecord' ) } );
    if( slide ) {
        return slide;
    }
};

/**
 * This function returns on which screens the slide is visible at the moment.
 * @param {String} name - Name of the slide
 * @returns {String} Screens on which the slide is visible.
 */
Template.editSlide.visibleOn = function( name ) {
    var tmp = "";
    var screens = Screens.find( { currentSlide: name }).fetch();
    _.each( screens, function( screen ) {
        tmp = tmp + screen.name + ", ";
    });

    // Condition: no screens have this slide on it.
    if( tmp == "" ) {
        return "None";
    }

    // Cut off the ", " from the last entry for pretty formatting
    return tmp.substring( 0, tmp.length - 2 );
};

/**
 * Reactive session variable which is used for updating
 * the view (normal and edit mode)
 * @param {String} name - Name of the slide to check against
 * @returns {boolean} Edit mode?
 */
Template.editSlide.editRecord = function( name ) {
    return Session.get( 'editRecord' );
};

Template.editSlide.currentRecord = function() {
    var name = Session.get( 'editRecord' );
    var slide = Slides.findOne( { name: name } );
    if( slide ) {
        return slide;
    }
};

/**
 * Helper function which automagically selects the correct
 * value in a <select> element.
 * @param {Object} slide - The slide being edited
 * @param {String} category - The category to be checked against.
 * @returns {string} Selector attribute
 */
Template.editSlide.select = function( slide, category ) {
    return slide.category === category ? "selected=selected" : "";
};

Template.editSlide.events({
    /**
     * Event listener for click event on the 'Edit' button.
     */
    'click .editButton': function() {
        // Set the view to edit mode
        Session.set('editRecord', this.name);
    },
    /**
     * Event listener for click event on the 'Save' button.
     */
    'click .saveButton': function() {
        // Extract the needed values
        var timeSlot = {
            "mon": extractTime("Monday"),
            "tue": extractTime("Tuesday"),
            "wed": extractTime("Wednesday"),
            "thu": extractTime("Thursday"),
            "fri": extractTime("Friday"),
            "sat": extractTime("Saturday"),
            "sun": extractTime("Sunday")
        };
        // Check the inputs for faulty values.
        if( !utils.checkTimeInput( timeSlot ) )
            return;

        timeSlot = utils.fixTimezoneDifferences( timeSlot );

        var obj =
        {
            name: $( ".name" ).val(),
            category: $( ".category" ).val(),
            screenTime: parseInt($( ".screenTime" ).val()) * 1000,
            timeSlot: timeSlot
        };

        var slide = Template.editSlide.currentRecord();

        // Update the slides and restore the view to normal mode.
        Slides.update( slide._id, { $set: obj } );
        FlashMessages.sendInfo("Slide successfully updated.");
        Session.set('editRecord', false);
    },
    /**
     * Event listener for click event on the 'Cancel' button
     */
    'click .cancelButton': function() {
        Session.set('editRecord', false);
    },

    /**
     * Event listener for click event on the 'Delete' button
     */
    'click .deleteButton': function() {
        Slides.remove(this._id, function() {
            FlashMessages.sendInfo("Slide successfully removed.");
        });
    }
});

function extractTime( day ) {
    return $( "#all" + day ).prop( "checked" ) ? "all" : ( $( "#from" + day ).val() + "-" + $( "#to" + day ).val() )
}

Template.editSlide.hourSelector = function( from, id, placeholder ) {
    from = utils.createCorrectClientTime( from );
    return '<input name="timepicker-toggle" id="'+ id + '" type="text" value="' + from + '" class="input-small timepicker-toggle">';
};

Template.editSlide.day = function( name ) {
    var res = [];
    var slide = Slides.findOne( { name: name } );
    if( slide ) {
        _.each( slide.timeSlot, function( timeSlot, short ) {
            if( timeSlot == "all" ) {
                var from = "0:00";
                var to = "23:00";
                var checked = true;
            } else {
                var splitTimes = timeSlot.split("-");
                var from = splitTimes[0];
                var to = splitTimes[1];
                var checked = false;
            }

            function name( short ) {
                switch( short ) {
                    case 'mon':
                        return "Monday";
                    case 'tue':
                        return "Tuesday";
                    case 'wed':
                        return "Wednesday";
                    case 'thu':
                        return "Thursday";
                    case 'fri':
                        return "Friday";
                    case 'sat':
                        return "Saturday";
                    case 'sun':
                        return "Sunday";
                }
            }

            var tmp =
            {
                name: name( short ),
                from: Template.editSlide.hourSelector( from, "from" + name( short ) ),
                to: Template.editSlide.hourSelector( to, "to" + name(short) ),
                checked: checked
            };
            res.push( tmp );
        } );
        return res;
    }
};

Template.editSlide.loadTimepicker = function() {
    $("head").append("<link>");
    var css = $("head").children(":last");
    css.attr({
        rel:  "stylesheet",
        type: "text/css",
        href: "bootstrap-timepicker.css"
    });
    // Load the timepicker script on first load.
    $.getScript('/bootstrap-timepicker.js');
};

/**
 * Helper function to convert ms to seconds
 * @param {Number} screenTime - The time to convert
 * @returns {Number} Formatted screen time
 */
Template.editSlide.formatScreenTime = function( screenTime ) {
    return screenTime / 1000;
};