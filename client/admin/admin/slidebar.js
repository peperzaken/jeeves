/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 */
Template.slidebar.events({
    'click #slides': function( e ) {
        e.preventDefault();
        mySlidebars.close();
        Router.go('editSlide');
    },
    'click #add-slide': function( e ) {
        e.preventDefault();
        mySlidebars.close();
        Router.go('addSlide');
    },
    'click #screen': function( e ) {
        e.preventDefault();
        mySlidebars.close();
        Router.go('editScreen');
    },
    'click #account': function( e ) {
        e.preventDefault();
        mySlidebars.close();
        Router.go('account');
    },
    'click #logout': function( e ) {
        e.preventDefault();
        mySlidebars.close();
        Meteor.logout( function() {
            Router.go('admin');
        });
    },
    'click #slidebarsMobileMenu': function( e ) {
        mySlidebars.toggle();
    }
});

Template.slidebar.rendered = function() {
    $.getScript('/slidebars.min.js', function() {
        function runSlidebars() {
            window.mySlidebars = new $.slidebars(); // Start Slidebars
            var width = $(window).width(); // Get width of the screen

            if (width > 480 && mySlidebars.init) { // Check width and if Slidebars has been initialised
                mySlidebars.close(); // Triggering a click event will close a Slidebar if open.
            }
        }

        runSlidebars(); // Initially call the function.
        $(window).resize(runSlidebars); // Call the function again when the screen is resized.
    });
};