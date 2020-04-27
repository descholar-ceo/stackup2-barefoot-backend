import utils from '../../utils/authentication.utils';
import userRoles from '../../utils/userRoles.utils';

const { passwordHasher } = utils;
const { MANAGER } = userRoles;

export default {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('users', [
    {
    firstName: 'Emmanuel',
    lastName: 'descholar',
    username: 'UDivine',
    email: 'barefootnomad2@gmail.com',
    password: await passwordHasher('barefootnomad2'),
    gender: 'Male',
    address: 'Butare',
    role: 'requester',
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date()
    },
    {
      firstName: 'Emmanuel',
      lastName: 'descholar',
      username: 'commentManager',
      email: 'commentManager@gmail.com',
      password: await passwordHasher('commentManager@1'),
      gender: 'Male',
      address: 'Butare',
      role: 'manager',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
      }

  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('users', null, {})
};
