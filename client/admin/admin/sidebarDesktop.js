/**
 * @author Ruben Homs <rubenhoms@gmail.com>
 */
Template.sidebarDesktop.events({
    'click #home': function( e ) {
        e.preventDefault();
        Router.go('admin');
    },
    'click #slides': function( e ) {
        e.preventDefault();
        Router.go('editSlide');
    },
    'click #add-slide': function( e ) {
        e.preventDefault();
        Router.go('addSlide');
    },
    'click #screen': function( e ) {
        e.preventDefault();
        Router.go('editScreen');
    },
    'click #account': function( e ) {
        e.preventDefault();
        Router.go('account');
    }
});

/**
 * Helper to decide whether a menu item is active.
 * @returns {string} The class to add to the HTML element
 */
Template.sidebarDesktop.isActiveMenuItemClass = function( route ) {
    if ( Router._currentController.template == route ) {
        return "menu-item  active-menu"
    } else {
        return "menu-item"
    }
};

/**
 * Helper to decide whether the glyphicon menu item is active
 * @returns {string} The class to add to the HTML element
 */
Template.sidebarDesktop.isActiveMenuGlyphiconClass = function ( route ) {
    if ( Router._currentController.template == route ) {
        return "menu-item-glyphicon-active"
    } else {
        return "menu-item-glyphicon"
    }
};

/**
 * Helper to decide whether a menu item text entry is active or not
 * @returns {string} The class to add to the HTML element
 */
Template.sidebarDesktop.isActiveMenuTextClass = function ( route ) {
    if ( Router._currentController.template == route ) {
        return "menu-item-txt-active"
    } else {
        return "menu-item-txt"
    }
};

/**
 * Helper to device whether a menu item is active
 * @param {String} route - The route to check
 * @returns {Boolean} Active menu item?
 */
Template.sidebarDesktop.isActiveMenuItem = function( route ) {
    return Router._currentController.template == route;
};