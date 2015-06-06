var selectedlanguage = "";

'use strict';

app.controller('indexController', ['$scope', '$location', 'authService', 'log', '$translate',  function ($scope, $location, authService, log, $translate)
{
  
  
 
  
    $scope.authentication = authService.authentication;
    $scope.language = 'en';
    $scope.languageArray = ['en', 'it'];
  
    //Log out Function
    $scope.logOut = function ()
    {
        authService.logOut();
        $location.path('/login');
    }

  


    var userLang = navigator.language || navigator.userLanguage;
    
   // alert(userLang);
    
    if (userLang == "ru" || userLang == "ru-ru") {

        $scope.languageText = "Русский";
        $scope.countryicon = "RussianFlag.gif";

        $translate.use("it");

    }

    else if (userLang == "es" ) {

        $scope.languageText = "español";
        $scope.countryicon = "spain.png";
        $translate.use("sp");

    }


    else {
        $scope.languageText = "English";
        $scope.countryicon = "usa.png";
        $translate.use("en");

    }


    $scope.changeLanguage = function (langKey) {

        selectedlanguage = langKey;

        if (langKey == "it") {
            $scope.languageText = "Русский";
            $scope.countryicon = "RussianFlag.gif";
        }
        else if (langKey == "sp") {
            $scope.languageText = "español";
            $scope.countryicon = "spain.png";
        }


        else {
            $scope.languageText = "English";
            $scope.countryicon = "usa.png";
        }

        $translate.use(langKey);
      //  userLangUpdate.updateLanguage();
    };
  

}]);