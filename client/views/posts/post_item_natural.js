var filteredModules = function (group) {
    // return the modules whose positions start with group
    return _.filter(postModules, function (module) {
        return module.position.indexOf(group) == 0
    });
};

var post = {};

Template[getTemplate('post_item_natural')].created = function () {
    post = this.data;
};

Template[getTemplate('post_item_natural')].helpers({
    leftPostModules: function () {
        return filteredModules('left');
    },
    centerPostModules: function () {
        return filteredModules('center');
    },
    rightPostModules: function () {
        return filteredModules('right');
    },
    getTemplate: function () {
        return getTemplate(this.template);
    },
    moduleContext: function () { // not used for now
        var module = this;
        module.templateClass = camelToDash(this.template) + ' ' + this.position + ' cell';
        module.post = post;
        return module;
    },
    moduleClass: function () {
        return camelToDash(this.template) + ' ' + this.position + ' cell';
    }
});

Template[getTemplate('post_item_natural')].events({
    'submit': function (event, instance) {
        event.preventDefault();

        Posts.update(instance.data._id, {
            $set: {
                isNaturalIcon: !instance.data.isNaturalIcon
            }
        });
    }
});
