
var app = angular.module('AngularAuthApp', ['ngRoute', 'ui.bootstrap', 'LocalStorageModule', 'angular-loading-bar', 'pascalprecht.translate', 'bootstrap-switch']);


// Define all Routes
app.config(function ($routeProvider) {

    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "app/views/home.html"
    });

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "app/views/login.html"
    });

    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "app/views/signup.html"
    });

    $routeProvider.when("/graph", {
        controller: "graphcontroller",
        templateUrl: "app/views/graph.html"
    });

    $routeProvider.when("/home", {
        controller: "indexController",
        templateUrl: "app/views/home.html"
    });

    $routeProvider.when("/forgotpassword", {
        controller: "forgotcontroller",
        templateUrl: "app/views/forgotpassword.html"
    });

    $routeProvider.when("/changepassword", {
        controller: "changepasswordcontroller",
        templateUrl: "app/views/changepassword.html"
    });

    $routeProvider.when("/browserdetail", {
        controller: "browserdetailcontroller",
        templateUrl: "app/views/browserdetail.html"
    });

    $routeProvider.when("/household", {
        controller: "householdlcontroller",
        templateUrl: "app/views/household.html"
    });


    $routeProvider.when("/alert", {
        controller: "alertcontroller",
        templateUrl: "app/views/alert.html"
    });

    $routeProvider.when("/comparison", {
        controller: "comparisioncontroller",
        templateUrl: "app/views/comparison.html"
    });

    $routeProvider.when("/account", {
        controller: "accountcontroller",
        templateUrl: "app/views/account.html"
    });

    // Default Page load 
    $routeProvider.otherwise({ redirectTo: "/login" });
});
// Common URL of All API

var serviceBase = 'http://restapi.voltaware.com:8080/voltaware/';
var mainServicebase = 'http://restapi.voltaware.com:8080/voltaware/v1.0/'

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






