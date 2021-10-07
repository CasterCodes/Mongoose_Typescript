import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

export interface UserInput {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface UserDocument extends UserInput, Document {
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstNam: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// virtual method

userSchema.virtual("fullName").get(function (this: UserDocument) {
  return `${this.firstName}  ${this.lastName}`;
});

userSchema.pre("save", async function (this: UserDocument, next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);

  const hashedPassword = await bcrypt.hash(salt, this.password);

  this.password = hashedPassword;

  return next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this;
  //@ts-ignore
  return await bcrypt
    .compare(candidatePassword, user.password)
    .catch((error) => false);
};

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
