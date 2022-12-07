var express = require('express');
var router = express.Router();
var fs = require('fs')

class Weather {
  key = 'EFHEzjBkBbkp8n6QBL%2BpJCv5FhcrJ2IItzP2rvkJmxia%2FX2DLBX5lELTfwP0fuwkrjW0D7h3xE54VdlI%2FraWjA%3D%3D';

  constructor(section1, section2, section3, z) {
    this.section1 = section1;
    this.section2 = section2;
    this.section3 = section3;
    this.z = z;
  }

  sUrl(key, today, time, x, y, z) {
    var url1 = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst'//초단기 실황 1
    var url2 = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst'//초단기 예보 2
    var url3 = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst'//단기 예보 3

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
    return url + '?serviceKey=' + key + '&numOfRows=15&pageNo=1&dataType=JSON&base_date=' + today + '&base_time=' + time + '&nx=' + x + '&ny=' + y
  }

  sToday() {
    let date=new Date();
    let year = date.getFullYear();
    let month = ("0" + (1 + date.getMonth())).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);

    return String(year) + String(month) + String(day);
  }

  sTime() {
    let date=new Date();
    let hour = date.getHours() - 1;
    if (hour < 0) {
      hour = 23
    }
    console.log(hour);

    let minute = date.getMinutes();
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

/* GET home page. */
router.get('/', function (req, res, next) {
  var dataBuffer = fs.readFileSync('public/json/data.json')
  const dataJson = dataBuffer.toString()
  var wt = new Weather("서울특별시", "", "", 1)

  let key=wt.key;
  let today=wt.sToday();
  let time=wt.sTime();
  let posdata = wt.sdatajson(dataJson)
  var x = posdata.sectionX
  var y = posdata.sectionY
  var url = wt.sUrl(key,today,time,x,y,1)
  console.log(url);
  const request=require('request');
  const options = {
    uri: url,
  };
  request(options, function (err, response, body) {
    var data = JSON.parse(body)
    console.log(data.response);
  })

  res.render('index', { title: 'Express' });
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