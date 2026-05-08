import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema

const userSchema = new Schema ({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String, 
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
            validator: function(v) {
                // regex for at least one letter and one digit
                return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
            },
            message: props => `Passowrd is not strong enough`
        },
        select: false // no need to return password in queries
    },

}, { timestamps: true });

// pre-save hook to hash password
userSchema.pre("save", async function() {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
})

// method compare passwords for login
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model("User", userSchema);

export default User