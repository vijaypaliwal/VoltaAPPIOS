
'use strict';

app.controller('graphcontroller', ['$scope', '$http', 'authService', 'localStorageService', '$location', 'log', function ($scope, $http, authService, localStorageService, $location, log) {

    $scope.authentication = authService.authentication.isAuth;
    $scope.userid = authService.authentication.userId;
    $scope.sensorId = authService.authentication.sensorId;
    $scope.accesstoken = authService.authentication.accesstoken;
    $scope.isauth = $scope.authentication;
    $scope.acctoken = $scope.accesstoken;
    var authData = localStorageService.get('authorizationData');
    $scope.AuthToken = authData.token;
    $scope.uid = authData.uid;
    $scope.sid = authData.sid;
    $scope.rememberme = authData.remember;
    $scope.furl = mainServicebase + 'user/' + $scope.uid + '/sensor/' + $scope.sid + '/powerinfo/graphtoday';
    $scope.surl = mainServicebase + 'user/' + $scope.uid + '/sensor/' + $scope.sid + '/powerinfo/now'
    $scope.todayurl = mainServicebase + 'user/' + $scope.uid + '/sensor/' + $scope.sid + '/powerinfo/totaltoday'
    $scope.dailyavg = mainServicebase + 'user/' + $scope.uid + '/sensor/' + $scope.sid + '/powerinfo/daily_average'
    $scope.expected = mainServicebase + 'user/' + $scope.uid + '/sensor/' + $scope.sid + '/powerinfo/expected_today'
    $scope.last24hours = mainServicebase + 'user/' + $scope.uid + '/sensor/' + $scope.sid + '/powerinfo/last24hour'
    $scope.last7days = mainServicebase + 'user/' + $scope.uid + '/sensor/' + $scope.sid + '/powerinfo/last7days'
    $scope.lastmonth = mainServicebase + 'user/' + $scope.uid + '/sensor/' + $scope.sid + '/powerinfo/lastMonth'
    $scope.last6month = mainServicebase + 'user/' + $scope.uid + '/sensor/' + $scope.sid + '/powerinfo/last6Months'
    $scope.lastyear = mainServicebase + 'user/' + $scope.uid + '/sensor/' + $scope.sid + '/powerinfo/lastYears'
    $scope.isFirstTime = false;


    $scope.message = 'Home';

    $scope.culture = "RS";

    $scope.culturedateformat = "DD-MM-YYYY";


    $scope.languagechangecounter = 0;

    $scope.graphname = "24hrs";

    var userLang = navigator.language || navigator.userLanguage;



    $scope.myculture = function (culture) {


        if (culture == 'it') {


            $scope.culturedateformat = "DD MMM YYYY h:mm a";
            var currentdate = moment(new Date()).format("DD MMM YYYY h:mm a");
            var newarray = currentdate.split(" ");


            if (newarray[1] == "Feb") {
                newarray[1] = "Февраль";
            }
            if (newarray[1] == "Mar") {
                newarray[1] = "Март";
            }

            if (newarray[1] == "May") {
                newarray[1] = "май";
            }

            if (newarray[1] == "Jun") {
                newarray[1] = "Июнь";
            }

            if (newarray[4] == "am") {
                newarray[4] = "я";
            }

            if (newarray[4] == "pm") {
                newarray[4] = "вечера";
            }
            var toConvertedString = newarray[0] + " " + newarray[1] + " " + newarray[2] + " " + newarray[3] + " " + newarray[4];
            $("#CurrentDate").html("<b>" + toConvertedString + "</b>");

        }

        else {


            $("#CurrentDate").html("<b>" + moment(new Date()).format("DD MMM YYYY h:mm a") + "</b>");

        }


    }

    $scope.myculture(userLang);

    var twoyearago = new Date();
    twoyearago.setDate(twoyearago.getDate() - 730);


    if (userLang == "ru" || userLang == "ru-ru") {

        $scope.Equalmessage = "Utilizaci&#243n d&#237a promedio y la utilizaci&#243n de d&#237as previstos son de Igualdad";

    }

    else {
        $scope.Equalmessage = 'Среднедневное потребление и ожидаемое потребление за текущий день равны';
    }



    if (userLang == "ru" || userLang == "ru-ru") {

        $scope.lessmessage = "Среднедневное потребление меньше, чем ожидаемое потребление за текущий день";

    }

    else {
        $scope.lessmessage = 'Average day Utilisation is less than Expected day utilisation';
    }



    if (userLang == "ru" || userLang == "ru-ru") {

        $scope.greatermessage = "Среднедневное потребление выше, чем ожидаемое потребление за текущий день";

    }

    else {
        $scope.greatermessage = 'Average day Utilisation is greater than Expected day utilisation';
    }



    $scope.todayvalue = "";
    $scope.expvalue = "";
    $scope.bottomgraphurl = $scope.last24hours;
    $scope.graphdateformat = "{value:%I:%M %p}";
    var todaydate = new Date()

    var partodaydate = new Date();
    $scope.todaydateformatch = moment(partodaydate).format($scope.culturedateformat);
    $scope.onedayapidate = todaydate;
    $scope.daystoIncrease = 0;
    $scope.isDateRangeSelected = false;

    $scope.islast7dayactive = false;
    $scope.islast24dayactive = true;
    $scope.ActiveButton = 1;

    $scope.graphstep = 1;

    $scope.now = 0;
    $scope.marginleft = 0;

    $scope.tariffname = "";
    $scope.propertytypename = "";
    $scope.bedcounter = 0;



    $scope.datetoshow = moment(todaydate).format($scope.culturedateformat);

    $scope.datetoshowlabel = new Date();

    var preDate = new Date(todaydate.getFullYear(), todaydate.getMonth(), todaydate.getDate() - 1);
    $scope.previousdate = moment(preDate).format($scope.culturedateformat);



    $scope.onedatafterdate = $scope.onedayapidate;

    $(".loader").show();
    //get method
    $scope.getgraph = function () {


        $http.get($scope.furl, null, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $scope.AuthToken } }).success(function (data) {

            $(".loader").hide();
            var xData = [];
            var yData = [];
            for (var i = 0; i < data.listPower.length; i++) {
                xData.push(parseFloat(data.listPower[i].power));
                yData.push(new Date(data.listPower[i].timestamp));
            }



            var charts = $('#container').highcharts({
                title: {
                    text: '',
                    x: -20 //center
                },
                subtitle: {
                    x: -20
                },
                xAxis: {
                    TimeZone: yData
                },
                yAxis: {
                    title: {
                        text: 'kWh'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }],
                },
                tooltip: {
                    valueSuffix: 'kWh'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    name: 'Power Time',
                    data: xData
                }]
            });



        }).error(function (xhr, error, errorStatus, responseText) {

            $(".loader").hide();


            log.error(xhr.consumerMessage + ' ' + '[' + error + ']');
        });
    };
    var iw = $('body').innerWidth();

    var height = $(window).height();


    $scope.updateFormateforGraphforLang = function () {
        userLang = selectedlanguage;



        switch (userLang) {

            case "it":
                $scope.kwhtext = 'кВт/час';
                Highcharts.setOptions({
                    lang: {
                        months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                        weekdays: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
                        shortMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                    }
                }); break;
            case "sp":
                $scope.kwhtext = 'KWh';
                Highcharts.setOptions({
                    lang: {
                        months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
                        weekdays: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
                        shortMonths: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
                    }
                }); break;
                break;
            default:
                $scope.kwhtext = 'KWh';
                Highcharts.setOptions({
                    lang: {
                        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Octomber', 'November', 'December'],
                        weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                        shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    }
                });
                break;

        }

    }
    $scope.getsecondgraph = function () {

        $http.get($scope.surl, null, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $scope.AuthToken } }).success(function (data) {

            $(".loader").hide();

            $('.js-gauge--1').kumaGauge({
                value: data.power * 1,
                radius: iw / 2.5,
                gaugeWidth: 40,
                showNeedle: true,
                min: 0,
                max: 7,
                paddingY: 0,
                paddingX: 0,
                label: {
                    display: true,
                    left: 'Min',
                    right: 'Max',
                    fontFamily: 'Helvetica',
                    fontColor: '#1E4147',
                    fontSize: '11',
                    fontWeight: 'bold'
                }
            });
            var currentusage = (data.power) * 1
            var CU = parseFloat(currentusage);

            document.getElementById("currentusage").innerHTML = CU.toFixed(2) + ' ';


            //$(function () {

            //    var gaugeOptions = {

            //        chart: {
            //            type: 'solidgauge'
            //        },

            //        title: null,

            //        pane: {
            //           // center: ['50%', '85%'],
            //            size: '100%',
            //            startAngle: -90,
            //            endAngle: 90,
            //            background: {
            //                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
            //                innerRadius: '60%',
            //                outerRadius: '100%',
            //                shape: 'arc'
            //            }
            //        },

            //        tooltip: {
            //            enabled: false
            //        },

            //        // the value axis
            //        yAxis: {
            //            stops: [
            //                [0.1, '#55BF3B'], // green
            //                [0.5, '#DDDF0D'], // yellow
            //                [0.9, '#DF5353'] // red
            //            ],
            //            lineWidth: 0,
            //            minorTickInterval: null,
            //            tickPixelInterval: 400,
            //            tickWidth: 0,
            //            title: {
            //                y: -70
            //            },
            //            labels: {
            //                y: 16
            //            }
            //        },

            //        plotOptions: {
            //            solidgauge: {
            //                dataLabels: {
            //                    y: 2,
            //                    borderWidth: 0,
            //                    useHTML: true
            //                }
            //            }
            //        }
            //    };

            //    debugger;

            //    var num = parseFloat(data.power) * 100;
            //    var n = parseFloat(num.toFixed(2));

            //    // The speed gauge
            //    $('#container-speed').highcharts(Highcharts.merge(gaugeOptions, {
            //        yAxis: {
            //            min: 0,
            //            max: 100,
            //            title: {
            //                text: 'kWh'
            //            }
            //        },

            //        credits: {
            //            enabled: false
            //        },



            //        series: [{
            //            name: 'Speed',
            //            data: [n],
            //            dataLabels: {
            //                format: '<div style="text-align:center"><span style="font-size:20px;color:' +
            //                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
            //                       '<span style="font-size:12px;color:silver">Current Usage</span></div>'
            //            },
            //            tooltip: {
            //                valueSuffix: ''
            //            }
            //        }]

            //    }));


            //});




        }).error(function (xhr, error, errorStatus, responseText) {

            $(".loader").hide();


            log.error(xhr.consumerMessage + ' ' + '[' + error + ']');


        });
    };




    $.ajax({
        type: "GET",
        dataType: "json",
        url: mainServicebase + 'user/' + $scope.uid + '/property',
        contentType: "application/json; charset=utf-8",
        headers: {
            'Authorization': 'Bearer ' + $scope.AuthToken
        },
        success: function (json) {






            var data = json.length == 0 ? null : json[json.length - 1];

            if (data.sensor != null) {
                $scope.sensorid = data.sensor.id;
            }

            debugger;


            $scope.propertytypename = data.propertyType.name;
            $scope.bedcounter = data.numberBedrooms;
            $scope.countryname = data.address.country;

            if (data != null) {

                $scope.propertytypeid = data.id;
                $scope.$apply();
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: mainServicebase + 'user/' + $scope.uid + '/property/' + $scope.propertytypeid,
                    contentType: "application/json; charset=utf-8",
                    headers: {
                        'Authorization': 'Bearer ' + $scope.AuthToken
                    },
                    success: function (json) {

                        $scope.tariffname = json.tariff.electricityProviderXML.name + ' ' + json.tariff.electricityProviderXML.nation;
                        $scope.$apply();


                    },
                    error: function (xhr, status) {


                    }
                });
            }



            $scope.utilizationinfo();


        },
        error: function (xhr, status) {

        }
    });



    $scope.utilizationinfo = function () {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: mainServicebase + 'user/' + $scope.uid + '/sensor/' + $scope.sensorid + '/comparison',
            contentType: "application/json; charset=utf-8",
            headers: {
                'Authorization': 'Bearer ' + $scope.AuthToken
            },
            success: function (response) {



                debugger;

                $scope.firstleft = (response.percentage / 2) * 100;

                $scope.secondleft = (response.percentageSimilarHouse / 2) * 100;

                var myper = (response.percentage - 1) * 100;

                $scope.percentage = myper.toFixed(2);

                if ($scope.percentage > 0) {




                    if (selectedlanguage == "it") {

                        $scope.lessmoretextforper = "Сегодня вы используете " + $scope.percentage + "% больше электроэнергии , чем вы ранее использовали в среднем";
                        $scope.righttextforhouse = "А Вы в курсе, что можете посетить вебсайт Volta Вебсайт для подсказок как снизить потребление электроэнергии"

                    }

                    else if (selectedlanguage == "sp") {
                        $scope.lessmoretextforper = "Hoy en día se está utilizando " + $scope.percentage + "% más electricidad que ya ha utilizado anteriormente en promedio";
                        $scope.righttextforhouse = "Sabías que usted puede visitar el sitio web de Volta para obtener consejos sobre la reducción de su consumo de electricidad"
                    }

                    else {

                        $scope.lessmoretextforper = "Today you are using " + $scope.percentage + "% more electricity than you have previously used on average";
                        $scope.righttextforhouse = "Did you know you can visit the Volta website for tips on reducing your electricity consumption"
                    }


                }
                else {

                    if (selectedlanguage == "it") {
                        $scope.lessmoretextforper = "Сегодня вы используете " + $scope.percentage * (-1) + "% меньше электроэнергии , чем вы ранее использовали в среднем";
                        $scope.righttextforhouse = "А Вы в курсе, что можете посетить вебсайт Volta Вебсайт для подсказок как снизить потребление электроэнергии"
                    }


                    else if (selectedlanguage == "sp") {
                        $scope.lessmoretextforper = "Hoy en día se está utilizando " + $scope.percentage * (-1) + "% menos de electricidad que ya ha utilizado anteriormente";
                        $scope.righttextforhouse = "Bien hecho , usted está reduciendo su consumo de electricidad";
                    }


                    else {

                        $scope.lessmoretextforper = "Today you are using " + $scope.percentage * (-1) + "% less electricity than you have previously used";
                        $scope.righttextforhouse = "Well done, you are reducing your electricity consumption";

                    }
                }

                //    var per = parseFloat(response.percentage);
                //    $scope.percentage = per.toFixed(2);


                //    $scope.householdpercentage = response.percentegeHousehold;

                var mypersimilar = (response.percentageSimilarHouse - 1) * 100;

                $scope.basedonhistory = mypersimilar.toFixed(2);

                if ($scope.basedonhistory > 0) {


                    if (selectedlanguage == "it") {

                        $scope.lessmoretextforsimilar = "ты используешь " + $scope.basedonhistory + "% больше электроэнергии , чем в среднем";
                        $scope.righttextforsimilar = "А Вы в курсе, что можете посетить вебсайт Volta Вебсайт для подсказок как снизить потребление электроэнергии";

                    }

                    else if (selectedlanguage == "sp") {

                        $scope.lessmoretextforsimilar = "tu usas " + $scope.basedonhistory + "% más electricidad que el promedio";
                        $scope.righttextforsimilar = "Sabías que usted puede visitar el sitio web de Volta para obtener consejos sobre la reducción de su consumo de electricidad";

                    }

                    else {

                        $scope.lessmoretextforsimilar = "You use " + $scope.basedonhistory + "% more electricity than the average";
                        $scope.righttextforsimilar = "Did you know you can visit the Volta website for tips on reducing your electricity consumption";

                    }



                }
                else {


                    if (selectedlanguage == "it") {

                        $scope.lessmoretextforsimilar = "ты используешь " + $scope.basedonhistory * (-1) + "% меньше электроэнергии , чем в среднем";
                        $scope.righttextforsimilar = "Поздравляем, Вы уменьшаете ваш расход электроэнергии";

                    }


                    else if (selectedlanguage == "sp") {

                        $scope.lessmoretextforsimilar = "tu usas " + $scope.basedonhistory * (-1) + "% menos electricidad que el promedio";
                        $scope.righttextforsimilar = "Bien hecho , el consumo de electricidad es menor que el promedio nacional";

                    }


                    else {

                        $scope.lessmoretextforsimilar = "You use " + $scope.basedonhistory * (-1) + "% less electricity than the average";
                        $scope.righttextforsimilar = "Well done, your electricity consumption is less than the National Average";

                    }




                }

                //   var persimilar = parseFloat(response.percentageSimilarHouse);
                //   $scope.basedonhistory = persimilar.toFixed(2);


                $scope.$apply();
                $scope.flagposition();


            },
            error: function (xhr, status) {




            }
        });
    }


    $scope.flagposition = function () {
        if ($scope.percentage < -10 && $scope.percentage > -50) {

            $(".flag1").show()
        }
        else if ($scope.percentage > -10 && $scope.percentage < 10) {
            $(".flag2").show()
        }
        else if ($scope.percentage > 10 && $scope.percentage < 50) {
            $(".flag3").show()
        }
        if ($scope.householdpercentage < -10 && $scope.householdpercentage > -50) {

            $(".flag4").show()
        }
        else if ($scope.householdpercentage > -10 && $scope.householdpercentage < 10) {
            $(".flag5").show()
        }
        else if ($scope.householdpercentage > 10 && $scope.householdpercentage < 50) {
            $(".flag6").show()
        }
        if ($scope.basedonhistory < -10 && $scope.basedonhistory > -50) {

            $(".flag7").show()
        }
        else if ($scope.basedonhistory > -10 && $scope.basedonhistory < 10) {
            $(".flag8").show()
        }
        else if ($scope.basedonhistory > 10 && $scope.basedonhistory < 50) {
            $(".flag9").show()
        }
    }


    $scope.gettodaycounter = function () {

        $http.get($scope.todayurl, null, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $scope.AuthToken } }).success(function (data) {

            var todayvalue = (data.power.power) * 1

            var TD = parseFloat(todayvalue);

            document.getElementById("today").innerHTML = TD.toFixed(2) + ' ';

            var costvalue = parseFloat(data.cost)
            $scope.cost = costvalue.toFixed(2);

            var standingchargevalue = parseFloat(data.standingCharge)

            $scope.standingcharge = standingchargevalue.toFixed(2);

        }).error(function (xhr, error, errorStatus, responseText) {


            document.getElementById("today").innerHTML = "-";

            $scope.cost = "-";
            $scope.standingcharge = "-";

        });
    };

    $scope.getdailyavgcounter = function () {

        $http.get($scope.dailyavg, null, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $scope.AuthToken } }).success(function (data) {

            var todayavgvalue = (data.power) * 100
            document.getElementById("todayavg").innerHTML = todayavgvalue.toFixed(3);

            $scope.todayvalue = todayavgvalue;

            $scope.$apply();

        }).error(function (xhr, error, errorStatus, responseText) {




        });
    };

    $scope.getexpectedgcounter = function () {

        $http.get($scope.expected, null, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $scope.AuthToken } }).success(function (data) {

            var todayexpvalue = (data.power) * 100
            document.getElementById("todayexp").innerHTML = todayexpvalue.toFixed(3);
            $scope.expvalue = todayexpvalue;
            $scope.$apply();

            $scope.wholehousemessage();


        }).error(function (xhr, error, errorStatus, responseText) {




        });
    };


    $scope.wholehousemessage = function () {

        if ($scope.todayvalue == $scope.expvalue) {
            document.getElementById("wholehousemessage").innerHTML = $scope.Equalmessage;

        }

        if ($scope.todayvalue < $scope.expvalue) {

            document.getElementById("wholehousemessage").innerHTML = $scope.lessmessage;

        }


        if ($scope.todayvalue > $scope.expvalue) {
            document.getElementById("wholehousemessage").innerHTML = $scope.greatermessage;

        }



    };


    var dt = new Date();
    var currenttime = dt.getHours();

    $scope.now = currenttime

    function cycle() {




        if ($scope.now < 6) {

            if (selectedlanguage == "it") {

                $scope.cycle = "OffВне пика";


            }

            else if (selectedlanguage == "sp") {

                $scope.cycle = "fuera de pico"
                $scope.kwhtext = 'кВт/час';
            }

            else {
                $scope.cycle = "Off Peak";
                $scope.kwhtext = 'KWh';
            }


            $scope.$apply();
        }
        else if ($scope.now >= 6 && $scope.now < 18) {
            if (selectedlanguage == "it") {

                $scope.cycle = "На пике"

            }

            else if (selectedlanguage == "sp") {

                $scope.cycle = "pico"

            }

            else {
                $scope.cycle = "Peak"
            }
            $scope.$apply();
        }
        else {
            if (selectedlanguage == "it") {

                $scope.cycle = "Экономный"

            }

            else if (selectedlanguage == "sp") {

                $scope.cycle = "ahorrador"

            }

            else {
                $scope.cycle = "Saver"
            }
            $scope.$apply();
        }

        $scope.updateFormateforGraphforLang();

        $scope.myculture(selectedlanguage);

        $scope.tipdetails()

    }

    setInterval(function () { cycle() }, 1000);


    $scope.marginleft = $scope.now * 4;

    if ($scope.now == 23) {
        $scope.marginleft = 77;
    }

    if ($scope.now == 22 || $scope.now == 21) {
        $scope.marginleft = 70;
    }

    if ($scope.now == 20) {
        $scope.marginleft = 67;
    }

    if ($scope.now >= 20) {
        $(".leftnow").show()
        $(".rightnow").hide()
    }
    else {

        $(".leftnow").hide()
        $(".rightnow").show()

    }




    $scope.get24hrsgraph = function () {


        if ($scope.graphname == "24hrs") {
            if ($scope.isDateRangeSelected) {
                $scope.bottomgraphurl = $scope.bottomgraphurl + "?date=" + $scope.onedayapidate + "+" + moment(moment(new Date()).add(1, 'hours').zone('UTC')).format("HH:mm:ss");
            }
            else {
                $scope.bottomgraphurl = $scope.bottomgraphurl + "?date=" + moment($scope.onedayapidate).format("DD-MM-YYYY") + "+" + moment(moment(new Date()).add(1, 'hours').zone('UTC')).format("HH:mm:ss");
            }
        }
        else {
            if ($scope.isDateRangeSelected) {
                $scope.bottomgraphurl = $scope.bottomgraphurl + "?date=" + $scope.onedayapidate + "+" + moment(moment(new Date()).add(1, 'hours').zone('UTC')).format("HH:mm:ss");
            }

        }

        // alert($scope.bottomgraphurl);



        $http.get($scope.bottomgraphurl, null, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + $scope.AuthToken } }).success(function (data) {





            var xData = [];
            var yData = [];



            var xData = [];
            var yData = [];
            var showdate = "";

            for (var i = 0; i < data.listPower.length; i++) {
                xData.push(parseFloat(data.listPower[i].power));
                yData.push(new Date(data.listPower[i].timestamp));

                if (i === 0) {
                    showdate = new Date(data.listPower[i].timestamp);
                }

            }

            switch ($scope.graphname) {

                case "24hrs":

                    var xData = [];
                    var yData = [];
                    for (var i = 0; i < data.listPower.length; i++) {
                        xData.push(parseFloat(data.listPower[i].power));
                        yData.push(moment(new Date(data.listPower[i].timestamp)).format("hh a"));

                    }

                    $scope.graphstep = 4;
                    var predate = $scope.previousdate;
                    var pd = new Date(predate);
                    $scope.previousdate = moment(new Date(showdate)).subtract(1, "days");

                    var aftdate = $scope.datetoshow;
                    var ad = new Date(aftdate);
                    $scope.datetoshow = moment(new Date(showdate)).zone("+0000");

                    $scope.graphtooltip = '%e %b %Y - %H:%M';
                    $scope.seriesformat = '%d %b %Y';

                    $scope.fulltooltip = 'point.key';
                    $scope.lengthofbar = yData.length;

                    $scope.datetoshowlabel = Highcharts.dateFormat($scope.seriesformat, $scope.datetoshow)
                    break;

                case "7days":

                    var xData = [];
                    var yData = [];
                    for (var i = 0; i < data.listPower.length; i++) {
                        xData.push(parseFloat(data.listPower[i].power));
                        yData.push(moment(new Date(data.listPower[i].timestamp)).format("DD MMM YY"));

                    }

                    $scope.graphstep = 1;
                    $scope.previousdate = moment(new Date(yData[yData.length - 1])).zone("+0000");

                    //  $scope.previousdate = '%d %m %y'
                    $scope.datetoshow = moment(new Date(showdate)).zone("+0000");
                    //   $scope.datetoshow = '%d %m %y'
                    $scope.graphtooltip = '%e %b %Y';
                    $scope.seriesformat = '%d %b %Y';
                    $scope.fulltooltip = 'point.key';
                    $scope.lengthofbar = yData.length;
                    $scope.datetoshowlabel = Highcharts.dateFormat($scope.seriesformat, $scope.datetoshow)
                    break;
                case "30days":


                    var xData = [];
                    var yData = [];
                    for (var i = 0; i < data.listPower.length; i++) {
                        xData.push(parseFloat(data.listPower[i].power));
                        yData.push(moment(new Date(data.listPower[i].timestamp)).format("DD MMM YY"));

                    }

                    $scope.graphstep = 7;

                    var predate = $scope.previousdate;
                    var pd = new Date(predate);
                    $scope.previousdate = moment(new Date(yData[yData.length - 1])).zone("+0000");

                    var aftdate = $scope.datetoshow;
                    var ad = new Date(aftdate);
                    $scope.datetoshow = moment(new Date(showdate)).zone("+0000");
                    $scope.graphtooltip = '%e %b %Y';
                    $scope.seriesformat = '%d %b %Y';
                    $scope.fulltooltip = 'point.key';
                    $scope.lengthofbar = yData.length;
                    $scope.datetoshowlabel = Highcharts.dateFormat($scope.seriesformat, $scope.datetoshow)
                    break;
                case "6month":

                    var xData = [];
                    var yData = [];
                    for (var i = 0; i < data.listPower.length; i++) {
                        xData.push(parseFloat(data.listPower[i].power));
                        yData.push(moment(new Date(data.listPower[i].timestamp)).format("DD MMM YY"));

                    }

                    $scope.graphstep = 1;
                    var predate = $scope.previousdate;
                    var pd = new Date(predate);
                    $scope.previousdate = moment(new Date(yData[yData.length - 1])).zone("+0000");

                    var aftdate = $scope.datetoshow;
                    var ad = new Date(aftdate);
                    // $scope.datetoshow = moment(ad).format("MMM YYYY");
                    $scope.datetoshow = moment(new Date(showdate)).zone("+0000");
                    $scope.graphtooltip = '%b %Y';
                    $scope.seriesformat = '%b %Y';
                    $scope.fulltooltip = 'point.key';
                    $scope.lengthofbar = yData.length;
                    $scope.datetoshowlabel = Highcharts.dateFormat($scope.seriesformat, $scope.datetoshow)
                    break;
                case "1year":


                    var xData = [];
                    var yData = [];
                    for (var i = 0; i < data.listPower.length; i++) {
                        xData.push(parseFloat(data.listPower[i].power));
                        yData.push(moment(new Date(data.listPower[i].timestamp)).format("DD MMM YY"));

                    }

                    $scope.graphstep = 2;


                    var predate = $scope.previousdate;
                    var pd = new Date(predate);
                    $scope.previousdate = moment(new Date(yData[yData.length - 1])).zone("+0000");

                    var aftdate = $scope.datetoshow;
                    var ad = new Date(aftdate);
                    //  $scope.datetoshow = moment(ad).format("MMM YYYY");
                    $scope.datetoshow = moment(new Date(showdate)).zone("+0000");
                    $scope.graphtooltip = '%b %Y';
                    $scope.seriesformat = '%b %Y';
                    $scope.fulltooltip = 'point.key';
                    $scope.lengthofbar = yData.length;
                    $scope.datetoshowlabel = Highcharts.dateFormat($scope.seriesformat, $scope.datetoshow)
                    break;
            }


            Highcharts.setOptions({
                global: {
                    useUTC: false,

                }
            });


            if ($scope.lengthofbar > 5) {

                $('#container1').highcharts({
                    chart: {
                        type: 'column',
                        height: 225,
                        zoomType: 'x',
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: ''
                    },
                    xAxis: {
                        categories: yData,
                        tickLength: 7,
                        reversed: true,
                        type: 'date',

                        title: 'Last 24 Hours Detail',
                        lineWidth: 0,
                        minorGridLineWidth: 0,
                        tickmarkPlacement: 'on',
                        tickInterval: $scope.graphstep,
                        labels: {
                            //   format: $scope.graphdateformat,
                            style: {
                                fontSize: '8px',
                            },
                        },
                    },
                    yAxis: {

                        title: {
                            text: $scope.kwhtext
                        },
                        labels: {
                            style: {
                                fontSize: '6px',
                            },

                        }
                    },

                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{' + $scope.fulltooltip + '} </span><table>',
                        pointFormat: '<tr>' +
                            '<td style="padding:0"><b>{point.y:.1f} ' + $scope.kwhtext + '</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },


                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: [{
                        name: Highcharts.dateFormat($scope.seriesformat, $scope.previousdate) + '-' + Highcharts.dateFormat($scope.seriesformat, $scope.datetoshow),
                        data: xData,
                        color: '#589c16'
                    }]
                });

            }
            else {
                $('#container1').html("<h3>Warning - No data found</h3>");
                log.error("No data found");
            }


        }).error(function (xhr, error, errorStatus, responseText) {





            log.error(xhr.consumerMessage + ' ' + '[' + error + ']');
        });
    };


    $scope.FirstTimeClick = function (CurrentPage) {
        $scope.isFirstTime = true;
        var Current = CurrentPage - 1;
        $("#allbuttons button").each(function (index) {
            $(this).removeClass();
            if (index == Current) {
                $(this).addClass("btn btn-info");
            } else {
                $(this).addClass("btn btn-success");
            }
        });
        $scope.ActiveButton = CurrentPage;
        $scope.GetMyData(CurrentPage);
    }

    $scope.GetMyData = function (CurrentPage) {



        $scope.daystoIncrease = 0;


        $scope.datetoshow = moment(todaydate).format($scope.culturedateformat);
        $("#rightarrow").hide();

        switch (CurrentPage) {
            case 1:
                if ($scope.isFirstTime) {
                    $scope.previousdate = new Date(todaydate.getFullYear(), todaydate.getMonth(), todaydate.getDate() - 1);
                    $scope.previousdate = moment($scope.previousdate).format($scope.culturedateformat);
                    $scope.isFirstTime = false;
                }
                $scope.onedayapidate = new Date();
                $scope.get24hrs(false); break;
            case 2:
                if ($scope.isFirstTime) {
                    $scope.previousdate = new Date(todaydate.getFullYear(), todaydate.getMonth(), todaydate.getDate() - 7);
                    $scope.previousdate = moment($scope.previousdate).format($scope.culturedateformat);
                    $scope.isFirstTime = false;
                }
                $scope.get7days(false); break;
            case 3:
                if ($scope.isFirstTime) {
                    $scope.previousdate = new Date(todaydate.getFullYear(), todaydate.getMonth(), todaydate.getDate() - 30);
                    $scope.previousdate = moment($scope.previousdate).format($scope.culturedateformat);
                    $scope.isFirstTime = false;
                }
                $scope.getmonth(false); break;
            case 4:
                if ($scope.isFirstTime) {
                    //$scope.previousdate = new Date(todaydate.getFullYear(), todaydate.getMonth(), todaydate.getDate() - 180);
                    $scope.previousdate = moment(todaydate).subtract(6, "months");

                    $scope.previousdate = moment($scope.previousdate).format($scope.culturedateformat);

                    $scope.isFirstTime = false;
                }


                $scope.get6month(false); break;
            case 5:
                if ($scope.isFirstTime) {
                    $scope.previousdate = new Date(todaydate.getFullYear(), todaydate.getMonth(), todaydate.getDate() - 365);
                    $scope.previousdate = moment($scope.previousdate).format($scope.culturedateformat);
                    $scope.isFirstTime = false;
                }
                $scope.getyear(false); break;
        }

    }

    $scope.showpicker = function () {
        $(".datepickersection").show()
        $(".graphmenusection").hide()
    }


    $scope.showgraphmenu = function () {

        $(".graphmenusection").show()
        $(".datepickersection").hide()
    }


    $scope.get7days = function (isDaterange) {

        $scope.graphname = "7days";

        $scope.bottomgraphurl = $scope.last7days;
        $scope.isDateRangeSelected = isDaterange;
        $scope.islast7dayactive = true;
        console.log("7 days URL::" + $scope.bottomgraphurl);
        $scope.graphdateformat = '{value:%d/%m/%y}'
        $scope.get24hrsgraph();
        $scope.bottomgraphurl = "";



    };

    $scope.getmonth = function (isDaterange) {
        $scope.graphname = "30days";
        $scope.isDateRangeSelected = isDaterange;
        $scope.bottomgraphurl = $scope.lastmonth;
        console.log("1 month URL::" + $scope.bottomgraphurl);
        $scope.graphdateformat = '{value:%d/%m/%y}'
        $scope.get24hrsgraph();
        $scope.bottomgraphurl = "";

    };

    $scope.get24hrs = function (isDaterange) {

        $scope.graphname = "24hrs";
        $scope.isDateRangeSelected = isDaterange;
        $scope.bottomgraphurl = $scope.last24hours;
        $scope.graphdateformat = '{value:%I:%M %p}'
        $scope.get24hrsgraph();

        console.log("24 hrs URL::" + $scope.bottomgraphurl);
        $scope.bottomgraphurl = "";



    };

    $scope.get6month = function (isDaterange) {
        $scope.graphname = "6month";
        $scope.isDateRangeSelected = isDaterange;
        $scope.bottomgraphurl = $scope.last6month;
        $scope.graphdateformat = '{value:%b}'
        console.log("6 months URL::" + $scope.bottomgraphurl);
        $scope.get24hrsgraph();
        $scope.bottomgraphurl = "";

    };

    $scope.getyear = function (isDaterange) {
        $scope.graphname = "1year";
        $scope.isDateRangeSelected = isDaterange;
        $scope.bottomgraphurl = $scope.lastyear;
        console.log("1 Year URL::" + $scope.bottomgraphurl);
        $scope.graphdateformat = '{value:%b}'
        $scope.get24hrsgraph();
        $scope.bottomgraphurl = "";

    };

    $scope.getonedayback = function () {



        var onedayAgo = new Date();
        var onedaybefore = new Date();

        switch ($scope.ActiveButton) {
            case 1:

                var onedayAgocheck = new Date();
                var x = $scope.daystoIncrease;

                x = x + 1;
                onedayAgocheck = onedayAgocheck.setDate(onedayAgocheck.getDate() - x);


                if (new Date(twoyearago) <= new Date(onedayAgocheck)) {


                    $scope.daystoIncrease = $scope.daystoIncrease + 1;
                    onedayAgo = onedayAgo.setDate(onedayAgo.getDate() - $scope.daystoIncrease);
                    onedaybefore = onedaybefore.setDate(onedaybefore.getDate() - ($scope.daystoIncrease + 1))
                    $scope.previousdate = moment(onedaybefore).format($scope.culturedateformat);
                    $scope.onedayapidate = moment(onedayAgo).format("DD-MM-YYYY");
                    $scope.isDateRangeSelected = true;

                    $scope.datetoshow = moment(onedayAgo).format($scope.culturedateformat);

                    $scope.previousdate = moment(onedaybefore).format($scope.culturedateformat);

                    if (moment(partodaydate).format($scope.culturedateformat) != moment(onedayAgo).format($scope.culturedateformat)) {
                        $("#rightarrow").show()
                    }
                    else {
                        $("#rightarrow").hide()

                    }

                    $scope.get24hrs(true);
                }

                else {


                    log.info("can't go back any further");

                }



                break;
            case 2:


                var onedayAgocheck = new Date();
                var x = $scope.daystoIncrease;

                x = x + 7;
                onedayAgocheck = onedayAgocheck.setDate(onedayAgocheck.getDate() - x);

                if (new Date(twoyearago) <= new Date(onedayAgocheck)) {


                    $scope.daystoIncrease = $scope.daystoIncrease + 7;
                    onedayAgo = onedayAgo.setDate(onedayAgo.getDate() - $scope.daystoIncrease);


                    onedaybefore = onedaybefore.setDate(onedaybefore.getDate() - ($scope.daystoIncrease + 7))
                    $scope.previousdate = moment(onedaybefore).format($scope.culturedateformat);



                    $scope.onedayapidate = moment(onedayAgo).format("DD-MM-YYYY");
                    $scope.isDateRangeSelected = true;
                    $scope.datetoshow = moment(onedayAgo).format($scope.culturedateformat);

                    if (moment(partodaydate).format($scope.culturedateformat) != moment(onedayAgo).format($scope.culturedateformat)) {
                        $("#rightarrow").show()
                    }
                    else {
                        $("#rightarrow").hide()

                    }
                    $scope.get7days(true);
                }

                else {


                    log.info("can't go back any further");

                }


                break;
            case 3:


                var onedayAgocheck = new Date();
                var x = $scope.daystoIncrease;

                x = x + 30;
                onedayAgocheck = onedayAgocheck.setDate(onedayAgocheck.getDate() - x);


                if (new Date(twoyearago) <= new Date(onedayAgocheck)) {


                    $scope.daystoIncrease = $scope.daystoIncrease + (32 - new Date(onedayAgo.getYear(), onedayAgo.getMonth(), 32).getDate());
                    onedayAgo = onedayAgo.setDate(onedayAgo.getDate() - $scope.daystoIncrease);


                    onedaybefore = onedaybefore.setDate(onedaybefore.getDate() - ($scope.daystoIncrease + 30))
                    $scope.previousdate = moment(onedaybefore).format($scope.culturedateformat);

                    $scope.onedayapidate = moment(onedayAgo).format("DD-MM-YYYY");
                    $scope.isDateRangeSelected = true;
                    $scope.datetoshow = moment(onedayAgo).format($scope.culturedateformat);

                    if (moment(partodaydate).format($scope.culturedateformat) != moment(onedayAgo).format($scope.culturedateformat)) {
                        $("#rightarrow").show()
                    }
                    else {
                        $("#rightarrow").hide()

                    }
                    $scope.getmonth(true);
                }

                else {


                    log.info("can't go back any further");

                }

                break;

            case 4:


                var onedayAgocheck = new Date();
                var x = $scope.daystoIncrease;

                x = x + 180;
                onedayAgocheck = onedayAgocheck.setDate(onedayAgocheck.getDate() - x);


                if (new Date(twoyearago) <= new Date(onedayAgocheck)) {


                    $scope.daystoIncrease = $scope.daystoIncrease + 180;
                    onedayAgo = onedayAgo.setDate(onedayAgo.getDate() - $scope.daystoIncrease);

                    onedaybefore = onedaybefore.setDate(onedaybefore.getDate() - ($scope.daystoIncrease + 180))
                    $scope.previousdate = moment(onedaybefore).format($scope.culturedateformat);

                    $scope.onedayapidate = moment(onedayAgo).format("DD-MM-YYYY");
                    $scope.isDateRangeSelected = true;
                    $scope.datetoshow = moment(onedayAgo).format($scope.culturedateformat);

                    if (moment(partodaydate).format($scope.culturedateformat) != moment(onedayAgo).format($scope.culturedateformat)) {
                        $("#rightarrow").show()
                    }
                    else {
                        $("#rightarrow").hide()

                    }
                    $scope.get6month(true);
                }

                else {


                    log.info("can't go back any further");

                }
                break;
            case 5:

                var ydays = 365;
                if (onedayAgo.getYear() % 4 == 0) {
                    ydays = 366;
                }

                var onedayAgocheck = new Date();
                var x = $scope.daystoIncrease;

                x = x + ydays;
                onedayAgocheck = onedayAgocheck.setDate(onedayAgocheck.getDate() - x);






                if (new Date(twoyearago) <= new Date(onedayAgocheck)) {


                    $scope.daystoIncrease = $scope.daystoIncrease + ydays;
                    onedayAgo = onedayAgo.setDate(onedayAgo.getDate() - $scope.daystoIncrease);
                    onedaybefore = onedaybefore.setDate(onedaybefore.getDate() - ($scope.daystoIncrease + ydays))


                    $scope.previousdate = moment(onedaybefore).format($scope.culturedateformat);

                    $scope.onedayapidate = moment(onedayAgo).format("DD-MM-YYYY");
                    $scope.isDateRangeSelected = true;
                    $scope.datetoshow = moment(onedayAgo).format($scope.culturedateformat);
                    if (moment(partodaydate).format($scope.culturedateformat) != moment(onedayAgo).format($scope.culturedateformat)) {
                        $("#rightarrow").show()
                    }
                    else {




                        //   log.info("can't go forward any further");
                        $("#rightarrow").hide()

                    }
                    $scope.getyear(true);
                }

                else {


                    log.info("can't go back any further");

                }




                break;
        }



    }

    $scope.getonedayafter = function () {
        var onedayafter = new Date();
        var onedaybefore = new Date();

        switch ($scope.ActiveButton) {
            case 1:
                $scope.daystoIncrease = $scope.daystoIncrease - 1;
                onedayafter = onedayafter.setDate(onedayafter.getDate() - $scope.daystoIncrease);


                onedaybefore = onedaybefore.setDate(onedaybefore.getDate() - ($scope.daystoIncrease - 1))

                $scope.previousdate = $scope.datetoshow;

                $scope.onedatafterdate = moment(onedayafter).format("DD-MM-YYYY");
                $scope.isDateRangeSelected = true;
                //  $scope.datetoshow = $scope.onedatafterdate;
                $scope.datetoshow = moment(onedayafter).format($scope.culturedateformat);
                $scope.onedayapidate = moment(onedayafter).format("DD-MM-YYYY");

                if (moment(partodaydate).format($scope.culturedateformat) == moment(onedayafter).format($scope.culturedateformat)) {

                    $("#rightarrow").hide()

                }

                else {
                    $("#rightarrow").show()

                }

                $scope.get24hrs(true);
                break;
            case 2:
                $scope.daystoIncrease = $scope.daystoIncrease - 7;
                onedayafter = onedayafter.setDate(onedayafter.getDate() - $scope.daystoIncrease);



                onedaybefore = onedaybefore.setDate(onedaybefore.getDate() - ($scope.daystoIncrease - 7))

                $scope.previousdate = $scope.datetoshow;

                $scope.onedatafterdate = moment(onedayafter).format("DD-MM-YYYY");
                $scope.isDateRangeSelected = true;
                $scope.onedayapidate = moment(onedayafter).format("DD-MM-YYYY");
                //  $scope.datetoshow = $scope.onedatafterdate;

                $scope.datetoshow = moment(onedayafter).format($scope.culturedateformat);


                if (moment(partodaydate).format($scope.culturedateformat) == moment(onedayafter).format($scope.culturedateformat)) {

                    $("#rightarrow").hide()

                }

                else {
                    $("#rightarrow").show()

                }
                $scope.get7days(true); break;
            case 3:
                //$scope.daystoIncrease = $scope.daystoIncrease - 30;
                $scope.daystoIncrease = $scope.daystoIncrease - (32 - new Date(onedayafter.getYear(), onedayafter.getMonth(), 32).getDate())
                onedayafter = onedayafter.setDate(onedayafter.getDate() - $scope.daystoIncrease);

                onedaybefore = onedaybefore.setDate(onedaybefore.getDate() - ($scope.daystoIncrease - 30))

                $scope.previousdate = $scope.datetoshow;


                $scope.onedatafterdate = moment(onedayafter).format("DD-MM-YYYY");
                $scope.isDateRangeSelected = true;

                // $scope.datetoshow = $scope.onedatafterdate;
                $scope.datetoshow = moment(onedayafter).format($scope.culturedateformat);
                $scope.onedayapidate = moment(onedayafter).format("DD-MM-YYYY");

                if (moment(partodaydate).format($scope.culturedateformat) == moment(onedayafter).format($scope.culturedateformat)) {

                    $("#rightarrow").hide()

                }

                else {
                    $("#rightarrow").show()

                }
                $scope.getmonth(true); break;
            case 4:
                $scope.daystoIncrease = $scope.daystoIncrease - 180;
                onedayafter = onedayafter.setDate(onedayafter.getDate() - $scope.daystoIncrease);

                onedaybefore = onedaybefore.setDate(onedaybefore.getDate() - ($scope.daystoIncrease - 180))
                $scope.previousdate = $scope.datetoshow;


                $scope.onedatafterdate = moment(onedayafter).format("DD-MM-YYYY");

                $scope.isDateRangeSelected = true;
                // $scope.datetoshow = $scope.onedatafterdate;
                $scope.onedayapidate = moment(onedayafter).format("DD-MM-YYYY");
                $scope.datetoshow = moment(onedayafter).format($scope.culturedateformat);


                if (moment(partodaydate).format($scope.culturedateformat) == moment(onedayafter).format($scope.culturedateformat)) {

                    $("#rightarrow").hide()

                }

                else {
                    $("#rightarrow").show()

                }
                $scope.get6month(true); break;
            case 5:
                var ydays = 365;
                if (onedayafter.getYear() % 4 == 0) {
                    ydays = 366;
                }
                $scope.daystoIncrease = $scope.daystoIncrease - ydays;
                onedayafter = onedayafter.setDate(onedayafter.getDate() - $scope.daystoIncrease);

                onedaybefore = onedaybefore.setDate(onedaybefore.getDate() - ($scope.daystoIncrease - ydays))
                $scope.previousdate = $scope.datetoshow;

                $scope.onedatafterdate = moment(onedayafter).format("DD-MM-YYYY");
                $scope.isDateRangeSelected = true;
                //$scope.datetoshow = $scope.onedatafterdate;
                $scope.datetoshow = moment(onedayafter).format($scope.culturedateformat);

                $scope.onedayapidate = moment(onedayafter).format("DD-MM-YYYY");
                if (moment(partodaydate).format($scope.culturedateformat) == moment(onedayafter).format($scope.culturedateformat)) {

                    $("#rightarrow").hide()

                }

                else {
                    $("#rightarrow").show()

                }
                $scope.getyear(true); break;
        }
    }

    $scope.getgraph();
    $scope.getsecondgraph();
    $scope.gettodaycounter();
    $scope.getexpectedgcounter();
    $scope.getdailyavgcounter();
    $scope.GetMyData(1);


    $scope.tipdetails = function () {
        $.ajax({
            url: mainServicebase + 'tip',
            type: "GET",
            accept: "application/json",
            headers: {
                'Authorization': 'Bearer ' + $scope.AuthToken
            },

            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status) {




                $scope.firsttip = response[0].engTip;
                $scope.secondtip = response[1].engTip;
                $scope.thirdtip = response[2].engTip;

                if (selectedlanguage == "it") {

                    $scope.firsttip = response[0].rusTip;
                    $scope.secondtip = response[1].rusTip;
                    $scope.thirdtip = response[2].rusTip;

                }

                if (selectedlanguage == "sp") {

                    $scope.firsttip = response[0].spaTip;
                    $scope.secondtip = response[1].spaTip;
                    $scope.thirdtip = response[2].spaTip;

                }

            },
            error: function (err) {

            }
        })
    }


    $scope.tipdetails()


    $(".languagechanger").click(function () {
        setTimeout(function () {

            $scope.FirstTimeClick(1);

            $scope.utilizationinfo();

            // FirstTimeClick(1)
        }, 1500);

    });


    //setInterval(function () { $scope.gettodaycounter(); }, 10000);

    $.ajax({
        type: "GET",
        dataType: "json",
        url: mainServicebase + 'user/' + $scope.uid + '/property',
        contentType: "application/json; charset=utf-8",
        headers: {
            'Authorization': 'Bearer ' + $scope.AuthToken
        },
        success: function (json) {





            var data = json.length == 0 ? null : json[json.length - 1];

            if (data.sensor != null) {
                $scope.sensorid = data.sensor.id;
            }


            $scope.propertytypename = data.propertyType.name;
            $scope.bedcounter = data.numberBedrooms;

            if (data != null) {

                $scope.propertytypeid = data.id;
                //    $scope.$apply();
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: mainServicebase + 'user/' + $scope.uid + '/property/' + $scope.propertytypeid,
                    contentType: "application/json; charset=utf-8",
                    headers: {
                        'Authorization': 'Bearer ' + $scope.AuthToken
                    },
                    success: function (json) {



                        debugger;

                        $scope.standingcharges = json.tariff.listTariffPriceXML[0].standingCharge


                        $scope.newstandingcharges = (json.tariff.listTariffPriceXML[0].standingCharge) / 100;


                        var TD = parseFloat($scope.newstandingcharges);

                        $scope.newstandingcharges = TD.toFixed(2);

                        //    $scope.$apply();


                    },
                    error: function (xhr, status) {
                    }
                });
            }






        },
        error: function (xhr, status) {



        }
    });

}]);

