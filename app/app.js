
var app = angular.module('AngularAuthApp', ['ngRoute', 'ui.bootstrap', 'LocalStorageModule', 'angular-loading-bar', 'pascalprecht.translate', 'bootstrap-switch']);


// Define all Routes
app.config(function ($routeProvider) {

   

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "app/views/login.html"
    });

    $routeProvider.when("/forgotpassword", {
        controller: "forgotcontroller",
        templateUrl: "app/views/forgotpassword.html"
    });

    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "app/views/signup.html"
    });

  

    $routeProvider.when("/home", {
        controller: "indexController",
        templateUrl: "app/views/home.html"
    });


    $routeProvider.when("/graph", {
        controller: "graphcontroller",
        templateUrl: "app/views/graph.html"
    });

    $routeProvider.when("/alert", {
        controller: "alertcontroller",
        templateUrl: "app/views/alert.html"
    });

    $routeProvider.when("/changepassword", {
        controller: "changepasswordcontroller",
        templateUrl: "app/views/changepassword.html"
    });

   

    // Default Page load 
    $routeProvider.otherwise({ redirectTo: "/login" });

});

// Common URL of All API
var serviceBase = 'http://54.154.64.51:8080/voltaware/';

app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'ngAuthApp'
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);

// factory for all messages 
app.factory('log', function () {
    toastr.options = {
        closeButton: true,
        positionClass: 'toast-top-right',
    };
    return {
        success: function (text) {
            toastr.success(text, "");
        },
        error: function (text) {
            toastr.error(text, "");
        },
        info: function (text) {
            toastr.info(text, "");
        },
        warning: function (text) {
            toastr.warning(text, "");
        },
    };
});





app.factory('$remember', function () {
    return function (name, values) {
        var cookie = name + '=';

        cookie += values + ';';

        var date = new Date();
        date.setDate(date.getDate() + 365);

        cookie += 'expires=' + date.toString() + ';';

        document.cookie = cookie;
    }
});






