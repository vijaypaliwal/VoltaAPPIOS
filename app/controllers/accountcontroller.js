'use strict';
app.controller('accountcontroller', ['$scope', 'log', 'localStorageService', function ($scope, log, localStorageService) {

    var authData = localStorageService.get('authorizationData');
    var userLang = navigator.language || navigator.userLanguage;


    $scope.email = authData.userName;
    $scope.uid = authData.uid;
    $scope.AuthToken = authData.token;

  
    $scope.editmode = true;


    $scope.account = {
        accountnumber: "",
        title: "",
        firstname: "",
        lastname: "",
        housename: "",
        address1: "",
        address2: "",
        town: "",
        region: "",
        post: "",
        country: "",
        email: $scope.email,
        numberofadults: "",
        numberofchildren: "",
        numberofrooms: "",
        propertytypeid: 0,
        propertytypename: "",

    };
    $scope.currentselectedlanguage = "en"

    setInterval(function () { $scope.currentselectedlanguage = selectedlanguage }, 500);


    $.ajax({
        url: mainServicebase + 'me',
        type: "GET",
        accept: "application/json",

        headers: {
            'Authorization': 'Bearer ' + $scope.AuthToken
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response, status) {

            console.log(response);
            $scope.account.firstname = response.firstName;
            $scope.account.lastname = response.lastName;
            $scope.account.title = response.title;


            //  document.getElementById("titlelist").value = $scope.account.title;

            $('#titlelist option[value="' + $scope.account.title + '"]').prop('selected', true);
            $scope.$apply();

        },
        error: function (err) {


         //   log.error("Error::" + err.statusText);




        }
    })



    $.ajax({
        type: "GET",
        dataType: "json",
        url: mainServicebase+'user/' + $scope.uid + '/property',
        contentType: "application/json; charset=utf-8",
        headers: {
            'Authorization': 'Bearer ' + $scope.AuthToken
        },
        success: function (json) {


            debugger;


            console.log("account data with JSON");
            console.log(json);

            var data = json.length == 0 ? null : json[json.length - 1];



            if (data != null) {
                $scope.account.numberofadults = data.numberAdults;
                $scope.account.numberofchildren = data.numberChildren;
                $scope.account.numberofrooms = data.numberBedrooms;
                $scope.account.propertytypeid = data.id;
                $scope.$apply();
            }


            if (data.propertyType != null) {

                $scope.account.propertytypename = data.propertyType.name;
                $scope.$apply();

            }

            if (data.address != null) {

                $scope.account.housename = data.address.houseNumber;
                $scope.account.address1 = data.address.addressLine1;
                $scope.account.address2 = data.address.addressLine2;
                $scope.account.town = data.address.city;
                $scope.account.region = data.address.region;
                $scope.account.country = data.address.country;
                $scope.account.post = data.address.postcode;


                $scope.account.accountnumber = data.sensor.serialNumber;
                $("#accountbox").attr("disabled", "disabled");


                $scope.$apply();
            }


            if (data.address == null) {

                $scope.editmode = false;

            }


            if (data.propertyType == null) {
                $scope.$apply();
            }




        },
        error: function (xhr, status) {





        //    log.error(xhr)


        }
    });



    $scope.CheckValidPostAndCity = function () {
        if ($scope.account.post != undefined && $.trim($scope.account.post) != "" && $scope.account.town != undefined && $.trim($scope.account.town) != "") {
            return true;
        }
        return false;
    }

    $scope.updateprofile = function () {

        $.ajax({
            url: mainServicebase+'users/' + $scope.uid,
            type: "PUT",
            accept: "application/json",
            data: JSON.stringify({ "firstName": $scope.account.firstname, "lastName": $scope.account.lastname, "emailAddress": $scope.account.email, "title": $("#titlelist option:selected").val() }),
            headers: {
                'Authorization': 'Bearer ' + $scope.AuthToken
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status) {

                if ($scope.currentselectedlanguage == "it") {

                

                }
                else {

            

                }



            },
            error: function (xhr) {


                if (xhr.status == 200 && xhr.status < 300) {

                    $(".successmessage").show();
                    $(".errormessage").hide();
                    $scope.responsemessage = "Your changes have been saved";
                    $scope.$apply();
                    hidemessage();

                    if ($scope.currentselectedlanguage == "it") {

                     //   log.info("Демографические обновлена ​​информация успешно");

                    }
                    else {

                    //    log.info("Demographic details Updated successfully");

                    }
                }

                else {
                  //  log.error(xhr.responseText)
                }


            }
        })




        if ($scope.editmode == false) {



            $.ajax({
                url: mainServicebase + 'user/' + $scope.uid + '/property',
                type: "POST",
                accept: "application/json",
                //data: JSON.stringify({ "numberBedrooms": $scope.account.numberofrooms, "numberAdults": $scope.account.numberofadults, "numberChildren": $scope.account.numberofchildren, "propertyType": { "id": $scope.account.propertytypeid, "name": $scope.account.propertytypename }, "address": { "houseNumber": $scope.account.housename, "addressLine1": $scope.account.address1, "addressLine2": $scope.account.address2, "postcode": $scope.account.post, "region": $scope.account.region, "city": $scope.account.town, "country": $scope.account.country }, "sensor": { "serialNumber": "ABBB12509" } }),
                data: JSON.stringify({ "numberBedrooms": $scope.account.numberofrooms, "numberAdults": $scope.account.numberofadults, "numberChildren": $scope.account.numberofchildren, "address": { "houseNumber": $scope.account.housename, "addressLine1": $scope.account.address1, "addressLine2": $scope.account.address2, "postcode": $scope.account.post, "region": $scope.account.region, "city": $scope.account.town, "country": $scope.account.country }, "sensor": { "serialNumber": $scope.account.accountnumber } }),
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

                     

                    }
                    else {

               
                    }


                },
                error: function (err) {


                    debugger;

                    $(".successmessage").hide();
                    $(".errormessage").show();
                    $scope.responsemessage = err.statusText;
                    $scope.$apply();
                    hidemessage();


                  //  log.error("Error::" + err.statusText);


                }
            })




        }


        if ($scope.editmode == true) {



            $.ajax({
                url: mainServicebase+'user/' + $scope.uid + '/property/' + $scope.account.propertytypeid,
                type: "PUT",
                accept: "application/json",
                //data: JSON.stringify({ "numberBedrooms": $scope.account.numberofrooms, "numberAdults": $scope.account.numberofadults, "numberChildren": $scope.account.numberofchildren, "address": { "houseNumber": $scope.account.housename, "addressLine1": $scope.account.address1, "addressLine2": $scope.account.address2, "postcode": $scope.account.post, "region": $scope.account.region, "city": $scope.account.town, "country": $scope.account.country }, "sensor": { "serialNumber": "ABBB12509" } }),
                data: JSON.stringify({ "numberBedrooms": $scope.account.numberofrooms, "numberAdults": $scope.account.numberofadults, "numberChildren": $scope.account.numberofchildren, "address": { "houseNumber": $scope.account.housename, "addressLine1": $scope.account.address1, "addressLine2": $scope.account.address2, "postcode": $scope.account.post, "region": $scope.account.region, "city": $scope.account.town, "country": $scope.account.country }, "sensor": { "serialNumber": $scope.account.accountnumber } }),
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



                    if ($scope.currentselectedlanguage == "it") {

                     //   log.info("Банковские реквизиты успешно обновлены");

                    }
                    else {

                
                    }


                },
                error: function (err) {



                    $(".successmessage").hide();
                    $(".errormessage").show();
                    $scope.responsemessage = err.statusText;
                    $scope.$apply();
                    hidemessage();


                }
            })

        }

    }

}]);

