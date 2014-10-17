Template[getTemplate('comment_list')].created = function () {
    postObject = this.data;
};

Template[getTemplate('comment_list')].helpers({
    comment_item: function () {
        return getTemplate('comment_item');
    },
    child_comments: function () {
        var post = this;
        var comments = Comments.find({postId: post._id, parentCommentId: null}, {sort: {score: -1, postedAt: -1}});
        console.log(comments);
        return comments;
    },
    naturalQuestions: function () {
        var postUser = Meteor.users.findOne(this.userId);
        console.log(postUser.naturalQuestions);
        return postUser.naturalQuestions;
    },
    isNaturalIcon: function(){
        var postUser = Meteor.users.findOne(this.userId);
        return postUser.isNaturalIcon;
    }
});

Template[getTemplate('comment_list')].rendered = function () {
    // once all comments have been rendered, activate comment queuing for future real-time comments
    window.queueComments = true;
};