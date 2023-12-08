const mongoose = require('mongoose');

let appSchema = mongoose.Schema({
    name:String,
    themeColor:String,
    appVersion:String,
    activity:[{
        type:mongoose.Schema.ObjectId,
        ref:'activitys'
    }],
    versionUpdate:[{
        type:mongoose.Schema.ObjectId,
        ref:'appupdate'
    }],
    alert:[{
        type:mongoose.Schema.ObjectId,
        ref:'alert'
    }],
    error:{
        type:Boolean,
        default:false
    },
    owner:[{
        type:mongoose.Schema.ObjectId,
        ref:'owner'
    }],
    devloper:{
        type:String,
        default:'Nitesh Nagar'
    },
    devloperEmail:{
        type:String,
        default:'niteshnagar1142002@gmail.com'
    },
    appIP:String,
    createdAt:{
        type:Date,
        default:Date.now
    },
});

module.exports = mongoose.model('app',appSchema);