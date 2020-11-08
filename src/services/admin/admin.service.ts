module.exports = class AdminService {
  db;
  constructor({ db }) {
    this.db = db;
  }

  static getClassKey() {
    return "adminService";
  }

  getAdmin() {
    return this.db.Admin.find();
  }
};
