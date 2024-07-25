const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
},
{
    collection: 'user-data' 
});

const userModel = mongoose.model('UserData', userSchema);
module.exports = userModel;
