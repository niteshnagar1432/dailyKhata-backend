const mongoose = require('mongoose');

let UserSchema = mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    profile:[{
        type:mongoose.Schema.ObjectId,
        ref:'profiles'
    }],
    sentAmmount:{
        type:String,
        default:'0'
    },
    reciveAmmount:{
        type:String,
        default:'0'
    },
    emailVerify:{
        type:Boolean,
        default:false
    },
    phoneVerify:{
        type:Boolean,
        default:false
    },
    theme:{
        type:Boolean,
        default:true
    },
    activity:[{
        type:mongoose.Schema.ObjectId,
        ref:'activitys'
    }],
    sessions:[{
        type:mongoose.Schema.ObjectId,
        ref:'sessions'
    }],
    password:String,
    currentSocket:String,
    currentIP:String,
    connections:[{
        type:mongoose.Schema.ObjectId,
        ref:'connections'
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('user',UserSchema);