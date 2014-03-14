/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 10/11/13
 * @version 1.0
 */
if( Meteor.isServer ) {
    /**
     * Scheduler object.
     * @constructor
     */
    Scheduler = function Scheduler() {
        this.slides = [];
        this.slideQueue = [];

        /**
         * Adds a slide to the collection of
         * available slides.
         * @param {Slide} slide - The slide to add
         */
        this.addSlide = function( slide ) {
            if ( slide instanceof Slide ) {
                if ( this.isUniqueSlide( slide ) ) {
                    this.slides.push( slide );
                } else {
                    log.error("Tried to add slide \"" + slide.getName() + "\" but found a duplicate name.");
                }
            }
        };

        /**
         * Checks whether we already have a slide with this name.
         * @param {Slide} newSlide - The slide to check
         * @returns {Boolean} Is slide unique?
         */
        this.isUniqueSlide = function( newSlide ) {
            for ( var i = 0; i < this.slides.length; i++ ) {
                var slide = this.slides[i];
                if( slide.getName() == newSlide.getName() ) {
                    return false;
                }
            }
            return true;
        };

        /**
         * @deprecated Queue now stays universal and is only edited on a by client basis
         * @returns {Slide}
         */
        this.nextSlide = function() {
            if ( this.empty( this.slideQueue ) ) {
                this.populateSlideQueue();
                return this.nextSlide();
            } else {
                return this.nextSlideInQueue();
            }
        };

        this.populateSlideQueue = function() {
            this.cleanSlideQueue();
            for ( var i = 0; i < this.slides.length; i++ ) {
                var slide = this.slides[i];
                if ( slide.isShowTime() &&
                    !this.hasDuplicate( this.slideQueue, slide ))
                {
                    this.slideQueue.push( slide );
                }
            }
        };

        this.cleanSlideQueue = function() {
            for ( var i = 0; i < this.slideQueue.length; i++ ) {
                var slide = this.slideQueue[i];
                if( !slide.isShowTime() ) {
                    // Remove from the queue
                    this.slideQueue.splice(i, 1);
                }
            }
        };

        /**
         * Return the next slide in the queue.
         * @returns {Slide} Next slide
         */
        this.nextSlideInQueue = function() {
            return this.slideQueue.shift();
        };

        /**
         * Array helper function which tells us
         * whether an array is empty.
         * @param {Array} array - The array to check
         * @return {Boolean} Empty?
         */
        this.empty = function( array ) {
            return array.length === 0;
        };

        /**
         * Array helper function which tells us
         * whether an array contains duplicate values.
         * @param {Array} array - The array to check.
         * @param {Slide} item - The item to check for.
         * @return {Boolean} Has duplicate value?
         */
        this.hasDuplicate = function( array, item ) {
            var duplicate = false;
            _.each( array, function( value ) {
                if ( value.equals(item) ) {
                    duplicate = true;
                }
            });
            return duplicate;
        };
    };
    /**
     * Slide object.
     * @param {String|Object} name - The name of the slide or a settings object
     * @param {Object|undefined} timeSlot - The time slot of the slide
     * @param {String|undefined} category - The category the slide belongs to
     * @param {Number|undefined} screenTime - The time that the slide should be shown on the screen in ms.
     * @constructor
     */
    Slide = function Slide( name, timeSlot, category, screenTime ) {

        /**
         * Instantiating a slide object can be done via
         * a settings object with the attached values (see below)
         * or via simple arguments.
         */
        if( name.hasOwnProperty( "screenTime" ) ) {
            var settings = name;
            this.name = settings.name || "";            // Default to empty name
            this.timeSlot = settings.timeSlot || {};    // Default to an empty object
            this.category = settings.category || "all"; // Default to all categorie
            this.screenTime = settings.screenTime || (60*1000);  // Default to 1 minute
        } else {
            this.name = name;
            this.timeSlot = timeSlot;
            this.category = category || "all";
            this.screenTime = screenTime || (60*1000);
        }

        /**
         * Getter for 'name' value
         * @returns {String}
         */
        this.getName = function() {
            return this.name;
        };

        /**
         * Getter for 'timeSlot' value
         * @returns {Object}
         */
        this.getTimeSlot = function() {
            return this.timeSlot;
        };

        /**
         * Getter for 'category' value
         * @returns {String}
         */
        this.getCategory = function() {
            return this.category;
        };

        /**
         * Getter for 'screenTime' value
         * @returns {Number}
         */
        this.getScreenTime = function() {
            return parseInt(this.screenTime);
        };

        /**
         * Custom equality checking method
         * @param {Slide} obj - Object to check against
         * @returns {Boolean} Equal?
         */
        this.equals = function( obj ) {
            // Check equality with fields instead of object equality
         return this.getName() == obj.getName() &&
                this.getTimeSlot() == obj.getTimeSlot() &&
                this.getCategory() == obj.getCategory();
        };

        /**
         * Returns whether the slide should be shown
         * on the screen. This is based on the date
         * and time slot given up by the developer
         * of the slide.
         * @return {Boolean} Show time?
         */
        this.isShowTime = function() {
            var timeSlot = this.getTimeSlot();
            for( field in timeSlot) {
                if (this.isRightNow( field, timeSlot[field] )) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Decodes a piece of text containing
         * a time and date and checks whether
         * that time is right now.
         * @param {String} day - The day of the week
         * @param {String} time - The time
         * @returns {Boolean}
         */
        this.isRightNow = function( day, time ) {
            if( this.checkTime( time ) && this.checkDay( day ) ) {
                return true;
            }
        };

        /**
         * Takes the abbreviation of a day (for example 'mon' for 'monday')
         * and returns whether that day is today.
         * @param {String} day - Abbreviation for the day
         * @returns {Boolean} Correct day?
         */
        this.checkDay = function( day ) {
            // Convert the day to a number to compare to the getDay() method.
            var today = new Date().getDay();
            var checkDay;
            switch( day ) {
                case 'sun':
                    checkDay = 0;
                    break;
                case 'mon':
                    checkDay = 1;
                    break;
                case 'tue':
                    checkDay = 2;
                    break;
                case 'wed':
                    checkDay = 3;
                    break;
                case 'thu':
                    checkDay = 4;
                    break;
                case 'fri':
                    checkDay = 5;
                    break;
                case 'sat':
                    checkDay = 6;
                    break;
            }
            return today === checkDay
        };

        /**
         * Takes a string such as "08-10" and checks whether the current
         * time is between those hours (between 8 and 10)
         * @param {String} time - The time to check (example: "08-10")
         * @returns {Boolean} Correct time?
         */
        this.checkTime = function( time ) {
            // Base case: All day
            if( time === "all" ) {
                return true;
            }

            // Convert time to actual numbers
            var splitTimes = time.split("-");
            var from = splitTimes[0];
            var to = splitTimes[1];

            if( !from.split(":")[1] || !to.split(":")[1] ) {
                from = from + ":00";
                to = to + ":00";
            }

            // Get the hours and minutes of the date
            var fromHours = from.split(":")[0],
                fromMinutes = from.split(":")[1];
            var toHours = to.split(":")[0],
                toMinutes = to.split(":")[1];

            // Make a 'from' date object
            var fromDate = new Date();
            fromDate.setHours(fromHours);
            fromDate.setMinutes(fromMinutes);
            fromDate.setSeconds(0);
            fromDate.setMilliseconds(0);

            // Make a 'to' date object
            var toDate = new Date();
            toDate.setHours(toHours);
            toDate.setMinutes(toMinutes);
            toDate.setSeconds(0);
            toDate.setMilliseconds(0);

            // Make a 'now' date object
            var now = new Date().getTime();

            return now >= fromDate.getTime() && now <= toDate.getTime();
        };
    };

    /**
     * Screen object.
     * @param {String|Object} category - Either a settings object or a string containing the category of the screen
     * @param {String|undefined} currentSlide - The current slide on the screen.
     * @param {Number|undefined} nextSlideAt - Unix Epoch timestamp when the current slide expires and the screen is ready for a new slide
     * @param {Array|undefined} previousSlides - List of slides previously shown on this screen.
     * @param {String|undefined} name - The name of the screen, used to identify the screen.
     * @param {String|undefined} id - The random ID taken from MongoDB.
     * @constructor
     */
    Screen = function Screen( category, currentSlide, nextSlideAt, previousSlides, name, id ) {
        if ( category.hasOwnProperty( "category" ) ) {
            var settings = category;
            this.name = settings.name || "Screen";
            this.category = settings.category || "all";
            this.currentSlide = settings.currentSlide || "welcome";
            this.nextSlideAt = settings.nextSlideAt || 0;
            this.previousSlides = settings.previousSlides || [];
            this.id = settings._id;
        } else {
            this.name = name || "Screen";
            this.category = category || "all";
            this.currentSlide = currentSlide || "welcome";
            this.nextSlideAt = nextSlideAt || 0;
            this.previousSlides = previousSlides || [];
            this.id = id;
        }

        /**
         * Getter for 'category' value
         * @returns {String}
         */
        this.getCategory = function() {
            return this.category;
        };

        /**
         * Getter for 'currentSlide' value
         * @returns {String}
         */
        this.getCurrentSlide = function() {
            return this.currentSlide;
        };

        /**
         * Getter for 'nextSlideAt' value
         * @returns {Number}
         */
        this.getNextSlideAt = function() {
            return this.nextSlideAt;
        };

        /**
         * Getter for 'previousSlides' value
         * @returns {Array}
         */
        this.getPreviousSlides = function() {
            return this.previousSlides;
        };

        /**
         * Getter for 'name' value
         * @returns {String}
         */
        this.getName = function() {
            return this.name;
        };

        /**
         * Getter for 'id' value
         * @returns {String}
         */
        this.getId = function() {
            return this.id;
        };

        /**
         * Checks whether the screen is ready for a new slide
         * @returns {Boolean} Ready?
         */
        this.isReady = function() {
            return new Date().getTime() >= this.getNextSlideAt();
        };

        /**
         * Checks whether the slide can be used on this screen
         * @param {String} category - The category to check
         * @returns {boolean} Correct category?
         */
        this.isCorrectCategory = function( category ) {
            return this.getCategory() === category || category === "all";
        };

        /**
         * This function checks whether a slide has already been shown
         * on the screen in the last rotation of slides.
         * @param {String} name - The name of the slide to check against
         * @returns {boolean} Duplicate?
         */
        this.isDuplicate = function( name ) {
            // Loop over all the items, check if there was a duplicate, if the end is reached and there is no 'new' slide
            // to show, reset the previousSlides array and start over
            var slides = this.getPreviousSlides();

            if ( Scheduler.empty( slides ) ) {
                return false;
            }

            for ( var i = 0; i < slides.length; i++ ) {
                var slide = slides[i];
                if( slide === name ) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Checks whether a slide is compatible to show on this screen
         * @param {Slide} slide - The slide to check
         */
        this.isCorrectSlide = function( slide ) {
            return this.isCorrectCategory(slide.category) && !this.isDuplicate(slide.name);
        };

        /**
         * Gets the last slide in the queue that is elligible for this screen
         * @returns {Slide|Boolean}
         */
        this.getLastCorrectSlideInQueue = function() {
            var i = Scheduler.slideQueue.length -1;
            for ( ; i >= 0; i--) {
                var slide = Scheduler.slideQueue[i];
                if ( this.isCorrectSlide( slide ) ) {
                    return slide
                }
            }
            return false;
        }
    };

    Scheduler = new Scheduler();
}