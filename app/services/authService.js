'use strict';
app.factory('authService', ['$http', '$q', 'localStorageService', 'ngAuthSettings', 'log', '$remember', function ($http, $q, localStorageService, ngAuthSettings, log, $remember) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: "",
        userId: "",
        sensorId: "",
        accesstoken: "",
        tokenExpireTime: 0,
        name: "",
        remember: false,
        useRefreshTokens: true
    };

    var _externalAuthData = {
        provider: "",
        userName: "",
        externalAccessToken: ""
    };

    var myusername = "";
    var mypassword = "";

    // registration function
    var _saveRegistration = function (registration1) {

       return $.ajax({
            url: serviceBase + 'v1.0/users',
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(registration1),
            headers: {
                'Authorization': 'Basic ' + 'MzUzYjMwMmM0NDU3NGY1NjUwNDU2ODdlNTM0ZTdkNmE6Mjg2OTI0Njk3ZTYxNWE2NzJhNjQ2YTQ5MzU0NTY0NmM='
            },
            dataType: "json",
            success: function (response, status) {


                $(".loader").show();
                $(".submittext").hide();
             

                _authentication.isAuth = true;
                _authentication.userName = registration1.user.emailAddress;
                _authentication.userId = response.apiUser.id;
                _authentication.accesstoken = response.oauth2AccessToken.access_token;
                _authentication.sensorId = "";
                _authentication.name = response.apiUser.firstName;

          
             

                var sendtocreatesensor = { "serialNumber": "ABC123" + _authentication.userId }
                $.ajax({
                    url: serviceBase + 'v1.0/user/' + _authentication.userId + '/sensor',
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(sendtocreatesensor),
                    headers: {
                        'Authorization': 'Bearer ' + _authentication.accesstoken
                    },
                    dataType: "json",
                    success: function (response1, status)

                    {
                        
                        _authentication.sensorId = response1.id;

                        localStorageService.set('authorizationData', { token: response.oauth2AccessToken.access_token, sid: _authentication.sensorId, uid: _authentication.userId, userName: response.apiUser.emailAddress, name:response.apiUser.firstName, refreshToken: response.refresh_token, useRefreshTokens: true, expireIn: 100000 });


                    },
                    error: function (err) {

                        alert(err.statusText);
                        alert(err.responseText);

                    }
                })
              


            
                

            },
            error: function (err) {
                
                return err;
             
            }
        })
      
        //return $http.post(serviceBase +"v1.0/users/" + { headers: { 'Content-Type': 'application/json', 'Authorization': 'Basic ' + 'MzUzYjMwMmM0NDU3NGY1NjUwNDU2ODdlNTM0ZTdkNmE6Mjg2OTI0Njk3ZTYxNWE2NzJhNjQ2YTQ5MzU0NTY0NmM=' } }, registration1).then(function (response) {
        //    return response;
        //});

    };

    // Login function
    var _login = function (loginData) {

        var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;
        var CurrentPassword = "";
        if (loginData.useRefreshTokens) {
            data = data + "&client_id=" + ngAuthSettings.clientId;
        }

        var deferred = $q.defer();

        $.ajax({
            url: serviceBase + 'oauth/token',
            type: "POST",
            accept: "application/json",
            data: data,
            headers: {
                'Authorization': 'Basic ' + 'MzUzYjMwMmM0NDU3NGY1NjUwNDU2ODdlNTM0ZTdkNmE6Mjg2OTI0Njk3ZTYxNWE2NzJhNjQ2YTQ5MzU0NTY0NmM='
            },
            dataType: "json",
            success: function (response, status)
            {


                   $(".loader").show();
                   $(".logintext").hide();
                
                 
                    _authentication.isAuth = true;
                    _authentication.userName = loginData.userName;
                    _authentication.useRefreshTokens = loginData.useRefreshTokens;
                    _authentication.userId = "";
                    _authentication.sensorId = "";
                    _authentication.accesstoken = response.access_token;
                  
                    _authentication.remember = false;

                  


                // Fetching user Information
                    $.when($.ajax({
                        url: serviceBase + 'v1.0/me',
                        type: "GET",
                        contentType: "application/json",
                        headers: {
                            'Authorization': 'Bearer ' + _authentication.accesstoken
                        },

                        dataType: "json",
                        success: function (response2, status) {

                            myusername = response2.emailAddress;
                            mypassword = loginData.password;
                            if (loginData.remember == true) {
                                $.cookie('loginusername', myusername, { expires: 14 });
                                $.cookie('password', mypassword, { expires: 14 });
                                $.cookie('remember', true, { expires: 14 });
                               _authentication.remember = true;
                            }

                        

                            _authentication.userId = response2.id;
                            _authentication.name = response2.firstName;
                          
                         

                        },
                        error: function (err) {

                         
                      


                            return err;
                        }
                    })).done(function (x) {
                     
                        $.when(
                            //Fetching Sensor Information
                              $.ajax({
                                  url: serviceBase + 'v1.0/user/' + _authentication.userId + '/sensor',
                                  type: "GET",
                                  contentType: "application/json",
                                  headers: {
                                      'Authorization': 'Bearer ' + _authentication.accesstoken
                                  },

                                  dataType: "json",
                                  success: function (response3, status) {

                                 

                                      _authentication.sensorId = response3[0].id;
                                      

                                      //alert("Sensor Get success");

                                 




                                  },
                                  error: function (err) {

                                 



                                      return err;
                                  }
                              })

                            ).done(function (x) {

                                

                                setTimeout(function () { localStorageService.set('authorizationData', { token: response.access_token, uid: _authentication.userId, sid: _authentication.sensorId, userName: loginData.userName, remember: _authentication.remember, refreshToken: response.refresh_token, useRefreshTokens: true, expireIn: response.expires_in, name: _authentication.name }); }, 1000);

                             
                         
                            });

                        setTimeout(function () { deferred.resolve(response); }, 2000);

                       
                    });
                

               
               
            },
            error: function (err) {
                 
                _logOut();
                deferred.reject(err);
            }
        })

     

            return deferred.promise;
      

      

          

    };

    // LogOut function
    var _logOut = function () {

     

        if (_authentication.remember == false)
        {
            _authentication.userName = myusername;

            localStorageService.remove('authorizationData');

            _authentication.isAuth = false;
            _authentication.remember = false;

            _authentication.useRefreshTokens = false;
            $.cookie('loginusername', '', { expires: 14 });
            $.cookie('password', '', { expires: 14 });
         
            $.cookie('remember', 'false', { expires: 14 });
        }

        else {

            _authentication.userName = myusername;
            _authentication.name = mypassword;
            

            localStorageService.remove('authorizationData');

            _authentication.isAuth = false;

            _authentication.useRefreshTokens = false;

         

            $.cookie('loginusername', _authentication.userName, { expires: 14 });

            $.cookie('password', _authentication.name, { expires: 14 });
           

        }

    };

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationData');
        
    
        if (authData) {
            _authentication.isAuth = true;
            _authentication.remember = authData.remember;

            
            _authentication.userName = authData.userName;
            _authentication.name = authData.name;
            _authentication.useRefreshTokens = authData.useRefreshTokens;
       
        }

    };

    var _refreshToken = function () {
        var deferred = $q.defer();
      
        var authData = localStorageService.get('authorizationData');
       
        if (authData) {
          
            //if (authData.useRefreshTokens) {
                
               // var data = "grant_type=refresh_token&refresh_token=REFRESH_TOKEN";
            var data = "grant_type=password&username=test@test.com&password=password";// + loginData.password;
                localStorageService.remove('authorizationData');
              return  $.ajax({
                    url: serviceBase + 'oauth/token',
                    type: "POST",
                    accept: "application/json",
                    data: data,
                    headers: {
                        'Authorization': 'Basic ' + 'MzUzYjMwMmM0NDU3NGY1NjUwNDU2ODdlNTM0ZTdkNmE6Mjg2OTI0Njk3ZTYxNWE2NzJhNjQ2YTQ5MzU0NTY0NmM='
                    },
                    dataType: "json",
                    success: function (response, status) {
                        
                        localStorageService.set('authorizationData', { token: response.access_token, userName: authData.userName, refreshToken: response.refresh_token, useRefreshTokens: true, expireIn: response.expires_in });

                        deferred.resolve(response);

                    },
                    error: function (err) {
                      
                        _logOut();
                        deferred.reject(err);
                    }
                })
                 
            }
        //}

        return deferred.promise;
    };

    var _obtainAccessToken = function (externalData) {

        var deferred = $q.defer();

        $http.get(serviceBase + 'api/account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function (response) {

            localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

            _authentication.isAuth = true;
            _authentication.userName = response.userName;
            _authentication.useRefreshTokens = false;

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _registerExternal = function (registerExternalData) {

        var deferred = $q.defer();

        $http.post(serviceBase + 'api/account/registerexternal', registerExternalData).success(function (response) {

            localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

            _authentication.isAuth = true;
            _authentication.userName = response.userName;
            _authentication.useRefreshTokens = false;

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };



   
    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
  
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.refreshToken = _refreshToken;

    authServiceFactory.obtainAccessToken = _obtainAccessToken;
    authServiceFactory.externalAuthData = _externalAuthData;
    authServiceFactory.registerExternal = _registerExternal;

    return authServiceFactory;
}]);
