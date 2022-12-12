var express = require('express');
var router = express.Router();
var models = require('../models')
var fs = require('fs')

class Weather {
  key = 'EFHEzjBkBbkp8n6QBL%2BpJCv5FhcrJ2IItzP2rvkJmxia%2FX2DLBX5lELTfwP0fuwkrjW0D7h3xE54VdlI%2FraWjA%3D%3D';
  constructor(section1, section2, section3) {
    this.section1 = section1;
    this.section2 = section2;
    this.section3 = section3;
  }

  sUrl(page, today, time, x, y, z) {
    var url1 = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst'//초단기 실황 1 8개
    var url2 = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst'//초단기 예보 2 카테고리당 6개씩 total 60개
    var url3 = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst'//단기 예보 3  total 918개

    var url;
    if (z == 1) {
      url = url1
    }
    else if (z == 2) {
      url = url2
    }
    else {
      url = url3
    }
    return url + '?serviceKey=' + this.key + '&numOfRows=60&pageNo=' + page + '&dataType=JSON&base_date=' + today + '&base_time=' + time + '&nx=' + x + '&ny=' + y
  }

  sToday(z) {
    let date = new Date();
    let year = date.getFullYear();
    let hour = date.getHours() - 1;
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (1 + date.getMonth())).slice(-2);
    if (z == 3) {
      if (hour % 3 == 0) {
        hour = hour - 1;
      }
      else if (hour % 3 == 1) {
        hour = hour - 2;
      }
    }
    if (hour < 0) {
      hour = hour + 24
      day = ("0" + (day - 1)).slice(-2);
    }

    return String(year) + String(month) + String(day);
  }

  sTime(z) {
    let date = new Date();
    let hour = date.getHours() - 1;
    console.log(z);
    if (z == 3) {
      if (hour % 3 == 0) {
        hour = hour - 1;
      }
      else if (hour % 3 == 1) {
        hour = hour - 2;
      }
    }
    if (hour < 0) {
      hour = hour + 24
    }
    let minute = date.getMinutes();
    console.log(hour);
    console.log(minute);

    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;

    return String(hour) + String(minute);
  }

  sdatajson(dataJson) {
    var user = JSON.parse(dataJson)
    var pos = user.filter(d => d.section1 == this.section1 && d.section2 == this.section2 && d.section3 == this.section3)

    console.log(pos[0])
    return pos[0]
  }
}

async function getApi(url) {
  const axios = require('axios');
  const response = await axios({
    url: url
  })
  return response.data.response.body.items.item
}


router.get('/sign_up_err', function (req, res, next) {
  res.render('users/sign_up_err', { title: "이름, 아이디, 비밀번호를 작성해주세요" });
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('users/login');
});

router.get('/map', async function (req, res, next) {//get query로 section 1,2,3 받아서 날씨 표시.
  var section1 = req.query.section1
  var section2 = req.query.section2
  var section3 = req.query.section3

  if (Object.keys(req.query).length == 1) {
    section2 = ""
    section3 = ""
  }
  else if (Object.keys(req.query).length == 2) {
    section3 = ""
  }
  console.log(req.query);
  var dataBuffer = fs.readFileSync('public/json/data.json')
  const dataJson = dataBuffer.toString()
  var wt = new Weather(section1, section2, section3)
  let posdata = wt.sdatajson(dataJson)
  var x = posdata.sectionX
  var y = posdata.sectionY
  var arr = []
  var arr2 = []

  for (var z = 0; z < 2; z++) {
    let today = wt.sToday(z + 1);
    let time = wt.sTime(z + 1);
    var page = 1;


    var url = wt.sUrl(page, today, time, x, y, z + 1)
    console.log(url);
    arr[z] = await getApi(url)
  }

  for (let i = 0; i < 6; i++) {
    var harr = []

    harr.push(arr[1][i + 6])//pty
    harr.push(arr[1][i + 18])//sky
    harr.push(arr[1][i + 24])//t1h
    arr2.push(harr)
  }
  console.log(arr2[0]);
  res.render('index', { section1: section1, section2: section2, section3: section3, dataing: arr[0], data: arr2 });
})

router.post('/map', function (req, res, next) {
  var local = req.body
  if (Object.keys(local).length == 1) {
    console.log(local);
    return res.redirect("/map/?section1=" + local.section1);
  }
  else if (Object.keys(local).length == 2) {
    console.log(local);
    return res.redirect("/map/?section1=" + local.section1 + "&section2=" + local.section2);
  }
  return res.redirect("/map/?section1=" + local.section1 + "&section2=" + local.section2 + "&section3=" + local.section3);
  //JSON.parse 한 데이터: object Object형태. index.ejs에서 title.section1로 데이터 받기 가능.
});

module.exports = router;
/*
const options = {
  uri: url,
};
request(options, function (err, response, body) {
  var data = JSON.parse(body)
  console.log(data.response);
})*/
/*
{"baseDate":"20221209","baseTime":"2100","category":"PTY","nx":73,"ny":134,"obsrValue":"0"},  강수형태
{"baseDate":"20221209","baseTime":"2100","category":"REH","nx":73,"ny":134,"obsrValue":"92"},  습도
{"baseDate":"20221209","baseTime":"2100","category":"RN1","nx":73,"ny":134,"obsrValue":"0"},  1시간 강수량
{"baseDate":"20221209","baseTime":"2100","category":"T1H","nx":73,"ny":134,"obsrValue":"-1.4"},  기온

{"baseDate":"20221209","baseTime":"2100","category":"UUU","nx":73,"ny":134,"obsrValue":"-0.1"},
{"baseDate":"20221209","baseTime":"2100","category":"VEC","nx":73,"ny":134,"obsrValue":"150"},
{"baseDate":"20221209","baseTime":"2100","category":"VVV","nx":73,"ny":134,"obsrValue":"0.3"},
{"baseDate":"20221209","baseTime":"2100","category":"WSD","nx":73,"ny":134,"obsrValue":"0.3"}
T1H 기온. 
SKY 하늘상태 1 맑음, 3 구름 많음, 4 흐림. 
PTY 강수 형태 
초단기:0없음, 1비, 2비/눈, 3눈, 5빗방울, 6빗방울눈날림, 7눈날림
단기: 0없음, 1비, 2비/눈, 3눈, 4소나기
*/