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
        highusageday: false,
        largeconsumes: false,
        computers: false,
        light: false,
        emailAlert: $scope.email
     
    };


    if (userLang == "es" || "ru" || "ru-ru") {

        $("#CurrentDate").html("<b>" + moment(new Date()).format("DD MMM YYYY,h:mm:ss a") + "</b>");

    }

    else {
        $("#CurrentDate").html("<b>" + moment(new Date()).format("MMM DD YYYY,h:mm:ss a") + "</b>");
    }

     

        $.ajax({
            url: 'http://54.154.64.51:8080/voltaware/v1.0/user/' + $scope.uid + '/alert',
            type: "GET",
            accept: "application/json",
            headers: {
                'Authorization': 'Bearer ' + $scope.AuthToken
            },
        
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status) {


                var data = response.length == 0 ? null : response[response.length - 1];

                if (data != null) {
                    $scope.alert.highusagehr = data.hourAlert;
                    $scope.alert.highusageday = data.dayAlert;
                    $scope.alert.emailAlert = data.emailAlert;

                    $scope.$apply();
                }

        

       
                

            },
            error: function (err) {

          

               


            }
        })
  


        $scope.savealert = function () {

     

        $.ajax({
            url: 'http://54.154.64.51:8080/voltaware/v1.0/user/' + $scope.uid + '/alert',
            type: "POST",
            accept: "application/json",
            data: JSON.stringify({ "hourAlert": $scope.alert.highusagehr, "dayAlert": $scope.alert.highusageday, "emailAlert" : $scope.alert.emailAlert }),
            headers: {
                'Authorization': 'Bearer ' + $scope.AuthToken
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status) {

                if ($scope.currentselectedlanguage == "it") {

                    log.info("Предупреждение успешно добавлен");

                }
                else {

                    log.info("Alert Added Successfully");

                }
            

             
            

            },
            error: function (err) {


                log.error("Error::" + err.statusText);

            


            }
        })

        }


    
    

        


}]);

