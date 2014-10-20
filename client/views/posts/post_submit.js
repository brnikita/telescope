function getThumbnail(imageData, width, height) {
    var img = document.createElement("img"),
        canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

    img.src = imageData;
    canvas.height = height;
    canvas.width = width;
    context.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL("image/png");
}

Template[getTemplate('post_submit')].helpers({
    categoriesEnabled: function () {
        return Categories.find().count();
    },
    categories: function () {
        return Categories.find();
    },
    users: function () {
        return Meteor.users.find({}, {sort: {'profile.name': 1}});
    },
    userName: function () {
        return getDisplayName(this);
    },
    isSelected: function (user) {
        return user._id == Meteor.userId() ? "selected" : "";
    },
    showPostedAt: function () {
        if (Session.get('currentPostStatus') == STATUS_APPROVED) {
            return 'visible'
        } else {
            return 'hidden'
        }
    }
});

Template[getTemplate('post_submit')].rendered = function () {
    // run all post submit rendered callbacks
    var instance = this;
    postSubmitRenderedCallbacks.forEach(function (callback) {
        callback(instance);
    });

    Session.set('currentPostStatus', STATUS_APPROVED);
    Session.set('selectedPostId', null);
    if (!this.editor && $('#editor').exists())
        this.editor = new EpicEditor(EpicEditorOptions).load();

    $('#postedAtDate').datepicker();
};

Template[getTemplate('post_submit')].events({
    'change input[name=status]': function (e) {
        Session.set('currentPostStatus', e.currentTarget.value);
    },
    'change input[type=file]': function (event) {
        //file upload
        var $target = $(event.target),
            $postSubmit = $('.js-post-submit'),
            file = $target[0].files[0],
            reader = new FileReader();
        $postSubmit.addClass('disabled');
        reader.onload = function (event) {
            var $thumbnail = $('.js-photo-thumbnail'),
                thumbnail = getThumbnail(event.target.result, 280, 200);
            $thumbnail.attr('src', thumbnail);
            $thumbnail.removeClass('hide');
            $postSubmit.removeClass('disabled');
        };
        reader.readAsDataURL(file);
    },
    'click input[type=submit]': function (e, instance) {
        e.preventDefault();

        $(e.target).addClass('disabled');

        // ------------------------------ Checks ------------------------------ //

        if (!Meteor.user()) {
            throwError(i18n.t('You must be logged in.'));
            return false;
        }

        // ------------------------------ Properties ------------------------------ //

        // Basic Properties

        var properties = {
            title: $('#title').val(),
            thumbnail: $('.js-photo-thumbnail').attr('src'),
            sticky: $('#sticky').is(':checked'),
            userId: $('#postUser').val(),
            status: parseInt($('input[name=status]:checked').val())
        };

        var twitterId = $('#url').val();
        twitterId = $.trim(twitterId);

        if (_.isString(twitterId) && twitterId.length) {
            properties.url = 'https://twitter.com/' + twitterId;
        }

        // PostedAt
        var $postedAtDate = $('#postedAtDate');
        var $postedAtTime = $('#postedAtTime');
        var setPostedAt = false;
        var postedAt = new Date(); // default to current browser date and time
        var postedAtDate = $postedAtDate.datepicker('getDate');
        var postedAtTime = $postedAtTime.val();

        if ($postedAtDate.exists() && postedAtDate != "Invalid Date") { // if custom date is set, use it
            postedAt = postedAtDate;
            setPostedAt = true;
        }

        if ($postedAtTime.exists() && postedAtTime.split(':').length == 2) { // if custom time is set, use it
            var hours = postedAtTime.split(':')[0];
            var minutes = postedAtTime.split(':')[1];
            postedAt = moment(postedAt).hour(hours).minute(minutes).toDate();
            setPostedAt = true;
        }

        if (setPostedAt) // if either custom date or time has been set, pass result to properties
            properties.postedAt = postedAt;


        // ------------------------------ Callbacks ------------------------------ //

        // run all post submit client callbacks on properties object successively
        properties = postSubmitClientCallbacks.reduce(function (result, currentFunction) {
            return currentFunction(result);
        }, properties);

        // console.log(properties)

        // ------------------------------ Insert ------------------------------ //
        if (properties) {
            Meteor.call('post', properties, function (error, post) {
                if (error) {
                    throwError(error.reason);
                    clearSeenErrors();
                    $(e.target).removeClass('disabled');
                    if (error.error == 603)
                        Router.go('/posts/' + error.details);
                } else {
                    trackEvent("new post", {'postId': post._id});
                    if (post.status === STATUS_PENDING)
                        throwError('Thanks, your post is awaiting approval.');
                    Router.go('/posts/' + post._id);
                }
            });
        } else {
            $(e.target).removeClass('disabled');
        }

    }
});