var cityBank=[];
var homeIndex=0;
var bmap = require('bmap-wx.js'); 
var util = require('util.js'); 
function init(){
    // 首先查看是不是有数据
    try {
        var BMap = new bmap.BMapWX({ 
          ak: '60sOImLvUcIFKd3vSkxRiR3T7RXtULac' 
        });
        var fail = function(data) { 
            console.log(data) 
        }; 
        var value = wx.getStorageSync('citys')
        if (value) {
            // Do something with return value
            console.log("有缓存");
            cityBank=value;
        }else{
            console.log("没有缓存");
            //调用应用实例的方法获取全局数据
            var success = function(data) { 
                var weatherData = data.currentWeather[0]; 
                weatherData.fullData = data.originalData.results[0];
                //console.log(weatherData);
                //weatherData.xy=checkXY(weatherData.currentCity);
                cityBank.push(weatherData);
                homeIndex=0;
                try {
                    wx.setStorageSync('citys', cityBank);
                    wx.setStorageSync('index', homeIndex);
                } catch (e) {    
                }
            } 
            // 发起weather请求 
            BMap.weather({
                fail: fail, 
                success: success 
            });
        }
    } catch (e) {
        // Do something when catch error
        console.log("缓存出问题啦!");
    }
}
function getToday(){
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth()+1; 
    var day = myDate.getDate();
    return year + "年 " + month + "月 " + day + "日 " + getOldToday();
}
function getOldToday(){
    var nowDate = new Date();
    var year = nowDate.getFullYear();
    var month = nowDate.getMonth() + 1;
    var day = nowDate.getDate();
    var oldDate = util.calendar.solar2lunar(year, month, day);
    return oldDate.ncWeek+" 农历"+oldDate.IMonthCn + oldDate.IDayCn;
}
function windHelper(zhText){
    return zhText;
}
function pmText(index){
    if(index <= 35){
        return "空气质量优";
    }else if(index>35 && index <= 75){
        return "空气质量良好";
    }else if(index>75 && index <= 115){
        return "空气轻度污染";
    }else if(index>115 && index <= 150){
        return "空气中度污染";
    }else if(index>150 && index <= 250){
        return "空气重度污染";
    }else if(index > 250){
        return "空气非常污染";
    }
}
function getLoveDate(that){
    var nowTime = new Date().getTime();
    var beginTime = "1519970760000";//相识日期 从我们加微信开始   2018-03-02 14:06:00
    var loveBeginTime = "1520953980000"; //相恋日期 从我换微信头像开始   2018-03-13 23:13:00
    var totalTime = nowTime-beginTime;
    var loveTotalTime = nowTime-loveBeginTime;
    var totalDate = dateformat(totalTime);
    var loveTotalDate = dateformat(loveTotalTime);
    that.setData({
      totalTime: totalDate,
      loveTotalTime: loveTotalDate
    })
    setTimeout(function () {
      getLoveDate(that);
    }, 1000)
}
// 时间格式化输出，如11:03 25:19 每1s都会调用一次
function dateformat(micro_second) {
  // 总秒数
  var second = Math.floor(micro_second / 1000);
  // 天数
  var day = Math.floor(second / 3600 / 24);
  // 小时
  var hr = Math.floor(second / 3600 % 24);
  if(hr<10){
    hr = "0"+hr;
  }
  // 分钟
  var min = Math.floor(second / 60 % 60);
  if(min<10){
    min = "0"+min;
  }
  // 秒
  var sec = Math.floor(second % 60);
  if(sec<10){
    sec = "0"+sec;
  }
  return day + "天" + hr + "小时" + min + "分钟" + sec + "秒";
}
function getHomeData(){
    return cityBank[homeIndex];
}
function getImportantDay(){
    var contentText = "今天是";
    var nowDate = new Date();
    var year = nowDate.getFullYear();
    var month = nowDate.getMonth() + 1;
    var day = nowDate.getDate();
    var oldDate = util.calendar.solar2lunar(year, month, day);
    console.log(oldDate);
    var imPortantNewDay = [ //阳历重要日期
      { "date": "2,14", "content": "西方情人节，祝咱们节日快乐^_^" },
      { "date": "3,2", "content": "我跟丹妹儿相识纪恋日，遇见你是生命最好的事情" },
      { "date": "3,13", "content": "我跟丹妹儿相爱纪恋日，如果我有一天不浪漫了，不是我不爱你了，只是我用完了我所会的浪漫技能，只剩下陪伴，与你度过余生" },
      { "date": "5,20", "content": "恋爱表白日，我只想对我的丹妹儿说：我爱你" },
    ]
    var imPortantOldDay = [ //农历重要日期
      { "date": "1,15", "content": "我和丹妹儿的相识农历纪恋日，我能想到最浪漫的事就是和你一起慢慢变老" },
      { "date": "4,1", "content":"我亲爱的丹妹儿妈妈生日，替我说一声生日快乐哈"},
      { "date": "4,9", "content": "我亲爱的丹妹儿生日，这么重要的日子我相信礼物已经到了或者在来的路上" },
      { "date": "5,5", "content": "端午节，记得吃粽子哟" },
      { "date": "7,7", "content": "七夕，中国情人节，期待我们相会" },
      { "date": "8,15", "content": "中秋节，团圆日，如果我不在你身边，你就看看天上的圆月，那正是我在看你，也在想你" },
      { "date": "11,9", "content": "我亲爱的丹妹儿老爸生日，也替我给叔叔问声好" }
      ]
    //先对比阳历日期
    for (var i = 0; i < imPortantNewDay.length;i++){
      if (imPortantNewDay[i].date == month + "," + day){
        contentText += imPortantNewDay[i].content;
      }
    }
    //再对比农历日期
    for (var i = 0; i < imPortantOldDay.length; i++) {
      if (imPortantOldDay[i].date == oldDate.lMonth + "," + oldDate.lDay) {
        if (contentText!="今天是"){
          contentText += "同时也是" + imPortantOldDay[i].content;
        }else{
          contentText += imPortantOldDay[i].content;
        }
      }
    }
    if (contentText=="今天是"){
       contentText = "今天不是什么特殊日，只是我爱你的日子！"
    }
    return contentText;
}
function getCityList(){
    var citys=[];
    for (var i=0;i<cityBank.length;i++){
        var city={};
        city.name = cityBank[i].currentCity;
        city.index=i;
        if(homeIndex==i){
            city.icon=0; //0 当前位置图标，1 普通城市图标
        }else{
            city.icon=1;
        }
        citys.push(city);
    }
    return citys;
}
function getCity(){
    return cityBank;
}
function refreshCity(weatherData){
    homeIndex=wx.getStorageSync('index');
    var thatIndex=-1;
    for (var i=0;i<cityBank.length;i++){
        if(cityBank[i].currentCity==weatherData.currentCity){
            cityBank[i]=weatherData;
            thatIndex=i;
        }
    }
    if(thatIndex==-1){
        cityBank.push(weatherData);
        homeIndex=cityBank.length-1;
    }else{
        homeIndex=thatIndex;
    }
    wx.setStorageSync('index', homeIndex);
    //console.log("更新了主城市的index");
}
function addCity(weatherData){
    var thatIndex=-1;
    for (var i=0;i<cityBank.length;i++){
        if(cityBank[i].currentCity==weatherData.currentCity){
            thatIndex=i;
        }
    }
    if(thatIndex==-1){
        cityBank.push(weatherData);
        wx.setStorageSync('citys', cityBank);
    }
}
function checkXY(cityName){
    return "89,36";
}
function readXJCitys(){
  var xjCitys='{'
        +'"province":['
            +'{'
                +'"cityzh":"北京市",'
                +'"location":"116.5,39.9"'
            +'},'
            +'{'
                +'"cityzh":"天津市",'
                +'"location":"117.2,39.1"'
            +'},'
            +'{'
                +'"cityzh":"上海市",'
                +'"location":"121.5,31.15"'
            +'},'
            +'{'
                +'"cityzh":"重庆市",'
                +'"location":"106.5,29.5"'
            +'},'
            +'{'
                +'"cityzh":"石家庄市",'
                +'"location":"114.52,38.04"'
            +'},'
            +'{'
                +'"cityzh":"郑州市",'
                +'"location":"113.63,34.75"'
            +'},'
            +'{'
                +'"cityzh":"武汉市",'
                +'"location":"114.31,30.59"'
            +'},'
            +'{'
                +'"cityzh":"长沙市",'
                +'"location":"112.94,28.23"'
            +'},'
            +'{'
                +'"cityzh":"南京市",'
                +'"location":"118.80,32.06"'
            +'},'
            +'{'
                +'"cityzh":"南昌市",'
                +'"location":"115.86,28.68"'
            +'},'
            +'{'
                +'"cityzh":"沈阳市",'
                +'"location":"123.43,41.81"'
            +'},'
            +'{'
                +'"cityzh":"长春市",'
                +'"location":"125.33,43.82"'
            +'},'
            +'{'
                +'"cityzh":"哈尔滨市",'
                +'"location":"126.54,45.80"'
            +'},'
            +'{'
                +'"cityzh":"西安市",'
                +'"location":"108.94,34.34"'
            +'},'
            +'{'
                +'"cityzh":"太原市",'
                +'"location":"112.55,37.87"'
            +'},'
            +'{'
                +'"cityzh":"济南市",'
                +'"location":"117.02,36.68"'
            +'},'
            +'{'
                +'"cityzh":"成都市",'
                +'"location":"104.07,30.57"'
            +'},'
            +'{'
                +'"cityzh":"西宁市",'
                +'"location":"101.78,36.62"'
            +'},'
            +'{'
                +'"cityzh":"合肥市",'
                +'"location":"117.23,31.82"'
            +'},'
            +'{'
                +'"cityzh":"海口市",'
                +'"location":"110.20,20.05"'
            +'},'
            +'{'
                +'"cityzh":"广州市",'
                +'"location":"113.27,23.13"'
            +'},'
            +'{'
                +'"cityzh":"贵阳市",'
                +'"location":"106.63,26.65"'
            +'},'
            +'{'
                +'"cityzh":"杭州市",'
                +'"location":"120.16,30.28"'
            +'},'
            +'{'
                +'"cityzh":"福州市",'
                +'"location":"119.30,26.08"'
            +'},'
            +'{'
                +'"cityzh":"兰州市",'
                +'"location":"103.84,36.06"'
            +'},'
            +'{'
                +'"cityzh":"昆明市",'
                +'"location":"102.83,24.88"'
            +'},'
            +'{'
                +'"cityzh":"拉萨市",'
                +'"location":"91.12,29.65"'
            +'},'
            +'{'
                +'"cityzh":"银川市",'
                +'"location":"106.23,38.49"'
            +'},'
            +'{'
                +'"cityzh":"南宁市",'
                +'"location":"108.37,22.82"'
            +'},'
            +'{'
                +'"cityzh":"乌鲁木齐市",'
                +'"location":"87.62,43.83"'
            +'},'
            +'{'
                +'"cityzh":"香港市",'
                +'"location":"114.17,22.28"'
            +'},'
            +'{'
                +'"cityzh":"澳门市",'
                +'"location":"113.54,22.19"'
            +'},'
            +'{'
                +'"cityzh":"恩施市",'
                +'"location":"109.47,30.30"'
            +'}'
        +']'
    +'}';
    return JSON.parse(xjCitys);
}
function iconChanger(zhText){
    var status = zhText;
    var statusData={};
    var thisMoment=new Date().getHours();
    var dayNight="w";
    var wallPaper="day";
    if(thisMoment>18 || thisMoment < 6){
        dayNight="n";
        wallPaper="night";
    }else{
        dayNight="w";
        wallPaper="day";
    }
            switch (zhText){
                case "--":
                    zhText="/images/w/"+dayNight+"01";
                    statusData.status = status;
                    statusData.wall="/images/clear"+wallPaper;
                    break;
                case "晴":
                    zhText="/images/w/"+dayNight+"00";
                    statusData.status = status;
                    statusData.wall="/images/clear"+wallPaper;
                    break;
                
                // case "晴转多云":
                //     zhText="/images/w/"+dayNight+"01";
                //     statusData.wall="/images/cloud"+wallPaper;
                //     break;
                // case "阴转多云":
                //     zhText="/images/w/"+dayNight+"01";
                //     statusData.wall="/images/cloud"+wallPaper;
                //     break;
                // case "晴转阴":
                //     zhText="/images/w/"+dayNight+"01";
                //     statusData.wall="/images/cloud"+wallPaper;
                //     break;
                // case "多云转阴":
                //     zhText="/images/w/"+dayNight+"01";
                //     statusData.wall="/images/cloud"+wallPaper;
                //     break;
                // case "多云转晴":
                //     zhText="/images/w/"+dayNight+"01";
                //     statusData.wall="/images/cloud"+wallPaper;
                //     break;
                case "多云":
                    zhText="/images/w/"+dayNight+"01";
                    statusData.status = status;
                    statusData.wall="/images/cloud"+wallPaper;
                    break;
                case "阴":
                    zhText="/images/w/"+dayNight+"02";
                    statusData.status = status;
                    statusData.wall="/images/cloud"+wallPaper;
                    break;
                case "阴转小雨":
                    zhText = "/images/w/" + dayNight + "03";
                    statusData.wall = "/images/clear" + wallPaper;
                    break;
                case "阵雨":
                    zhText="/images/w/"+dayNight+"03";
                    statusData.status = status;
                    statusData.wall="/images/rainy"+wallPaper;
                    break;
                // case "阵雨转阴":
                //     zhText="/images/w/"+dayNight+"03";
                //     statusData.wall="/images/rainy"+wallPaper;
                //     break;
                // case "晴转小雨":
                //     zhText="/images/w/"+dayNight+"07";
                //     statusData.wall="/images/rainy"+wallPaper;
                //     break;
                case "雷阵雨":
                    zhText="/images/w/"+dayNight+"04";
                    statusData.status = status;
                    statusData.wall="/images/rainy"+wallPaper;
                    break;
                // case "雷阵雨转小到中雨":
                //     zhText="/images/w/"+dayNight+"04";
                //     statusData.wall="/images/rainy"+wallPaper;
                //     break;
                case "雷阵雨伴有冰雹":
                    zhText="/images/w/"+dayNight+"05";
                    statusData.status = status;
                    statusData.wall="/images/rainy"+wallPaper;
                    break;
                case "雨夹雪转大雪":
                  zhText = "/images/w/" + dayNight + "06";
                  statusData.status = status;
                  statusData.wall = "/images/rainy" + wallPaper;
                  break;
                case "雨夹雪":
                    zhText="/images/w/"+dayNight+"06";
                    statusData.status = status;
                    statusData.wall="/images/rainy"+wallPaper;
                    break;
                // case "多云转小雨":
                //     zhText="/images/w/"+dayNight+"07";
                //     statusData.wall="/images/rainy"+wallPaper;
                //     break;
                case "小雨":
                    zhText="/images/w/"+dayNight+"07";
                    statusData.status = status;
                    statusData.wall="/images/rainy"+wallPaper;
                    break;
                case "中雨":
                    zhText="/images/w/"+dayNight+"08";
                    statusData.status = status;
                    statusData.wall="/images/rainy"+wallPaper;
                    break;
                case "大雨":
                    zhText="/images/w/"+dayNight+"09";
                    statusData.status = status;
                    statusData.wall="/images/rainy"+wallPaper;
                    break;
                case "暴雨":
                    zhText="/images/w/"+dayNight+"10";
                    statusData.status = status;
                    statusData.wall="/images/rainy"+wallPaper;
                    break;
                case "大暴雨":
                    zhText="/images/w/"+dayNight+"11";
                    statusData.status = status;
                    statusData.wall="/images/rainy"+wallPaper;
                    break;
                case "特大暴雨":
                    zhText="/images/w/"+dayNight+"12";
                    statusData.status = status;
                    statusData.wall="/images/rainy"+wallPaper;
                    break;
                case "阵雪":
                    zhText="/images/w/"+dayNight+"13";
                    statusData.status = status;
                    statusData.wall="/images/snow"+wallPaper;
                    break;
                case "小雪":
                    zhText="/images/w/"+dayNight+"14";
                    statusData.status = status;
                    statusData.wall="/images/snow"+wallPaper;
                    break;
                case "中雪":
                    zhText="/images/w/"+dayNight+"15";
                    statusData.status = status;
                    statusData.wall="/images/snow"+wallPaper;
                    break;
                case "大雪":
                    zhText="/images/w/"+dayNight+"16";
                    statusData.status = status;
                    statusData.wall="/images/snow"+wallPaper;
                    break;
                case "暴雪":
                    zhText="/images/w/"+dayNight+"17";
                    statusData.status = status;
                    statusData.wall="/images/snow"+wallPaper;
                    break;
                case "雾":
                    zhText="/images/w/"+dayNight+"18";
                    statusData.status = status;
                    statusData.wall="/images/cloud"+wallPaper;
                    break;
                case "冻雨":
                    zhText="/images/w/"+dayNight+"19";
                    statusData.status = status;
                    statusData.wall="/images/rainy"+wallPaper;
                    break;
                case "沙尘暴":
                    zhText="/images/w/"+dayNight+"20";
                    statusData.status = status;
                    statusData.wall="/images/sandday";
                    break;
                case "小到中雨":
                    zhText="/images/w/"+dayNight+"21";
                    statusData.status = status;
                    statusData.wall="/images/rainy"+wallPaper;
                    break;
                // case "大雨转小雨":
                //     zhText="/images/w/"+dayNight+"21";
                //     statusData.wall="/images/rainy"+wallPaper;
                //     break;
                // case "小到中雨转中雨":
                //     zhText="/images/w/"+dayNight+"21";
                //     statusData.wall="/images/rainy"+wallPaper;
                //     break;
                case "中到大雨":
                    zhText="/images/w/"+dayNight+"22";
                    statusData.status = status;
                    statusData.wall="/images/rainy"+wallPaper;
                    break;
                case "大到暴雨":
                    zhText="/images/w/"+dayNight+"23";
                    statusData.status = status;
                    statusData.wall="/images/rainy"+wallPaper;
                    break;
                case "暴雨到大暴雨":
                    zhText="/images/w/"+dayNight+"24";
                    statusData.status = status;
                    statusData.wall="/images/rainy"+wallPaper;
                    break;
                case "大暴雨到特大暴雨":
                    zhText="/images/w/"+dayNight+"25";
                    statusData.status = status;
                    statusData.wall="/images/rainy"+wallPaper;
                    break;
                case "小到中雪":
                    zhText="/images/w/"+dayNight+"26";
                    statusData.status = status;
                    statusData.wall="/images/snow"+wallPaper;
                    break;
                case "中到大雪":
                    zhText="/images/w/"+dayNight+"27";
                    statusData.status = status;
                    statusData.wall="/images/snow"+wallPaper;
                    break;
                case "大到暴雪":
                    zhText="/images/w/"+dayNight+"28";
                    statusData.status = status;
                    statusData.wall="/images/snow"+wallPaper;
                    break;
                case "浮尘":
                    zhText="/images/w/"+dayNight+"29";
                    statusData.status = status;
                    statusData.wall="/images/sandday";
                    break;
                case "扬沙":
                    zhText="/images/w/"+dayNight+"30";
                    statusData.status = status;
                    statusData.wall="/images/sandday";
                    break;
                // case "扬沙转多云":
                //     zhText="/images/w/"+dayNight+"01";
                //     statusData.wall="/images/cloud"+wallPaper;
                //     break;
                // case "多云转扬沙":
                //     zhText="/images/w/"+dayNight+"30";
                //     statusData.wall="/images/sandday";
                //     break;
                case "强沙尘暴":
                    zhText="/images/w/"+dayNight+"32";
                    statusData.status = status;
                    statusData.wall="/images/sandday";
                    break;
                case "霾":
                    zhText="/images/w/"+dayNight+"32";
                    statusData.status = status;
                    statusData.wall="/images/cloud"+wallPaper;
                    break;
                case "无":
                    zhText="/images/w/"+dayNight+"01";
                    statusData.status = status;
                    statusData.wall="/images/clear"+wallPaper;
                    break;
                default:
                    console.log(" **************** 没有匹配到: "+zhText);
                    statusData = iconChangerExtra(zhText);
                    statusData.status = status;
                    return statusData;
            }
            //zhText="/images/w/"+dayNight+"09"; // 调试调试啊
            statusData.icon=zhText;
            return statusData;
}
function iconChangerExtra(zhText){
    var status = zhText;
    zhText = zhText.split("转")[0];
    var statusData={};
    var thisMoment=new Date().getHours();
    var dayNight="w";
    var wallPaper="day";
    if(thisMoment>18 || thisMoment < 6){
        dayNight="n";
        wallPaper="night";
    }else{
        dayNight="w";
        wallPaper="day";
    }
    switch (zhText){
        case "--":
            zhText="/images/w/"+dayNight+"01";
            statusData.status = status;
            statusData.wall="/images/clear"+wallPaper;
            break;
        case "晴":
            zhText="/images/w/"+dayNight+"00";
            statusData.status = status;
            statusData.wall="/images/clear"+wallPaper;
            break;
        // case "阴转晴":
        //     zhText="/images/w/"+dayNight+"00";
        //     statusData.status="ھاۋا ئېچىلىدۇ";
        //     statusData.wall="/images/clear"+wallPaper;
        //     break;
        // case "晴转多云":
        //     zhText="/images/w/"+dayNight+"01";
        //     statusData.status="ھاۋا بۇلۇتلىنىدۇ";
        //     statusData.wall="/images/cloud"+wallPaper;
        //     break;
        // case "阴转多云":
        //     zhText="/images/w/"+dayNight+"01";
        //     statusData.status="ھاۋا تۇتۇلىدۇ";
        //     statusData.wall="/images/cloud"+wallPaper;
        //     break;
        // case "晴转阴":
        //     zhText="/images/w/"+dayNight+"01";
        //     statusData.status="ھاۋا تۇتۇلىدۇ";
        //     statusData.wall="/images/cloud"+wallPaper;
        //     break;
        // case "多云转阴":
        //     zhText="/images/w/"+dayNight+"01";
        //     statusData.status="ھاۋا تۇتۇلىدۇ";
        //     statusData.wall="/images/cloud"+wallPaper;
        //     break;
        // case "多云转晴":
        //     zhText="/images/w/"+dayNight+"01";
        //     statusData.status="ھاۋا بۇلۇتلىنىپ ئاندىن ئېچىلىدۇ";
        //     statusData.wall="/images/cloud"+wallPaper;
        //     break;
        case "多云":
            zhText="/images/w/"+dayNight+"01";
            statusData.status = status;
            statusData.wall="/images/cloud"+wallPaper;
            break;
        case "阴":
            zhText="/images/w/"+dayNight+"02";
            statusData.status = status;
            statusData.wall="/images/cloud"+wallPaper;
            break;
        case "阵雨":
            zhText="/images/w/"+dayNight+"03";
            statusData.status = status;
            statusData.wall="/images/rainy"+wallPaper;
            break;
        // case "阵雨转阴":
        //     zhText="/images/w/"+dayNight+"03";
        //     statusData.status="ئۆتكۈنچى يامغۇر يېغىپ توختايدۇ";
        //     statusData.wall="/images/rainy"+wallPaper;
        //     break;
        // case "晴转小雨":
        //     zhText="/images/w/"+dayNight+"07";
        //     statusData.status="ئازىراق يامغۇر ياغىدۇ";
        //     statusData.wall="/images/rainy"+wallPaper;
        //     break;
        case "雷阵雨":
            zhText="/images/w/"+dayNight+"04";
            statusData.status = status;
            statusData.wall="/images/rainy"+wallPaper;
            break;
        // case "雷阵雨转小到中雨":
        //     zhText="/images/w/"+dayNight+"04";
        //     statusData.status="چاقماق چېقىپ يامغۇر ياغىدۇ";
        //     statusData.wall="/images/rainy"+wallPaper;
        //     break;
        case "雷阵雨伴有冰雹":
            zhText="/images/w/"+dayNight+"05";
            statusData.status = status;
            statusData.wall="/images/rainy"+wallPaper;
            break;
        case "雨夹雪":
            zhText="/images/w/"+dayNight+"06";
            statusData.status = status;
            statusData.wall="/images/rainy"+wallPaper;
            break;
        // case "多云转小雨":
        //     zhText="/images/w/"+dayNight+"07";
        //     statusData.status="ئازراق يامغۇر ياغىدۇ";
        //     statusData.wall="/images/rainy"+wallPaper;
        //     break;
        case "小雨":
            zhText="/images/w/"+dayNight+"07";
            statusData.status = status;
            statusData.wall="/images/rainy"+wallPaper;
            break;
        case "中雨":
            zhText="/images/w/"+dayNight+"08";
            statusData.status = status;
            statusData.wall="/images/rainy"+wallPaper;
            break;
        case "大雨":
            zhText="/images/w/"+dayNight+"09";
            statusData.status = status;
            statusData.wall="/images/rainy"+wallPaper;
            break;
        case "暴雨":
            zhText="/images/w/"+dayNight+"10";
            statusData.status = status;
            statusData.wall="/images/rainy"+wallPaper;
            break;
        case "大暴雨":
            zhText="/images/w/"+dayNight+"11";
            statusData.status = status;
            statusData.wall="/images/rainy"+wallPaper;
            break;
        case "特大暴雨":
            zhText="/images/w/"+dayNight+"12";
            statusData.status = status;
            statusData.wall="/images/rainy"+wallPaper;
            break;
        case "阵雪":
            zhText="/images/w/"+dayNight+"13";
            statusData.status = status;
            statusData.wall="/images/snow"+wallPaper;
            break;
        case "小雪":
            zhText="/images/w/"+dayNight+"14";
            statusData.status = status;
            statusData.wall="/images/snow"+wallPaper;
            break;
        case "中雪":
            zhText="/images/w/"+dayNight+"15";
            statusData.status = status;
            statusData.wall="/images/snow"+wallPaper;
            break;
        case "大雪":
            zhText="/images/w/"+dayNight+"16";
            statusData.status = status;
            statusData.wall="/images/snow"+wallPaper;
            break;
        case "暴雪":
            zhText="/images/w/"+dayNight+"17";
            statusData.status = status;
            statusData.wall="/images/snow"+wallPaper;
            break;
        case "雾":
            zhText="/images/w/"+dayNight+"18";
            statusData.status = status;
            statusData.wall="/images/cloud"+wallPaper;
            break;
        case "冻雨":
            zhText="/images/w/"+dayNight+"19";
            statusData.status = status;
            statusData.wall="/images/rainy"+wallPaper;
            break;
        case "沙尘暴":
            zhText="/images/w/"+dayNight+"20";
            statusData.status = status;
            statusData.wall="/images/sandday";
            break;
        case "小到中雨":
            zhText="/images/w/"+dayNight+"21";
            statusData.status = status;
            statusData.wall="/images/rainy"+wallPaper;
            break;
        // case "大雨转小雨":
        //     zhText="/images/w/"+dayNight+"21";
        //     statusData.status="ئاز-ئوتتۇراھال يامغۇر ياغىدۇ";
        //     statusData.wall="/images/rainy"+wallPaper;
        //     break;
        // case "小到中雨转中雨":
        //     zhText="/images/w/"+dayNight+"21";
        //     statusData.status="ئازدىن ئوتتۇراھالغىچە يامغۇر ياغىدۇ";
        //     statusData.wall="/images/rainy"+wallPaper;
        //     break;
        case "中到大雨":
            zhText="/images/w/"+dayNight+"22";
            statusData.status = status;
            statusData.wall="/images/rainy"+wallPaper;
            break;
        case "大到暴雨":
            zhText="/images/w/"+dayNight+"23";
            statusData.status = status;
            statusData.wall="/images/rainy"+wallPaper;
            break;
        case "暴雨到大暴雨":
            zhText="/images/w/"+dayNight+"24";
            statusData.status = status;
            statusData.wall="/images/rainy"+wallPaper;
            break;
        case "大暴雨到特大暴雨":
            zhText="/images/w/"+dayNight+"25";
            statusData.status = status;
            statusData.wall="/images/rainy"+wallPaper;
            break;
        case "小到中雪":
            zhText="/images/w/"+dayNight+"26";
            statusData.status = status;
            statusData.wall="/images/snow"+wallPaper;
            break;
        case "中到大雪":
            zhText="/images/w/"+dayNight+"27";
            statusData.status = status;
            statusData.wall="/images/snow"+wallPaper;
            break;
        case "大到暴雪":
            zhText="/images/w/"+dayNight+"28";
            statusData.status = status;
            statusData.wall="/images/snow"+wallPaper;
            break;
        case "浮尘":
            zhText="/images/w/"+dayNight+"29";
            statusData.status = status;
            statusData.wall="/images/sandday";
            break;
        case "扬沙":
            zhText="/images/w/"+dayNight+"30";
            statusData.status = status;
            statusData.wall="/images/sandday";
            break;
        // case "扬沙转多云":
        //     zhText="/images/w/"+dayNight+"01";
        //     statusData.status="توپا يېغىپ توختايدۇ";
        //     statusData.wall="/images/cloud"+wallPaper;
        //     break;
        // case "多云转扬沙":
        //     zhText="/images/w/"+dayNight+"30";
        //     statusData.status="ھاۋا بۇلۇتلىنىپ توپا ياغىدۇ";
        //     statusData.wall="/images/sandday";
        //     break;
        case "强沙尘暴":
            zhText="/images/w/"+dayNight+"32";
            statusData.status = status;
            statusData.wall="/images/sandday";
            break;
        case "霾":
            zhText="/images/w/"+dayNight+"32";
            statusData.status = status;
            statusData.wall="/images/cloud"+wallPaper;
            break;
        case "无":
            zhText="/images/w/"+dayNight+"01";
            statusData.status = status;
            statusData.wall="/images/clear"+wallPaper;
            break;
        default:
            zhText="/images/w/"+dayNight+"01";
            statusData.status = status;
            statusData.wall="/images/clear"+wallPaper;
            break;
    }
    statusData.icon=zhText;
    return statusData;
}
module.exports = {
  readXJCitys : readXJCitys,
  init : init,
  getHomeData : getHomeData,
  getCityList : getCityList,
  addCity : addCity,
  refreshCity: refreshCity,
  getToday : getToday,
  getLoveDate: getLoveDate,
  getOldToday: getOldToday,
  getImportantDay: getImportantDay,
  getCity: getCity,
  iconChanger: iconChanger,
  windHelper: windHelper,
  pmText: pmText
}
