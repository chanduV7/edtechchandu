const User = require("../model/userModel");
const { genSalt, hash, compare } = require("bcrypt");
const CryptoJS = require("crypto-js");
const TokenModel = require("../model/passwordToken");
const sendMail = require("../utils/mailer");

const register = async (req) => {
  const userData = await User.find({ email: req.body.email });
  if (userData.length) {
    throw new Error("Email already registered");
  }
  const userDataP = await User.find({ phone: req.body.phone });
  if (userDataP.length) {
    throw new Error("Phone already registered");
  }
  const { password } = req.body;
  const salt = await genSalt();
  const hashedPass = await hash(password, salt);
  const data = await User.create({
    ...req.body,
    password: hashedPass,
  });
  return data;
};

const login = async (req) => {
  const { email, password } = req.body;
  const userData = await User.find({ email });
  if (!userData.length) throw new Error("Email not found");
  const { password: hashedPass, _id } = userData[0];
  const checkPass = await compare(password, hashedPass);
  if (!checkPass) throw new Error("Wrong Credentials");
  const token = CryptoJS.AES.encrypt(
    JSON.stringify({
      email,
      userId: _id,
    }),
    process.env.CRYPTO_SECRET // used for encryption and decryption
  ).toString();
  return {
    userId: _id,
    email,
    token,
  };
};

const loggedInUser = async (req) => {
  return User.findById(req.userId);
};

const getUser = async (req) => {
  const userId = req.params.userId;
  return User.findById(userId);
};

const getAllUsers = async (req) => {
  return User.find({});
};

const updateUser = async (req) => {
  const userId = req.params.userId;
  return User.findOneAndUpdate({ _id: userId }, req.body, { new: true });
};

const passwordReset = async (req) => {
  const userData = await User.findOne({ email: req.body.email });
  if (!userData.email) throw new Error("Email not found");
  const token = CryptoJS.AES.encrypt(
    userData._id.toString(),
    process.env.CRYPTO_SECRET
  ).toString();
  const date = new Date().getTime();
  sendMail(req.body.email,token);
  return TokenModel.create({ token, createdAt: date });
};

const verify = async (req) => {
  const { token } = req.query;
  const tokenData = TokenModel.findOne({ token });
  if (!tokenData.token) throw new Error("link not found");
  if (token.createdAt + 3600000 < new Date().getTime())
    throw new Error("Link expired");
  const userId = CryptoJS.AES.decrypt(
    token,
    process.env.CRYPTO_SECRET
  ).toString(CryptoJS.enc.Utf8);
  return { data: true, userId, tokenId: tokenData._id.toString() };
};

const changePass = async (req) => {
  const { password, userId, tokenId } = req.body;
  const salt = await genSalt();
  const hashedPass = await hash(password, salt);
  await TokenModel.findByIdAndDelete(tokenId);
  return User.findOneAndReplace(
    { _id: userId },
    { password: hashedPass },
    { new: true }
  );
};

module.exports = {
  register,
  login,
  loggedInUser,
  getUser,
  getAllUsers,
  updateUser,
  passwordReset,
  verify,
  changePass
};
