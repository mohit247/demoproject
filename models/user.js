const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('mongoose-type-email');

const schema = mongoose.Schema;
mongoose.SchemaTypes.Email.defaults.message = 'Email address is invalid'


const userSchema = new schema({
        name: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 15
        },
        email: {
            type: mongoose.SchemaTypes.Email,
            correctTld: true,
            required: true
            
        },
        password: {
            type: String,
            required: true
        },
        dob: {
            type: Date,
            required: true
        },
        accountCreated: {
            type: Date,
            default: Date.now
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]


}, { timestamps: true});

userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({ email} )
    console.log(user);
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user
}

module.exports =mongoose.model('User', userSchema);