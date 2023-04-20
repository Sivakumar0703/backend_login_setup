const validator = require('validator');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: {
            type: String, required: true, lowercase: true, validate: (value) => {
                return validator.isEmail(value) // if its true validate gets pass else validation fails 
            }
        },
        mobile: { type: String, default: '000-000-0000' },
        password: { type: String, required: true },
        role: { type: String, default: 'user' },
        createdAt: { type: Date, default: Date.now }
    },
    {
        collection:'user' // forcing collection name to be 'user' but not in plural (mangoose always changes it collection name into plural even if you give it in singular)
        //versionKey:false // to remove the version key in db
    }
)

// model joins schema and database

let userModel = mongoose.model('user',userSchema); //(collection , schema)
module.exports = {userModel}