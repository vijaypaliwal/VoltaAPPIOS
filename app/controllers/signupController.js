'use strict';
app.controller('signupController', ['$scope', '$location', 'authService', 'ngAuthSettings', '$interval', 'localStorageService', 'log', function ($scope, $location, authService, ngAuthSettings, $interval, localStorageService, log) {

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.registration = {
        emailAddress: "",
        password: "Password",
        confirmPassword: "Password",
        firstName: "",
        lastName: ""
    };

    //$scope.CurrentUserDetail = { firstName: "Ajay", emailAddress: "VJ@vijay.com" };
   // $scope.registration1 = { user: $scope.CurrentUserDetail, password: "password" }


    $scope.signUp = function () {
   
        
        var dataTosend = { "user": { firstName: $scope.registration.firstName, emailAddress: $scope.registration.emailAddress }, "password": $scope.registration.password };
        
        authService.saveRegistration(dataTosend).then(function (response) {
            $scope.savedSuccessfully = true;
            $scope.message = "User has been registered successfully, you will be redicted to dashboard page in 3 seconds.";
        
            startTimer();
         

            setTimeout(function () {
                $(".loader").hide();
                $(".submittext").show();
                $location.path('/account');
            }, 2000);

        },
         function (response) {


             if (response.status == "409") {

                 $(".successmessage").hide();
                 $(".errormessage").show();
                 $scope.responsemessage = "Email address already exists Please try with another";
                 $scope.$apply();
                 hidemessage();

                // log.error("")

             }

             else
             {

                 $(".successmessage").hide();
                 $(".errormessage").show();
                 $scope.responsemessage = response.responseText;
                 $scope.$apply();
                 hidemessage();

          //   log.error(response.responseText)

             }
            
         
          
         });
    };

    var startTimer = function () {
        
        var i = 1000;
        var authData = localStorageService.get('authorizationData');
       
        var timeOutTime = i * parseInt(20000);
        var timer = $interval(function () {
            if (i >= timeOutTime) {
                i = 0;
                bootbox.confirm("Your token has been Expired Now. Press OK to refresh token or Cancel to Logout.", function (result) {
                    if (result) {

                        authService.refreshToken().then(function (response) {
                         //   log.success("Token refresh successfully");
                        },

                        function (err) {
                            $location.path('/login');
                            alert("here");
                        });
                    }

                    else {

                        $location.path('/login');
                        alert("here 1");
                    }

                });

                //alert("Your Token has been Expire please refresh it");
                //i = 0;
                //authService.refreshToken().then(function (response) {
                //    alert("Token Refreshed successfully");
                //},
                //    function (err) {
                //        $location.path('/login');
                //    });
            }
            i = i + 1000;
        }, 1000)


    }



}]);