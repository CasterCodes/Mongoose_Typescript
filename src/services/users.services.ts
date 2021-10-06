import {DocumentDefinition, FilterQuery, QueryOptions} from 'mongoose';
import User, { UserDocument } from '../models/user.model';



export const findUser = async (query: FilterQuery<UserDocument>, options = {lean:true})  => {
      return await User.findOne(query, null, options);
}


export const validateUserEmailAndPassword = async (email:UserDocument['email'], password: UserDocument['password']) => {
      const user = await findUser({email}, {lean:true});
       //@ts-ignore
      if(!user)  throw new Error('Invalid email or password');

      return user.comparePassword(password);
}


export const createUser = async (userInfo: DocumentDefinition<UserDocument>) => {
      return await User.create(userInfo);
}

export const deleteAllUsers = async () => {
    return await User.deleteMany({})
}