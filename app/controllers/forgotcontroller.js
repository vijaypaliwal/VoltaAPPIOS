
'use strict';

var passwordURL = mainServicebase + "password/tokens"

app.controller('forgotcontroller', ['$scope', '$http', 'log', '$location', function ($scope, $http, log, $location) {
    $scope.message = 'Home';
    $scope.emailAddress = "";

    $scope.retrievepassword = function ()
    {
        var email = $scope.emailAddress;
         
    
        $.ajax({
            url: passwordURL,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ "emailAddress": email }),
            success: function (response, status) {
             
              //  log.info("To get back to your account, follow the instruction we've sent to " + email + " email address");

            },
            error: function (err) {

               // log.error("Email address unknown Please try again");


            }
        });

      

     
    };
 

}]);

