module.exports=class Weather {
    key = 'EFHEzjBkBbkp8n6QBL%2BpJCv5FhcrJ2IItzP2rvkJmxia%2FX2DLBX5lELTfwP0fuwkrjW0D7h3xE54VdlI%2FraWjA%3D%3D';
    section1 = '서울특별시';
    section2 = '노원구';
    section3 = '월계1동';
    dataJson='';
    date='';
    z=1;

    constructor(section1,section2,section3,dataJson,date,z) {
        this.section1 = section1;
        this.section2 = section2;
        this.section3 = section3;
        this.dataJson=dataJson;
        this.date=date;
        this.z=z;
    }

    setUrl(key, date, time, x, y) {
        var url1 = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst'//초단기 실황 1
        var url2 = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst'//초단기 예보 2
        var url3 = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst'//단기 예보 3

        var url;
        if(z==1){
            url = url1
        }
        else if(z==2){
            url=url2
        }
        else{
            url=url3
        }
        return url + '?serviceKey=' + key + '&numOfRows=15&pageNo=1&dataType=JSON&base_date=' + date + '&base_time=' + time + '&nx=' + x + '&ny=' + y
    }

    setToday() {
        var year = date.getFullYear();
        var month = ("0" + (1 + date.getMonth())).slice(-2);
        var day = ("0" + date.getDate()).slice(-2);

        return year + month + day;
    }

    setTime() {
        var date = new Date();
        let hour = date.getHours() - 1;
        if (hour < 0) {
            hour = 23
        }
        let minute = date.getMinutes();

        hour = hour >= 10 ? hour : '0' + hour;
        minute = minute >= 10 ? minute : '0' + minute;

        return hour + minute;
    }

    setdatajson() {
        var user = JSON.parse(this.dataJson)
        var pos = user.filter(d => d.section1 == this.section1 && d.section2 == this.section2 && d.section3 == this.section3)

        console.log(pos[0])
        return pos[0]
    }

    getUrl() {
        var date = setToday()
        var time = setTime()

        var posdata = setdatajson()

        var x = posdata.sectionX
        var y = posdata.sectionY

        var url = setUrl(key, date, time, x, y)
        console.log(url);
        return url
    }
}
