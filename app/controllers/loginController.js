'use strict';
app.controller('loginController', ['$scope', '$location', 'authService', 'ngAuthSettings', '$interval', 'localStorageService', 'log', function ($scope, $location, authService, ngAuthSettings, $interval, localStorageService, log) {

    $scope.loginData = {
        userName: "",
        password: "",
        remember: false,
        useRefreshTokens: false
    };

    $scope.message = "";

    authService.logOut();

    $scope.login = function () {

        authService.login($scope.loginData).then(function (response) {
        
            startTimer();
            $location.path('/graph');

            setTimeout(function () {
                $(".loader").hide();
                $(".logintext").show();
            }, 2000);
        
            
        },
         function (xhr) {

             if (xhr.status == "401" || xhr.status == "400")
             {
                 $scope.loginData.userName = "";
                 $scope.loginData.password = "";

                 $(".successmessage").hide();
                 $(".errormessage").show();
                 $scope.responsemessage = "Email or Password Provided is Incorrect Please try again";
                 $scope.$apply();
                 hidemessage();

              //   log.error("");
             }

             else {
                 $scope.loginData.userName = "";
                 $scope.loginData.password = "";

                 $(".successmessage").hide();
                 $(".errormessage").show();
                 $scope.responsemessage = "some thing went wrong";
                 $scope.$apply();
                 hidemessage();

                // log.error("some thing went wrong");
             }
           

           
         });
    };

    var startTimer = function () {
      
        var i = 1000;
        var authData = localStorageService.get('authorizationData');
        var timeOutTime = i * parseInt(authData.expireIn);

      //  var timeOutTime = i * parseInt(10);
        var timer = $interval(function () {
            if (i >= timeOutTime) {
                i = 0;
                bootbox.confirm("Your session has been expired Now. Press OK to refresh token or Cancel to Logout.", function (result) {
                    if (result) {
                       
                        authService.refreshToken().then(function (response)
                        {
                          //  log.success("Token refresh successfully");
                        },

                        function (err) {
                           $location.path('/login');
                        });
                    }

                     else {
                     
                        $location.path('/login');

                    }

                });
           
          
            }

            i = i + 1000;
           
        }, 1000)


    }

    $scope.authExternalProvider = function (provider) {

        var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';

        var externalProviderUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/ExternalLogin?provider=" + provider
                                                                    + "&response_type=token&client_id=" + ngAuthSettings.clientId
                                                                    + "&redirect_uri=" + redirectUri;
        window.$windowScope = $scope;

        var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
    };

    $scope.authCompletedCB = function (fragment) {

        $scope.$apply(function () {

            if (fragment.haslocalaccount == 'False') {

                authService.logOut();

                authService.externalAuthData = {
                    provider: fragment.provider,
                    userName: fragment.external_user_name,
                    externalAccessToken: fragment.external_access_token
                };

                $location.path('/associate');

            }
            else {
                //Obtain access token and redirect to orders
                var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token };
                authService.obtainAccessToken(externalData).then(function (response) {

                    $location.path('/orders');

                },
             function (err) {
                 $scope.message = err.error_description;
             });
            }

        });
    }

    setTimeout(function () {
        $("#loginusername").val($.cookie('loginusername'));
        $("#password").val($.cookie('password'));
        $scope.loginData.userName = $.cookie('loginusername');
        $scope.loginData.password = $.cookie('password');
     
        $scope.loginData.remember = $.cookie('remember')== "true" ? true : false;
    }, 1000);
   
  

}]);





