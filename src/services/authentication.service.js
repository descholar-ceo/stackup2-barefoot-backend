import { Sequelize } from 'sequelize';
import models from '../database/models';
import findUser from '../utils/identifyUser';

const { user } = models;
const sequelize = Sequelize;

/**
 * @param {string} manager 
 * @param {string} email 
 * @param {string} data 
 * @returns {object} Object of messages
 * @description Class to handle users
 */
export default class UserService {
  /**
   * @description Saves user object in the database
   * @param {object} data User data to save to the database
   * @returns {object} dataValues User object that was saved to the database
    */
  static handleSignUp = async (data) => {
    const role = 'requester';
    const isVerified = false;
    const emailNotification = true;
    const inAppNotification = true;
    const provider = 'Barefootnomad';
    const newData = {
      ...data,
      provider,
      role,
      isVerified,
      emailNotification,
      inAppNotification,
    };
    const { dataValues } = await user.create(
      newData,
      {
        fields: [
          'firstName',
          'lastName',
          'username',
          'email',
          'password',
          'provider',
          'gender',
          'address',
          'role',
          'isVerified',
          'emailNotification',
          'inAppNotification',
          'lineManager',
        ],
      },
    );
    return dataValues;
  };

  /**
   * function findAll() returns all users in db
   * @param {string} email
   * @returns {object} returns a user with the email in params
   */
  static findUserByEmail = async (email) => {
    const currUser = findUser(email);
    return currUser;
  };

  /**
   * function findOne() returns all users in db
   * @param {string} value
   * @returns {object} returns a user with the value of email or username in params
   * @description this function findUserByEmailOrUsername returns a profile user 
   * details depending on the value passed
   */
  static findUserByEmailOrUsername = async (value) => {
    let currUser = await user.findOne({
      where: { username: value }
    });
    if (!currUser) {
      currUser = await user.findOne({ where: { email: value } });
    }
    return currUser;
  };

  /**
   * function findOne() returns all users in db
   * @param {string} email
   * @returns {object} returns a user with the email in params in lowercase
   */
  static findUserEmailIfExist = async (email) => {
    const currUser = await user.findOne({
      where: {
        email: sequelize.where(sequelize.fn('LOWER', sequelize.col('email')), 'LIKE', `%${email}%`)
      }
    });
    return currUser;
  };

  /**
   * @param {string} password
   * @param {string} id
   * @returns {object} returns an updated user
   */
  static updateUserPassword = async (password, id) => {
    const updatedUser = await user.update(
      {
        password
      },
      {
        where: { id }
      }
    );
    return updatedUser;
  }

  /**
   * @param {string} value
   * @param {boolean} status
   * @returns {object} returns an updated user
   */
  static updateIsVerifiedOrDisableNotification = async (value, status) => {
    let update;
    if (isNaN(value) && value.includes('@')) {
      update = await user.update(
        { isVerified: true },
        { where: { email: value } }
      );
    } else {
      update = await user.update(
        { emailNotification: !status },
        { where: { id: value } }
      );
    }
    return update;
  }

  /**
   * @param {Number} userId a user id to look for in database
   * @returns {object} returns a user account information
   */
  static getUserById = async (userId) => user.findOne({ where: { id: userId } });

  static getManagerByLineManager = async (manager) => {
    const result = await user.findAll({ attributes: ['id'], where: { lineManager: manager } });
    return result;
  };
}
