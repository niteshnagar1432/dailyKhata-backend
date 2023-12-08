const mongoose = require('mongoose');

let profileSchema = mongoose.Schema({
    account:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    },
    url:String,
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('profiles',profileSchema);