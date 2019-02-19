var express = require('express');
var router = express.Router();
let model =require('../modules/module.js');
let User = model.getModel('users');
let Chat = model.getModel('chat');
let utility = require('utility')
/* GET users listing. */

/**加密密码 */
const _filter = {'pwd': 0, '__v': 0}
function md5Pwd(pwd) {
  let salt = 'this_is+a?$#@salt__&*%';
  return utility.md5(utility.md5(salt+pwd))
}
// 注册
router.post('/register', (req, res) => {
  const {user, pwd, type} = req.body;
  User.findOne({user}, (err, doc) => {
    if(doc) {
      return res.json({
        code: 1,
        msg: '用户名已存在'
      })
    }
    const userModel = new User({user, pwd: md5Pwd(pwd), type});
    userModel.save((err, doc) => {
      if (err) {
        return res.json({
          msg: '后台出错了'
        })
      };
      const {user, type, _id} = doc;
      res.cookie('userid', _id);
      res.json({
        code: 0,
        data: {user, type, _id}
      })
    })
  })
})

// 登录   
router.post('/login', (req, res) => {
  const {user, pwd} = req.body;
  User.findOne({user, pwd: md5Pwd(pwd)}, _filter, (err, doc) => {
    if (!doc) {
      return res.json({
        code: 1,
        msg: '用户名密码错误'
      })
    } else {
      res.cookie('userid', doc._id)
      res.json({
        code: 0,
        data: doc
      })
    }
  })
})

//验证用户是否登录
router.get('/info', (req, res) => {
  const userid = req.cookies.userid;
  if (!userid) {
    return res.json({
      code: 1,
      msg: '请重新登录'
    })
  }
  User.findOne({_id: userid}, _filter, (err, doc) => {
    if (err) {
      return res.json({
        code: 1,
        msg: '后端出错'
      })
    };
    return res.json({
      code: 0,
      data: doc
    })
  })
})

// 完善注册信息
router.post('/update', (req, res) => {
  let userid = req.cookies.userid;
  if (!userid) {
    return res.json({
      code: 1,
      msg: '请重新登录'
    })
  }
  let body = req.body.data;
  User.findByIdAndUpdate(userid, body, (err, doc) => {
    if (err) {
      return res.json({
        code: 1,
        msg: '后端出错了'
      })
    }
    const data = Object.assign({}, {
      user: doc.user,
      type: doc.type
    }, body)
    return res.json({
      code: 0,
      data
    })
  })
})

//查询聊天信息
router.get('/getmsglist', (req, res) => {
  const userid = req.cookies.userid;
  User.find({}, (err, userdoc) => {
    let users = {};
    userdoc.forEach( v => {
      users[v._id] = {
        name: v.user,
        avatar: v.avatar
      }
    })
    Chat.find({"$or": [{from: userid}, {to: userid}]}, (err, doc) => {
      if (!err) {
        return res.json({
          code: 0,
          data: doc,
          users
        })
      }
    })
  })
  
})

// 获取读过聊天个数
router.post('/readmsg', (req, res) => {
  const userid = req.cookies.userid;
  const {from} = req.body;
  Chat.update({from, to: userid},
    {'$set': {read: true}},
    {'multi':true},
    (err, doc) => {
      if (!err) {
        return res.json({
          code: 0,
          num: doc.nModified
        })
      }
      return res.json({
        code: 1,
        msg: '出错了'
      })
    })
})

//获取 BOSS || 求职 类表
router.get('/list', (req, res) => {
  const {type} = req.query
  User.find({type}, (err, doc) => {
    return res.json({
      code: 0,
      data: doc
    })
  })
})


// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;
