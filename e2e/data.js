const random = require('./helpers/random');
const value = random(20);

const data = {
    server: 'https://sso.daddyauden.com',
    alternateServer: 'https://sso.daddyauden.com',
    user: '***',
    password: '***',
    alternateUser: 'auden',
    alternateUserPassword: '***',
    alternateUserTOTPSecret: '***',
    existingEmail: '***@gmail.com',
    existingName: '***',
    email: '***@gmail.com',
    random: value,
};

module.exports = data;
