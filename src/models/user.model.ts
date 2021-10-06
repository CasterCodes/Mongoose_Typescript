import mongoose, {Document} from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: {
        type:String,
        required:true,
        unique:true
    },
    firstNam: {
        type:String,
        required:true
    },

    lastName: {
        type:String,
        required:true
    }
}, {timestamps:true});



// virtual method

userSchema.virtual('fullName').get(function(){
     return `${this.firstName}  ${this.lastName}`;
});

userSchema.pre('save', async function (next){
      
      if(!this.isModified('password')) return next();

      const salt = await bcrypt.getSalt(12);

      const hashedPassword =  await bcrypt.hash(salt, this.password);

      this.password = hashedPassword;

      return next();
})


userSchema.methods.comparePassword = async function(candidatePassword) {
      const user = this;
      return await bcrypt.compare(candidatePassword, user.password).catch(error => false);
}

const User = mongoose.model('User', userSchema);


export default User;