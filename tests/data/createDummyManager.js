/* eslint-disable require-jsdoc */
import models from '../../src/database/models';

const { sequelize } = models;

const insertManager = async () => {
    const INSERT_MANAGER_USER = `
    INSERT INTO users ("firstName", "lastName", username, email, password, provider, gender, address, role, "isVerified", "emailNotification", "inAppNotification", "updatedAt", "createdAt")
    VALUES('James','Patrick','user2','user@example.com','$2b$10$fRo9jYWBNmom2iZ3H2./Iu9bOHHPKn3zJMNYjUKRvg7.9ysIEwJ5S','barefootNomad','Male','Kigali','manager','true','true', 'true',NOW(),NOW())`;
    sequelize.query(INSERT_MANAGER_USER);
};
export default insertManager;
