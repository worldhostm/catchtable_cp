import { connectDB } from './mongodb';
import { User, IUser } from './models/User';
import { TempPassword, ITempPassword } from './models/TempPassword';
import { Types } from 'mongoose';

export class UserService {
  async createUser(userData: {
    username: string;
    password: string;
    name: string;
    phone: string;
    email: string;
  }): Promise<IUser> {
    await connectDB();
    
    const user = new User(userData);
    return await user.save();
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    await connectDB();
    
    return await User.findOne({ username }).exec();
  }

  async getUserByNameAndPhone(name: string, phone: string): Promise<IUser | null> {
    await connectDB();
    
    return await User.findOne({ name, phone }).exec();
  }

  async getUserByUsernameAndEmail(username: string, email: string): Promise<IUser | null> {
    await connectDB();
    
    return await User.findOne({ username, email }).exec();
  }

  async getUserById(userId: string | Types.ObjectId): Promise<IUser | null> {
    await connectDB();
    
    return await User.findById(userId).exec();
  }

  async createTempPassword(userId: string | Types.ObjectId, tempPassword: string, expiresAt: Date): Promise<ITempPassword> {
    await connectDB();
    
    await TempPassword.updateMany(
      { userId, used: false },
      { used: true }
    );

    const tempPasswordDoc = new TempPassword({
      userId,
      tempPassword,
      expiresAt
    });

    return await tempPasswordDoc.save();
  }

  async updateUserPassword(userId: string | Types.ObjectId, newPassword: string): Promise<IUser | null> {
    await connectDB();
    
    return await User.findByIdAndUpdate(
      userId,
      { password: newPassword, updatedAt: new Date() },
      { new: true }
    ).exec();
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    await connectDB();
    
    const user = await User.findOne({ username }).select('_id').exec();
    return !!user;
  }

  async checkEmailExists(email: string): Promise<boolean> {
    await connectDB();
    
    const user = await User.findOne({ email }).select('_id').exec();
    return !!user;
  }

  async checkPhoneExists(phone: string): Promise<boolean> {
    await connectDB();
    
    const user = await User.findOne({ phone }).select('_id').exec();
    return !!user;
  }
}

export const userService = new UserService();