


const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/recruiment-datas';
mongoose.connect(DB_URL);
const models = {
  users: {
    'user': {type: String, require: true},
    'pwd': {type: String, require: true},
    'type': {type: String, require: true},
    'avatar': String, //头像
    'desc': String, //个人简介 || 职位简介
    'title': String, //职位名称
    'company': String,
    'money': String
  },
  chat: {
    'chatid': {type: String, require: true},
    'from': {type: String, require: true},
    'to': {type: String, require: true},
    'read': {type: Boolean, default: false},
    'content': {type: String, require: true, default: ''},
    'creat_time': {type: Number, default: Date.now},
  }
};

for (let m in models) {
  let everyModel = mongoose.model(m, new mongoose.Schema(models[m]))
}

module.exports = {
  getModel(name) {
    return mongoose.model(name)
  }
}
