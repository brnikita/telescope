Template[getTemplate('user_natural_questions')].events({
    'submit': function (event, instance) {
        event.preventDefault();

        var $form = $(event.target),
            questions = $form.serializeArray(),
            postId = instance.data._id,
            comment = '';

        _.each(questions, function (question) {
            var value = question.value;

            value = $.trim(value);
            if (_.isString(value) && value.length > 0) {
                comment += value + '<br/>';
            }
        });

        if (comment === '') {
            return;
        }

        Meteor.call('comment', postId, null, comment, function (error) {
            if (error) {
                throwError(error.reason);
            } else {
                throwError(i18n.t('Answers have been sent'));

                Posts.update(postId, {
                    $set: {
                        naturalQuestionsAnswered: true
                    }
                })
            }

            Deps.afterFlush(function () {
                var element = $('.grid > .error');
                $('html, body').animate({
                    scrollTop: element.offset().top
                });
            });
        });
    }
});