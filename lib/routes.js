/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 * @since 10/15/13
 * @version 0.1
 *
 * This file is used to add your routes for your specific templates.
 * The iron-router packages is being used to do routing
 * @API https://github.com/EventedMind/iron-router
 */
Router.map(function() {
    this.route('lobby', {path: '/'});
    this.route('welcome');
    this.route('admin');
    this.route('addSlide');
    this.route('editSlide');
    this.route('editScreen');
    this.route('druppel');
    this.route('beertime');
    this.route('account');
});