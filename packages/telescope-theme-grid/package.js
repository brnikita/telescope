Package.describe({
    summary: 'Telescope Grid theme',
    version: '0.1.0',
    name: 'telescope-theme-grid'
});

Package.on_use(function (api) {

    api.use(['templating', 'telescope-base'], ['client']);

    api.add_files([
        'lib/client/css/grid_screen.css',
        'lib/client/templates/grid_upvote.html',
        'lib/client/templates/grid_user_edit.html',
        'lib/client/templates/grid_user_item.html',
        'lib/client/templates/grid_post_item.html',
        'lib/client/templates/grid_post_submit.html',
        'lib/client/views/posts/grid_post_submit.js',
        'lib/client/routes.js',
        'lib/client/grid.js'
    ], ['client']);
});