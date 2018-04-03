$.getScript("https://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js",function(){
    var data=remote_ip_info;
    var city=data.city;
    $(".now_city_name").html(city);
    getWeather(city);
})
$(".city_bottom span").click(function(){
    city=$(this).html();
    $(".now_city_name").html(city);
    console.log(city)
    getWeather(city);
    $(".citys").hide();
})
function getWeather(city){
    $(".now_city_name").html(city);
    $.ajax({
    url:"https://api.jisuapi.com/weather/query?appkey=f0eefe7b6e598b15&city="+city,
    dataType:"jsonp",
    success:function(r){
        $(".now_air h2").html(r.result.aqi.quality);
        $(".noe_temp span").html(r.result.temp);
        $(".tianqi").html(r.result.weather);
        $(".type b:first-child").html(r.result.winddirect);
        $(".type b:last-child").html(r.result.windpower);
        let date=new Date();
        let n=date.getDay();
        if(n==7){
            n=0;
        }
        $(".lucky").html(r.result.index[n].detail);
        $(".today_hightemp").html(r.result.temphigh);
        $(".today_lowtemp").html(r.result.templow);
        $(".taday_tianqi").html(r.result.weather);
        $(".today_img").html(`<img src="img/${r.result.img}.png">`);
        $(".tomorrow_hightemp").html(r.result.daily[n+1].day.temphigh);
        $(".tomorrow_lowtemp").html(r.result.daily[n+1].night.templow);
        $(".tomorrow_tianqi").html(r.result.daily[n+1].day.weather);
        $(".tomorrow_img").html(`<img src="img/${r.result.daily[n+1].day.img}.png">`);
        let str="";
        $(r.result.hourly).each(function(index,ele){
            str+=`<li>
                    <h1 class="hours_time">${ele.time}</h1>
                    <div class="hours_img"><img src="img/${ele.img}.png"></div>
                    <h2 class="hours_temp"><span>${ele.temp}</span>°</h2>
                </li>`
            });
        $("#hours").html(str);
        let str1="";
        $(r.result.daily).each(function(index,ele){

            let month=ele.date.slice(5,7);
            let day=ele.date.slice(8,10);
            str1+=`<li>
                <h1 class="hours_time week_time">${month}<span>/</span>${day}</h1>
                <h1 class="hours_time week_time">${ele.day.weather}</h1>
                <div class="hours_img"><img src="img/${ele.day.img}.png"></div>
                <h1 class="hours_time high_temp">${ele.day.temphigh}</h1>
                <h1 class="hours_time high_temp low_temp">${ele.night.templow}</h1>
                <h2 class="hours_temp high_temp week_direction"><span>${ele.day.winddirect}</span></h2>
                <h2 class="hours_temp high_temp week_type"><span>${ele.day.windpower}</span></h2>
            </li>`
            });
        $(".week").html(str1);
    }
})}
$("input").click(function(){
    $(".city_bottom").hide();
    $(".mask").empty();
    var data=[];//存放所有数据
    var province=[];//存放所有省得数据
    var city=[];
    $.ajax({
        url:"https://api.jisuapi.com/weather/city?appkey=f0eefe7b6e598b15",
        dataType:"jsonp",
        success:function(r){
            data=r.result;
            province=$.grep(data,function(val,index){
                if(val.parentid=="0"){
                    return true;
                }
            });
            let str="";
            $.each(province,function(index,val){
                str+=`<div class="province" id="${val.cityid}">${val.city}</div>`;
            });
            $(".mask").html(str);
        }
    });
    $(".mask").on("click",".province",function(){
        var id=$(this).attr("id");
        city=$.grep(data,function(val,index){
            if(val.parentid==id){
                return true;
            }
        });
        $(".mask").empty();
        let str="";
        $.each(city,function(index,val){
            str+=`<div class="city">${val.city}</div>`;
        });
        $(".mask").html(str);
    })
    $(".mask").on("click",".city",function(){
        $(".citys").hide();
        getWeather($(this).html());
    })   
    $(".mask").show();
})
$(".now_city").click(function(){
    $(".mask").hide();
    $(".citys").show();
    $(".city_bottom").show();
})