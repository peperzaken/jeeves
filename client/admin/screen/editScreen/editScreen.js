/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 10/28/13
 */
Template.editScreen.screens = function() {
    return Screens.find().fetch();
};

Template.editScreen.slides = function() {
    return Slides.find().fetch();
};

Template.editScreen.isCurrentSlide = function( slide, currentSlide ) {
    return slide === currentSlide;
};

Template.editScreen.hasScreens = function() {
    var screens = Screens.find().fetch();
    return screens && screens.length > 0;
};

Template.editScreen.events({
    'change .selector': function() {
        var slide = $( "[id='" + this.name + "']").val();
        var nextSlideAt = utils.calcTime('+1').getTime() + Slides.findOne( { name: slide }).screenTime;

        Screens.update( this._id, { $set:  { currentSlide: slide, nextSlideAt: nextSlideAt } } );
        FlashMessages.sendInfo("Screen updated.");
    }
});