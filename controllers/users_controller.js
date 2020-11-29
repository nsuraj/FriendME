const User = require('../models/user');
const Friendships = require("../models/friendship");
const fs = require('fs');
const path = require('path');

// let's keep it same as before
module.exports.profile = async function(req, res){
    try{
    // User.findById(req.params.id, function(error, user){
    //     return res.render('user_profile', {
    //         title: 'User Profile',
    //         profile_user: user
    //     });
    // });
    let user = await User.findById({ _id: req.params.id });
    
    // console.log('req=>',req);
    let friendship1,friendship2

    friendship1 = await Friendships.findOne({
      from_user: req.user._id,
      to_user: req.params.id,
    });
    
    friendship2 = await Friendships.findOne({
      from_user: req.params.id,
      to_user: req.user._id,
    });
    
    let populated_user = await User.findById(req.user).populate('friendships');
    return res.render("user_profile", {
      title: "FriendME | Profile",
      profile_user: user,
      populated_user
    });
}catch(error){
    console.log("Error", error);
    return;
}
}


module.exports.update = async function(req, res){
   

    if(req.user.id == req.params.id){

        try{

            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if (err) {console.log('*****Multer Error: ', err)}
                
                user.name = req.body.name;
                user.email = req.body.email;
                user.gender = req.body.gender;

                if (req.file){

                    if (user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }


                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }


    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}


// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "FriendME | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "FriendME | Sign In"
    })
}

// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){req.flash('error', err); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){req.flash('error', err); return}

                return res.redirect('/users/sign-in');
            })
        }else{
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }

    });
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have logged out!');


    return res.redirect('/');
}