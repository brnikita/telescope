Template[getTemplate('posts_natural_icon')].helpers({
    post_item: function () {
        return getTemplate('post_item');
    },
    posts: function () {
        if (this.postsList) { // XXX
            this.postsList.rewind();
            var posts = this.postsList.map(function (post, index, cursor) {
                post.rank = index;
                return post;
            });
            return posts;
        }
    },
    postsLoadMore: function () {
        return getTemplate('postsLoadMore');
    },
    postsListIncoming: function () {
        return getTemplate('postsListIncoming');
    }
});

Template[getTemplate('posts_natural_icon')].created = function () {
    Session.set('listPopulatedAt', new Date());
};