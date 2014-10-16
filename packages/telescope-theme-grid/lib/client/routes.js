Meteor.startup(function () {
    Router.map(function() {
        this.route('post_submit', {
            template: getTemplate('grid_post_submit'),
            path: '/submit'
        });
    });
});