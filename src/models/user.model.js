import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
    {
      fullName: {
        type: String,
        required: true,
      },
  
      email: {
        type: String,
        required: true,
        unique: true,
      },
  
      password: {
        type: String,
        required: true,
      },
  
      role: {
        type: String,
        enum: ['student', 'teacher'],
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );
   
  // Hase pass

  userSchema.pre('save' ,async function (next){
    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password,10)
  })
   //compare  pass
  userSchema.methods.matchPassword = async function (password){
    return await bcrypt.compare(password, this.password)
  }


  // genrte access token 
  
  userSchema.methods.ganerateAccessToken = function () {
    return jwt.sign({

      _id : this._id,
      role : this.role,
      email : this.email,
    },
     process.env.ACCESS_TOKEN_SECRET,
     {
      expiresIn : process.env.ACCESS_TOKEN_EXPRY 
     }
    );
  };
  
  // refresh  token

  userSchema.methods.ganerateRefreshToken = function () {
    return jwt.sign({
      _id : this._id
    },
    process.env.REFRESH_TOKEN,
     {
      expiresIn : process.env.REFRESH_TOKEN_EXPRY
     }    
   )
  }



export const User = mongoose.model('User' , userSchema)