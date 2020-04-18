import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

/**
* @param {object} payload
* @returns {object} data
* @description Retrieves form values from request body
*/
const getFormData = async (payload) => {
  const data = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    username: payload.username,
    email: payload.email,
    password: payload.password,
    gender: payload.gender,
    lineManager: payload.lineManager,
    address: payload.address,
  };
  return data;
};

/**
* @param {string} password
* @returns {string} hashedPassword
* @description Encrypts a plain-text password
*/
const passwordHasher = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

/**
   * function findAll() returns all users in db
   * @param {string} currPassword
   * @param {string} hashedPassword
   * @returns {bool} it returns a boolean about the password matching status
   */
const isPasswordTrue = async (currPassword, hashedPassword) => {
  const isPasswordChecked = await bcrypt.compare(currPassword, hashedPassword);
  return isPasswordChecked;
};

/**
* @param {object} data
* @returns {string} token
* @description Generate a jwt token
*/
const generateToken = async (data) => {
  const tokenData = _.omit(data, 'password');
  const token = jwt.sign(
    tokenData,
    process.env.JWT_KEY,
    {
      expiresIn: `${process.env.SIGN_UP_TOKEN_EXPIRES_IN}`
    }
  );
  return token;
};

/**
   * @param {object} token encoded details for the owner of the account
   * @returns {object} details for the owner of the account
   * @description decode the token to get account owner details
   */
const decodeToken = async (token) => {
  const data = jwt.verify(token, process.env.JWT_KEY);
  return data;
};

   /**
   * @param {String} text it is the word that need to be converted
   * @returns {String} it is the word in small letters
   * @description Converts any word into small letter
   */
  const convertToLowerCase = (text) => {
    if (text) {
      return text.toLowerCase();
    }
    return '';
  };
export default {
  getFormData,
  passwordHasher,
  isPasswordTrue,
  generateToken,
  decodeToken,
  convertToLowerCase
};
