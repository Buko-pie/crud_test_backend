const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
    email: {type: String, required: true, maxLength: 100, index: {unique: true}},
    password: {type: String, require: true},
    first_name: {type: String, maxLength: 100},
    last_name: {type: String, maxLength: 100}
}, {
    timestamps: true
});

UserSchema.pre('save', function(next){
    var user = this;

    if(!user.isModified('password')){
        return next();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, hash){
        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, SALT_WORK_FACTOR, function(err, hash){
            if (err) {
                return next(err);
            }

            user.password = hash;
            next();
        })
    })
});

UserSchema.methods.comparePassword = function(candidatePassword, cb){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if (err) {
            return cb(err);
        }

        cb(null, isMatch)
    })
}

module.exports = mongoose.model('User', UserSchema);