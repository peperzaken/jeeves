/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 10/25/13
 */
Meteor.subscribe('availableSlides');

Template.addSlide.rendered = function() {
    $("head").append("<link>");
    var css = $("head").children(":last");
    css.attr({
        rel:  "stylesheet",
        type: "text/css",
        href: "bootstrap-timepicker.css"
    });
    // Load the timepicker script on first load.
    $.getScript('/bootstrap-timepicker.js', function() {
        $(".timepicker-toggle").each( function( index, item ) {
            $(item).timepicker({
                minuteStep: 1,
                appendWidgetTo: 'body',
                showSeconds: false,
                showMeridian: false,
                defaultTime: false
            });
        });
    });
};


Template.addSlide.events({
    'submit': function( event ) {
        event.preventDefault();
        saveSlide();
    },

    'click .btn-primary': function( event ) {
        event.preventDefault();
        saveSlide();
    }
});

function extractTime( day ) {
    return $( "#all" + day ).prop( "checked" ) ? "all" : ( $( "#from" + day ).val() + "-" + $( "#to" + day ).val() )
}

Template.addSlide.hourSelector = function( id, placeholder ) {
    return '<input name="timepicker-toggle" id="'+ id + '" type="text" class="input-small timepicker-toggle form-control" placeholder=' + placeholder + '>';
};

Template.addSlide.availableSlides = function() {
    var availableSlides = AvailableSlides.findOne( { pk: 1 } );
    var currentSlides = Slides.find().fetch();
    if( availableSlides && currentSlides ) {
        var currentSlidesArray = [];
        _.each( currentSlides, function( slide ) {
            currentSlidesArray.push(slide.name);
        });

        // Calculate difference between the arrays
        var difference = _.difference(availableSlides.availableSlides, currentSlidesArray);
        if( difference.length <= 0 ) {
            return undefined;
        } else {
            return difference;
        }
    }
};

/**
 * This function extracts the values input by the user
 * and attempts to save the slide.
 */
function saveSlide() {
    // Extract the needed values
    var name = $( "#name").val();
    var screenTime = $( "#screenTime").val() * 1000;
    var category = $( "#category").val();
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

    // Extra checks
    if( screenTime == 0 ) {
        FlashMessages.sendError("You must enter a correct screen time.");
        return;
    }
    if( name == "" ) {
        FlashMessages.sendError("You must enter the name of your slide.");
        return;
    }

    Meteor.call( 'addSlide', name, screenTime, category, timeSlot, function( err, id ) {
        if( err ) {
            FlashMessages.sendError( err.reason );
            return;
        }
        FlashMessages.sendInfo("Slide sucessfully added.");
        Router.go('addSlide', {}, {replaceState:true});
    });
}