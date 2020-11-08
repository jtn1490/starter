module.exports = class UsersService {
  db;
  constructor({ db }) {
    this.db = db;
  }

  static getClassKey() {
    return "userService";
  }

  getUsers() {
    return this.db.User.find();
  }
};
