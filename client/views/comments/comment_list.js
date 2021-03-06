Template[getTemplate('comment_list')].created = function () {
    postObject = this.data;
};

Template[getTemplate('comment_list')].helpers({
    comment_item: function () {
        return getTemplate('comment_item');
    },
    child_comments: function () {
        var post = this;
        return Comments.find({postId: post._id, parentCommentId: null, isNaturalHairIcon: false}, {sort: {score: -1, postedAt: -1}});
    },
    natural_hair_comments: function () {
        var post = this;
        return Comments.find({postId: post._id, parentCommentId: null, isNaturalHairIcon: true}, {sort: {score: -1, postedAt: -1}});
    }
});

Template[getTemplate('comment_list')].rendered = function () {
    // once all comments have been rendered, activate comment queuing for future real-time comments
    window.queueComments = true;
};