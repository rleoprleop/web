var express = require('express');
var router = express.Router();
var models = require('../models')
var crypto = require('crypto');
const { METHODS } = require('http');


/* GET users listing. */
router.get('/sign_up', function (req, res, next) {
  res.render('./users/sign_up');
});

router.post("/sign_up", async function (req, res, next) {
  let body = req.body;
  if (!body.userId || !body.userName || !body.password) {
    return res.redirect('/sign_up_err')
  }

  if (!body.section1) {
    body.section1 = "서울특별시"
  }

  let inputPassword = body.password;
  let salt = Math.round((new Date().valueOf() * Math.random())) + "";
  let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

  await models.user.create({
    name: body.userName,
    user_id: body.userId,
    password: hashPassword,
    salt: salt
  }).catch(err => {
    console.log(err)
  })
  await models.local.create({
    user_id: body.userId,
    section1: body.section1,
    section2: body.section2,
    section3: body.section3,
  }).catch(err => {
    console.log(err)
  })

  res.redirect("/")
})

router.get('/login', function (req, res, next) {
  res.render('users/login');
});

router.post("/login", async function (req, res, next) {
  let body = req.body;

  let result = await models.user.findOne({
    where: {
      user_id: body.userId
    }
  });
  console.log(result);

  if (result == null) {
    console.log("정보 없음");
    return res.redirect("/");
  }

  let dbPassword = result.dataValues.password;
  let inputPassword = body.password;
  let salt = result.dataValues.salt;
  let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

  console.log(hashPassword);
  if (dbPassword === hashPassword) {
    console.log("비밀번호 일치");
    let local = await models.local.findOne({
      where: {
        user_id: body.userId
      }
    });

    return res.redirect("/map/?section1="+local.dataValues.section1+"&section2="+local.dataValues.section2+"&section3="+local.dataValues.section3);
  }
  else {
    console.log("비밀번호 불일치");
    return res.redirect("/");
  }
})

module.exports = router;
