import chai from 'chai';
import UserService from '../../src/services/authentication.service';
import mochData from '../data/mockData';


const { 
    handleSignUp, 
    findUserByEmail, 
    findUserByEmailOrUsername, 
    findUserEmailIfExist, 
    updateUserPassword,
    updateIsVerifiedOrDisableNotification
} = UserService;

let returnedId;
let returnedEmail;
let returnedUsername;

const { userServiceData } = mochData;

describe('User authentication services tests', () => {
  it('Should Create a new user in the database', (done) => {
    handleSignUp(userServiceData)
      .then(data => {
        const { id, email, username } = data;
        returnedId = id;
        returnedEmail = email;
        returnedUsername = username;
        chai.expect(data.firstName).to.be.a('string');
        done();
      })
      .catch(error => { console.log(error); done(); });
  });
  it('Should find a new user by email', (done) => {
    findUserByEmail(returnedEmail)
      .then(data => {
        chai.expect(data.dataValues.firstName).to.be.a('string');

        done();
      })
      .catch(error => { console.log(error); done(); });
  });
  it('Should find a new user by username', (done) => {
    findUserByEmailOrUsername(returnedUsername)
      .then(data => {
        chai.expect(data.dataValues.firstName).to.be.a('string');
        done();
      })
      .catch(error => { console.log(error); done(); });
  });
  it('Should find a new user by email', (done) => {
    findUserByEmailOrUsername(returnedEmail)
      .then(data => {
        chai.expect(data.dataValues.firstName).to.be.a('string');
        done();
      })
      .catch(error => { console.log(error); done(); });
  });
  it('Should check if an email exist', (done) => {
    findUserEmailIfExist(returnedEmail)
      .then(data => {
        chai.expect(data.dataValues.firstName).to.be.a('string');

        done();
      })
      .catch(error => { console.log(error); done(); });
  });
  it('Should check if an email exist', (done) => {
    updateUserPassword('newPassword', returnedId)
        .then(data => {
        chai.expect(data).to.be.an('array');

        done();
      })
      .catch(error => { console.log(error); done(); });
  });
  it('Should verify the user', (done) => {
    updateIsVerifiedOrDisableNotification(returnedEmail)
        .then(data => {
        chai.expect(data).to.be.an('array');
        done();
      })
      .catch(error => { console.log(error); done(); });
  });
});
