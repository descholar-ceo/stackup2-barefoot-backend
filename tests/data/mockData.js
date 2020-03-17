import dotenv from 'dotenv';
import roles from '../../src/utils/userRoles.utils';

dotenv.config();

export default {
  signupData: {
    firstName: 'John',
    lastName: 'Doe',
    username: 'Jdoe',
    email: 'john@doe.com',
    address: 'Kigali',
    password: 'Helloworld3@',
    gender: 'Male',
  },
  invalidFirstname: {
    firstName: 'Jo 3hn',
    lastName: 'Doe',
    username: 'Jdoe',
    email: 'john@doe.com',
    address: 'Kigali',
    password: 'Helloworld3@',
    gender: 'Male',
  },
  invalidLastname: {
    firstName: 'John',
    lastName: 'Do 3e',
    username: 'Jdoe',
    email: 'john@doe.com',
    address: 'Kigali',
    password: 'Helloworld3@',
    gender: 'Male',
  },
  invalidUsername: {
    firstName: 'John',
    lastName: 'Doe',
    username: 'Jdo,e',
    email: 'john@doe.com',
    address: 'Kigali',
    password: 'Helloworld3@',
    gender: 'Male',
  },
  invalidEmail: {
    firstName: 'John',
    lastName: 'Doe',
    username: 'Jdoe',
    email: 'john@doe',
    address: 'Kigali',
    password: 'Helloworld3@',
    gender: 'Male',
  },
  invalidGender: {
    firstName: 'John',
    lastName: 'Doe',
    username: 'Jdoe',
    email: 'john@doe.com',
    address: 'Kigali',
    password: 'Helloworld3@',
    gender: 'none',
  },
  invalidPassword: {
    firstName: 'John',
    lastName: 'Doe',
    username: 'Jdoe',
    email: 'john@doe.com',
    address: 'Kigali',
    password: 'hellowo',
    gender: 'Male',
  },
  invalidAddress: {
    firstName: 'John',
    lastName: 'Doe',
    username: 'Jdoe',
    email: 'john@doe.com',
    address: 'Kiga 3li',
    password: 'Helloworld3@',
    gender: 'Male',
  },
  multiCitiestripRequest: {
    travelFrom: ['Butare', 'Musanze'],
    travelTo: ['Musanze', 'Rusizi'],
    travelDate: ['2020-08-09', '2020-08-16'],
    travelReason: 'business meeting',
    travelType: 'multi-cities',
    accommodation: true
  },
  multiCitiestripRequestGreaterThan3OrLessThan2: {
    travelFrom: ['Butare'],
    travelTo: ['Musanze'],
    travelDate: ['2020-08-09'],
    travelReason: 'business meeting',
    travelType: 'multi-cities',
    accommodation: true
  },
  multiCitiesDifferentLocation1: {
    travelFrom: ['Butare', 'Musanze'],
    travelTo: ['kigali', 'Rusizi'],
    travelDate: ['2020-08-09', '2020-08-16'],
    travelReason: 'business meeting',
    travelType: 'multi-cities',
    accommodation: true
  },
  multiCitiesDifferentLocation2: {
    travelFrom: ['Butare', 'Musanze', 'Kayonza'],
    travelTo: ['Musanze', 'Rusizi', 'Huye'],
    travelDate: ['2020-08-09', '2020-08-16', '2020-08-24'],
    travelReason: 'business meeting',
    travelType: 'multi-cities',
    accommodation: true
  },
  multiCitiesSameLocation: {
    travelFrom: ['Butare', 'Musanze', 'Musanze'],
    travelTo: ['Musanze', 'Musanze', 'Huye'],
    travelDate: ['2020-08-09', '2020-08-16', '2020-08-24'],
    travelReason: 'business meeting',
    travelType: 'multi-cities',
    accommodation: true
  },
  multiCitiesNotSameArrayLength: {
    travelFrom: ['Butare', 'Musanze', 'Kayonza'],
    travelTo: ['Musanze', 'Kayonza'],
    travelDate: ['2020-08-09', '2020-08-16', '2020-08-24'],
    travelReason: 'business meeting',
    travelType: 'multi-cities',
    accommodation: true
  },
  multiCitiesFirstOriginEqualToDestination: {
    travelFrom: ['Butare', 'Musanze', 'Kayonza'],
    travelTo: ['Musanze', 'Kayonza', 'Butare'],
    travelDate: ['2020-08-09', '2020-08-16', '2020-08-24'],
    travelReason: 'business meeting',
    travelType: 'multi-cities',
    accommodation: true
  },
  multiCitiesGreaterThanDate: {
    travelFrom: ['Butare', 'Musanze'],
    travelTo: ['Musanze', 'Rusizi'],
    travelDate: ['2020-08-29', '2020-08-16'],
    travelReason: 'business meeting',
    travelType: 'multi-cities',
    accommodation: true
  },
  invalidMultiCitiesTripRequest: {
    travelFrom: ['Butare'],
    travelTo: 'Musanze',
    travelDate: ['2020-02-25', '2020-02-26'],
    travelReason: '',
    travelType: 'multi-cities',
    accommodation: true
  },
  realLoginDataFromTheDb: {
    email: 'john@doe.com',
    password: 'Helloworld3@'
  },
  realLoginDataFromTheDb1: {
    username: 'Jdoe',
    password: 'Helloworld3@'
  },
  WrongLoginPasswordData: {
    email: 'john@doe.com',
    password: '12334ewe'
  },
  WrongLoginEmailData: {
    email: 'emmamugi@gmail.com',
    password: 'Helloworld3@'
  },
  emptyLoginPassword: {
    email: 'john@doe.com',
    password: ''
  },
  emptyLoginEmail: {
    email: '',
    password: 'hheerrr'
  },
  userServiceData: {
    firstName: 'Jane',
    lastName: 'Doe',
    username: 'Jdoe',
    email: 'jane@doe.com',
    address: 'Kigali',
    password: 'Helloworld3@',
    gender: 'Female',
  },
  usernameGeneratorUtil: {
    firstName: 'Joe',
    lastName: 'Doe',
    address: 'Kigali',
    password: 'Helloworld3@',
    gender: 'Male',
  },
  usernameGeneratorUtilOne: {
    firstName: 'Joy',
    lastName: 'Doe',
    email: 'joy@doe.com',
    address: 'Kigali',
    password: 'Helloworld3@',
    gender: 'Female',
  },
  usernameGeneratorUtilTwo: {
    firstName: 'Jeff',
    lastName: 'Brad',
    email: 'andela@user.com',
    address: 'Kigali',
    password: 'Helloworld3@',
    gender: 'Female',
  },
  usernameGeneratorUtilThree: {
    firstName: 'Lyse',
    lastName: 'Brown',
    email: 'andela@user.com',
    address: 'Kigali',
    password: 'Helloworld3@',
    gender: 'Female',
  },
  emailGeneratorUtil: {
    email: 'andela@user.com'
  },
  oneWayTripRequester: {
    firstName: 'John',
    lastName: 'Doe',
    username: 'onewaytripreqr',
    email: 'onewaytripreqr@example.com',
    address: 'Kigali',
    password: 'Onewaytripreq123@',
    gender: 'Male',
  },
  oneWayTripRequester1: {
    firstName: 'John',
    lastName: 'Doe',
    username: 'onewaytripreqr2',
    email: 'onewaytripreqr2@example.com',
    address: 'Kigali',
    password: 'Onewaytripreq1234@',
    gender: 'Male',
  },
  tripRequesterNoCommentYet: {
    firstName: 'John',
    lastName: 'Doe',
    username: 'onewaytripreqrnocommentyet',
    email: 'onewaytripreqrnocommentyet@example.com',
    address: 'Kigali',
    password: 'Onewaytripreq123@',
    gender: 'Male',
  },
  tripRequesterManagerNoRquestYet: {
    firstName: 'John',
    lastName: 'Doe',
    username: 'tripRequesterManagerNoRquestYet',
    email: 'tripRequesterManagerNoRquestYet@example.com',
    address: 'Kigali',
    password: 'Onewaytripreq123@',
    gender: 'Male',
  },
  managerLoginValidData: {
    email: 'tripRequesterManagerNoRquestYet@example.com',
    password: 'Onewaytripreq123@'
  },
  oneWayTripRequest: {
    travelFrom: 'kigali',
    travelTo: 'Butare',
    travelDate: new Date(),
    travelReason: 'business meeting',
    travelType: 'one-way',
    accommodation: true,
  },
  oneWayTripRequest2: {
    travelFrom: 'Nyanza',
    travelTo: 'Butare',
    travelDate: '2020-05-01',
    travelReason: 'vaccations',
    travelType: 'one-way',
    accommodation: true
  },
  realLoginDataFromDbVerifiedUser: {
    email: 'john@doe.com',
    password: 'Markjoe45@'
  },
  realLoginDataFromDbVerifiedUserwithUsername: {
    username: 'Jdoe',
    password: 'Markjoe45@'
  },
  realLoginDataFromDbUnVerifiedUser: {
    email: 'barefootnomad2@gmail.com',
    password: 'barefootnomad2'
  },
  updateProfileWithValidData: {
    firstName: 'Emma',
    lastName: 'descholar',
    username: 'descholartr',
    gender: 'Male',
    birthDate: '2000-01-01',
    preferredCurrency: 'USD',
    preferredLanguage: 'English',
    department: 'IT',
    idCardNumber: '123456789'
  },
  updateProfileWithEmailWithinThem: {
    email: 'barefootnomad@gmail.com',
    firstName: 'Emma',
    lastName: 'descholar',
    username: 'descholartr',
    gender: 'Male',
    birthDate: '2000-01-01',
    preferredCurrency: 'USD',
    preferredLanguage: 'English',
    department: 'IT',
    idCardNumber: '123456789'
  },
  updateProfileWithEmptyUsername: {
    firstName: 'Emma',
    lastName: 'descholar',
    username: '',
    gender: 'Male',
    birthDate: '2000-01-01',
    preferredCurrency: 'USD',
    preferredLanguage: 'English',
    department: 'IT',
    idCardNumber: '123456789'
  },
  updateProfileWithAlreadyExistsUsername: {
    firstName: 'Emma',
    lastName: 'descholar',
    username: 'UDivine',
    gender: 'Male',
    birthDate: '2000-01-01',
    preferredCurrency: 'USD',
    preferredLanguage: 'English',
    department: 'IT',
    idCardNumber: '123456789'
  },
  changeUserPasswordWithValidDataAndVerified: {
    password: 'Mugirase1@', oldPassword: 'clueradevil'
  },
  changeUserPasswordWithValidData: {
    password: 'Mugirase1@', oldPassword: 'Markjoe45@'
  },
  changeUserPasswordWithInValidData: {
    password: 'Mugirase1', oldPassword: 'Markjoe45@'
  },
  changeUserPasswordWithoutOldPassword: {
    password: 'Mugirase1@'
  },
  findUserByEmailOfUsername: 'barefootnomad2@gmail.com',
  existEmail: {
    email: 'john@doe.com'
  },
  notExistEmail: {
    email: 'joe1@gmail.com'
  },
  invalidResetEmail: {
    email: 'joe1mail.com'
  },
  invalidNewPassword: {
    password: 'min'
  },
  validNewPassword: {
    password: 'Markjoe45@'
  },
  testingTokens: {
    expiredToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiQmVydHJhbmQiLCJsYXN0TmFtZSI6Ik1hc2FibyIsInVzZXJuYW1lIjoiYmVydHJhbmQiLCJlbWFpbCI6ImJlcnRyYW5kbWFzYWJvMjJAZ21haWwuY29tIiwiZ2VuZGVyIjoiTWFsZSIsImFkZHJlc3MiOiJLaWdhbGkiLCJyb2xlIjoicmVxdWVzdGVyIiwiaXNWZXJpZmllZCI6ZmFsc2UsImNyZWF0ZWRBdCI6IjIwMjAtMDMtMTZUMjM6Mjk6NDUuNTc3WiIsInVwZGF0ZWRBdCI6IjIwMjAtMDMtMTZUMjM6Mjk6NDUuNTc3WiIsImlhdCI6MTU4NDQwMTQxMywiZXhwIjoxNTg0NDAxNzEzfQ.Xk_N8YspMiuUlwtIoqPTIdfYlzOaf_zOmYTkasQNI4c',
    wrongToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVnaXp3ZW5heW9kaW55QGdtYWlsLmNvbSIsInVzZXJJZCI6MSwiZmlyc3ROYW1lIjoiRGl2aW5lIiwiaWF0IjoxNTgzNDkyMzcxfQ.NHfHvcHcjVhaTYfrywu0-voW_VdVgH2Qcj4CTMOFhdU'
  },
  signupDataNotVerified: {
    firstName: 'John',
    lastName: 'Doe',
    username: 'notVerified',
    email: 'notVerified@doe.com',
    address: 'Kigali',
    password: 'Helloworld3@',
    gender: 'Female',
  },
  returnTripRequest: {
    travelFrom: 'Gisenyi',
    travelTo: 'Musanze',
    travelDate: new Date(Date.now() + 432000000),
    returnDate: new Date(Date.now() + 518400000),
    travelReason: 'vacation',
    travelType: 'return-trip',
    accommodation: true
  },
  returnTripInvalidType: {
    travelFrom: 'kigali',
    travelTo: 'Butare',
    travelDate: '2020-08-09',
    returnDate: new Date(),
    travelReason: 'business meeting',
    travelType: 'return-t',
    accommodation: true,
  },
  invalidReturnDate: {
    travelFrom: 'kigali',
    travelTo: 'Butare',
    travelDate: '2020-08-05',
    travelReason: 'business meeting',
    travelType: 'return-trip',
    accommodation: true,
  },
  loginSuperUser: {
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PASSWORD
  },
  assignRole: {
    email: 'barefootnomad2@gmail.com',
    role: 'Manager'
  },
  assignExistingRole: {
    email: 'barefootnomad2@gmail.com',
    role: 'Manager'
  },
  assignRoleNotUser: {
    email: 'notExist@gmail.com',
    role: 'Manager'
  },
  assignWrongRole: {
    email: 'notExist@gmail.com',
    role: 'Wrong'
  },
  assignRoleInvalidEmail: {
    email: 'notExistgmail.com',
    role: 'Manager'
  },
  normalUser: {
    firstName: 'normal',
    lastName: 'normal',
    username: 'normal',
    email: 'normal@barefootnomad.com',
    address: 'Kigali',
    password: 'Helloworld3@',
    gender: 'Male',
  },
  adminUser: {
    firstName: 'admin',
    lastName: 'admin',
    username: 'admin',
    email: 'admin1@admin.com',
    address: 'Kigali',
    password: 'Helloworld3@',
    gender: 'Male',
  },
  adminRole: {
    email: 'admin1@admin.com',
    role: roles.SUPER_ADMIN
  },
  changeSuperUser: {
    email: process.env.SUPER_ADMIN_EMAIL,
    role: 'Manager'
  },
  loginAdminUser: {
    email: 'admin1@admin.com',
    password: 'Helloworld3@'
  },
  postCommentWithValidData: {
    requestId: 1,
    comment: 'That is nice'
  },
  searchTripRequests: {
    field: 'travelDate',
    search: '2020-01-01',
    limit: 5,
    offset: 0,
  },
  tripsStatsValidTimeframe: {
    startDate: '2020-01-01',
    endDate: '2020-01-08',
  },
  tripsStatsInvalidTimeframe: {
    startDate: '2020-01-08',
    endDate: '2020-01-01',
  },
  assignEmptyRole: {
    email: 'barefootnomad2@gmail.com'
  },
  assignEmptyEmail: {
    role: 'Manager'
  },
  travelUpdated: {
    travelFrom: 'california',
    travelTo: 'kibuye',
    travelDate: new Date(),
    travelReason: 'business meeting',
    accommodation: true
  },
  duplicateUpdate: {
    travelDate: '2020-06-01',
  },
  updateUser: {
    firstName: 'Peter',
    lastName: 'Kamanzi',
    username: 'pepe',
    email: 'peter@gmail.com',
    address: 'Kigali',
    password: 'Helloworld3@',
    gender: 'Male',
  },
  updator: {
    email: 'updator@gmail.com',
    password: 'Updator@0000'
  },
  bookAccommodation: {
    accommodationId: 1,
    arrivalDate: new Date(Date.now() + 432000000),
    departureDate: new Date(Date.now() + 518400000),
  },
  AccommodationBooker: {
    firstName: 'Accommodation',
    lastName: 'Booker',
    username: 'AccommodationBooker',
    email: 'accommodationbooker@example.com',
    address: 'Kigali',
    password: 'Onewaytripreq123@',
    gender: 'Female',
  },
  bookerReturnTripRequest: {
    travelFrom: 'Butare',
    travelTo: 'kigali',
    travelDate: new Date(Date.now() + 259200000),
    returnDate: new Date(Date.now() + 432000000),
    travelReason: 'personal reasons',
    travelType: 'return-trip',
    accommodation: true,
  },
  manager1Account: {
    firstName: 'James',
    lastName: 'Wayne',
    username: 'jameswayne',
    email: 'james@wayne.com',
    address: 'Kigali',
    password: 'Onewaytripreq123@',
    gender: 'Male',
  },
  manager2Account: {
    firstName: 'Oprah',
    lastName: 'Winfrey',
    username: 'oprahwin',
    email: 'oprah@winfrey.com',
    address: 'Kigali',
    password: 'Onewaytripreq123@',
    gender: 'Female',
    role: roles.MANAGER,
  },
  notRegisteredEmail: 'lebro@lebron.com',
  tripRequestSample: {
    travelFrom: 'Musanze',
    travelTo: 'Rubavu',
    travelDate: '2020-06-20',
    travelReason: 'business meeting',
    travelType: 'one-way',
    accommodation: true,
  },
  unexistantUserId: 1000,
  invalidUserId: 'abcd',
  tripRequestSample1: {
    travelFrom: 'kampala',
    travelTo: 'Butare',
    travelDate: '2020-06-12',
    travelReason: 'business meeting',
    travelType: 'one-way',
    accommodation: true,
  },
  tripRequestSample2: {
    travelFrom: 'Musanze',
    travelTo: 'Rubavu',
    travelDate: '2020-06-26',
    travelReason: 'business meeting',
    travelType: 'one-way',
    accommodation: true,
  },
  requester3Account: {
    firstName: 'Oprah',
    lastName: 'Winfrey',
    username: 'oprah@winn',
    email: 'oprahwin@winfrey.com',
    address: 'Kigali',
    password: 'Onewaytripreq123@',
    gender: 'Female',
  },
  unexistantLineManager: 1000,
};
