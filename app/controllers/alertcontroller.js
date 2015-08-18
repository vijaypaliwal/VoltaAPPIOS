'use strict';
app.controller('alertcontroller', ['$scope', 'log', 'localStorageService', function ($scope, log, localStorageService) {

    var authData = localStorageService.get('authorizationData');
    var userLang = navigator.language || navigator.userLanguage;

   


    $scope.email = authData.userName;
    $scope.uid = authData.uid;
    $scope.AuthToken = authData.token;

    $scope.currentselectedlanguage = "en"

    setInterval(function () { $scope.currentselectedlanguage = selectedlanguage }, 500);
    $scope.alert = {
        highusagehr: false,
        lowactivityalert: false,
        mediumactivityalert: false,
        highactivityalert: false,
        highusageday: false,
        email: $scope.email

    };


    if (userLang == "es" || "ru" || "ru-ru") {

        $("#CurrentDate").html("<b>" + moment(new Date()).format("DD MMM YYYY,h:mm:ss a") + "</b>");
    }

    else {
        $("#CurrentDate").html("<b>" + moment(new Date()).format("MMM DD YYYY,h:mm:ss a") + "</b>");
    }


    $.ajax({
        url: mainServicebase + 'user/' + $scope.uid + '/alert',
        type: "GET",
        accept: "application/json",
        headers: {
            'Authorization': 'Bearer ' + $scope.AuthToken
        },

        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response, status) {
            debugger;
            var data = response.length == 0 ? null : response[response.length - 1];

            if (data != null) {
                $scope.alert.ID = data.id;
                $scope.alert.hourMax = data.hourMax;
                $scope.alert.dayMax = data.dayMax;
                $scope.alert.highusagehr = data.hourAlert;
                $scope.alert.highusageday = data.dayAlert;
                $scope.alert.email = data.emailAlert;
                $scope.alert.lowactivityalert = data.lowActivity;
                $scope.alert.mediumactivityalert = data.mediumActivity;
                $scope.alert.highactivityalert = data.highActivity;
                $('#hr').attr('checked', $scope.alert.highusagehr); // Checks it
                $('#day').attr('checked', $scope.alert.highusageday);
                $('#lowact').attr('checked', data.lowActivity);
                $('#medact').attr('checked', data.mediumActivity);
                $('#highact').attr('checked', data.highActivity);
                $scope.$apply();
            }


        },
        error: function (err) {



        }
    })



    $scope.savealert = function () {

        $.ajax({
            url: mainServicebase + 'user/' + $scope.uid + '/alert/' + $scope.alert.ID,
            type: "PUT",
            accept: "application/json",
            data: JSON.stringify({ "hourAlert": $scope.alert.highusagehr, "dayAlert": $scope.alert.highusageday, "emailAlert": $scope.alert.email, "dayMax": $scope.alert.dayMax, "hourMax": $scope.alert.hourMax, "lowActivity": $scope.alert.lowactivityalert, "mediumActivity": $scope.alert.mediumactivityalert, "highActivity": $scope.alert.highactivityalert }),
            headers: {
                'Authorization': 'Bearer ' + $scope.AuthToken
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status) {


                $(".successmessage").show();
                $(".errormessage").hide();
                $scope.responsemessage = "Your changes have been saved";
                $scope.$apply();
                hidemessage();



                debugger;


                if ($scope.currentselectedlanguage == "it") {

                    // log.info("Предупреждение успешно добавлен");

                }
                else {

                    //  log.info("Alert Added Successfully");

                }

            },
            error: function (err) {


                $(".successmessage").hide();
                $(".errormessage").show();
                $scope.responsemessage = err.statusText;
                $scope.$apply();
                hidemessage();

                // alert("save Error");


                //   log.error("Error::" + err.statusText);


            }
        })

    }







}]);

