const Users = require("../models/user");
const Friendships = require("../models/friendship");



module.exports.addFriend = async function(request , response){
    try{
    // console.log(request);
    let existingFriendship = await Friendships.findOne({
        from_user : request.user,
        to_user : request.query.id,
    });
    // console.log('existingfrndsip'+existingFriendship);
    let toUser = await Users.findById(request.user);
    let fromUser = await Users.findById(request.query.id);

    let deleted = false;

    if(existingFriendship){
        toUser.friendships.pull(existingFriendship._id);
        fromUser.friendships.pull(existingFriendship._id);
        toUser.save();
        fromUser.save();
        existingFriendship.remove();
        deleted = true;
        removeFriend = true;
    }else{
        let friendship = await Friendships.create({
            to_user : request.query.id,
            from_user : request.user._id
        });
        // console.log('friendship:'+friendship);
        toUser.friendships.push(friendship);
        fromUser.friendships.push(friendship);
        toUser.save();
        fromUser.save();
    }

    if(request.xhr){
        return response.status(200).json({
            deleted : deleted , 
            message : "Request Successful",
        });
    }

    
    // console.log(user);
     return response.redirect("back");
    }
    catch(err){
        console.log(err);
        return;
    }
}