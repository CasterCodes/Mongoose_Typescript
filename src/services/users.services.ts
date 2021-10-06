import {CreateQuery, FilterQuery, QueryOptions} from 'mongoose';
import User from '../models/user.model';



export const findUser = async (query, options = {lean:true})  => {
      return await User.findOne(query, null, options);
}


export const validateUserEmailAndPassword = async (email, password) => {
      const user = await findUser({email}, {lean:true});

      if(!user) throw new Error('Invalid email or password');

      return user.comparePassword(password);
}


export const createUser = async (userInfo) => {
      return await User.create(userInfo);
}

export const deleteAllUsers = async () => {
    return await User.deleteMany({})
}