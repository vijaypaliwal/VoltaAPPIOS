
'use strict';

var ChangepasswordURL = mainServicebase + "users/"



app.controller('changepasswordcontroller', ['$scope', '$location', 'authService', 'localStorageService', '$http', 'log', function ($scope, $location, authService,localStorageService, $http, log) {
    $scope.message = 'Home';

    var authData = localStorageService.get('authorizationData');


    setInterval(function () {

        $scope.currentselectedlanguage = selectedlanguage
        if (selectedlanguage == "it") {

            $scope.notmatchmsg = "по электронной почте или пароль не является корректным Пожалуйста, повторите попытку"
            $scope.errormsg = "что-то пошло не так";
            $scope.successmsg = "Ваши изменения были сохранены"
        }


        else if (selectedlanguage == "sp") {

            $scope.notmatchmsg = "correo electrónico o contraseña proporcionada es incorrecta Por favor, intente de nuevo"
            $scope.errormsg = "algo salió mal";
            $scope.successmsg = "Se han guardado los cambios"
        }

        else {

            $scope.notmatchmsg = "Email or Password Provided is Incorrect Please try again"
            $scope.errormsg = "some thing went wrong";
            $scope.successmsg = "Your changes have been saved"
        }
    }, 100);



    $scope.AuthToken = authData.token;
    $scope.uid = authData.uid;

    $scope.cp = {
        oldpassword: "",
        newpassword: "",
        confirmpassword: ""
    };
    $scope.tokenvalue = "";

    $scope.currentselectedlanguage = "en"

    $scope.authentication = authService.authentication;

      

    setInterval(function () { $scope.currentselectedlanguage = selectedlanguage }, 500);

    $scope.changepassword = function () {

        if ($scope.cp.newpassword == $scope.cp.confirmpassword && $scope.cp.confirmpassword != null && $scope.cp.confirmpassword != "") {
            $.ajax({
                url: ChangepasswordURL + $scope.uid + "/password",// + $scope.cp.newpassword,
                type: "PUT",
                contentType: "application/json",

                headers: {
                    'Authorization': 'Bearer ' + $scope.AuthToken
                },

                data: JSON.stringify({ "password": $scope.cp.newpassword, "oldPassword": $scope.cp.oldpassword }),
                dataType: "json",
                success: function (response, status) {

                    $(".successmessage").show();
                    $(".errormessage").hide();
                    $scope.responsemessage = $scope.successmsg;
                    $scope.$apply();
                    hidemessage();

                    if ($scope.currentselectedlanguage == "it") {

                    //    log.success("Пароль успешно изменен");

                    }
                    else {

                     //   log.success("Password changed successfully");

                    }


                    $scope.cp.newpassword = "";
                    $scope.cp.oldpassword = "";
                    $scope.cp.confirmpassword = "";
                    $scope.$apply();
                },
                error: function (xhr) {



                    if (xhr.status == 200 && xhr.status < 300) {

                        $(".successmessage").show();
                        $(".errormessage").hide();
                        $scope.responsemessage = $scope.successmsg;
                        $scope.$apply();
                        hidemessage();


                        if ($scope.currentselectedlanguage == "it") {

                          //  log.success("Пароль успешно изменен");

                        }
                        else {

                        //    log.success("Password changed successfully");

                        }
                        $scope.cp.newpassword = "";
                        $scope.cp.oldpassword = "";
                        $scope.cp.confirmpassword = "";
                        $scope.$apply();
                    }

                    else {

                        $(".successmessage").hide();
                        $(".errormessage").show();
                        $scope.responsemessage = $scope.errormsg;
                        $scope.$apply();
                        hidemessage();

                       // log.error("some thing went wrong please try again")
                    }


                }
            })
        }
    
 
        else {

            $(".successmessage").hide();
            $(".errormessage").show();
            $scope.responsemessage = $scope.errormsg;
            $scope.$apply();
            hidemessage();

          //  log.error("The passwords you have entered do not match -please re-enter both.")
            $scope.cp.newpassword = "";
            $scope.cp.confirmpassword = "";
            $scope.$apply();

        }
      
     
    };

 




    

  
 

}]);

