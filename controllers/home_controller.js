const Post = require('../models/post');
const User = require('../models/user');
const passport = require("../config/passport-local-strategy");
const Friendships = require("../models/friendship");


module.exports.home = async function(req, res){

    try{
        // populate the likes of each post and comment
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate: {
                path: 'likes'
            }
        }).populate('likes');

    
        let users = await User.find({});
        let user;
        if (req.user) {
        user = await User.findById(req.user._id)
            .populate({
            path: "friendships",
            populate: {
                path: "from_user",
            },
            })
            .populate({
            path: "friendships",
            populate: {
                path: "to_user",
            },
            });
        }
        return res.render('home', {
            title: "FriendME | Home",
            posts:  posts,
            all_users: users,
            user: user
        });

    }catch(err){
        console.log('Error', err);
        return;
    }
   
}

// module.exports.actionName = function(req, res){}


// using then
// Post.find({}).populate('comments').then(function());

// let posts = Post.find({}).populate('comments').exec();

// posts.then()
