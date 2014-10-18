Package.describe({
    summary: 'Telescope Grid theme',
    version: '0.1.0',
    name: 'telescope-theme-grid'
});

Package.on_use(function (api) {

    api.use(['templating', 'telescope-base'], ['client']);

    api.add_files([
        'lib/client/css/grid_screen.css',
    ], ['client']);
});