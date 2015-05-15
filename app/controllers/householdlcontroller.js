'use strict';
app.controller('householdlcontroller', ['$scope', 'log', 'localStorageService', function ($scope, log, localStorageService) {

    $scope.householddetail = "Household Profile & Tariff Setup";


    var authData = localStorageService.get('authorizationData');
    $scope.ElectricityProviderData = [];
    $scope.TariffData = [];
    $scope.currentselectedlanguage = "en"
    setInterval(function () {

        $scope.currentselectedlanguage = selectedlanguage

        if (selectedlanguage == "it") {
            $scope.selectpropertytext = "выбрать Тип жилья";
            $scope.electricityprovidertext = "выбрать Энергопровайдер"
            $scope.providertext = "выбрать ваш поставщик"
        }

        else {
            $scope.selectpropertytext = "Select property type";
            $scope.electricityprovidertext = "Select electricity provider"
            $scope.providertext = "Select your provider"
        }
    }, 100);


    $scope.uid = authData.uid;
    $scope.token = authData.token;

    $scope.iseditmode = false;

    $scope.propertyID = "";

    $scope.household = {
        propertytype: "",
        numberofadults: "",
        numberofchildrens: "",
        numberofbedrooms: "",
        electricityprovider: "",
        tarrif: ""

    };
    $scope.postcode = "";
    $scope.areacode = "";

    $scope.numberofadults = [{ Id: 0, Value: "0" }, { Id: 1, Value: "1" }, { Id: 2, Value: "2" }, { Id: 3, Value: "3" }, { Id: 4, Value: "4" }, { Id: 5, Value: "5" }, { Id: 6, Value: "6" }, { Id: 7, Value: "7" }, { Id: 8, Value: "8" }, { Id: 9, Value: "9" }, { Id: 10, Value: "10" }];
    $scope.numberofchildrens = [{ Id: 0, Value: "0" }, { Id: 1, Value: "1" }, { Id: 2, Value: "2" }, { Id: 3, Value: "3" }, { Id: 4, Value: "4" }, { Id: 5, Value: "5" }, { Id: 6, Value: "6" }, { Id: 7, Value: "7" }, { Id: 8, Value: "8" }, { Id: 9, Value: "9" }, { Id: 10, Value: "10" }];
    $scope.numberofbedrooms = [{ Id: 0, Value: "0" }, { Id: 1, Value: "1" }, { Id: 2, Value: "2" }, { Id: 3, Value: "3" }, { Id: 4, Value: "4" }, { Id: 5, Value: "5" }, { Id: 6, Value: "6" }, { Id: 7, Value: "7" }, { Id: 8, Value: "8" }, { Id: 9, Value: "9" }, { Id: 10, Value: "10" }];

    $scope.getpropertyvalue = function () {

        $.ajax({
            type: "GET",
            dataType: "json",
            url: 'http://54.154.64.51:8080/voltaware/v1.0/user/' + $scope.uid + '/property',
            contentType: "application/json; charset=utf-8",
            headers: {
                'Authorization': 'Bearer ' + $scope.token
            },
            success: function (json) {


                var data = json.length == 0 ? null : json[json.length - 1];


                if (data != null) {

                    $scope.propertyID = data.id;
                    $scope.iseditmode = true;

                    $scope.household.propertytype = data.propertyType.id;
                    $scope.household.numberofadults = data.numberAdults;
                    $scope.household.numberofchildrens = data.numberChildren;
                    $scope.household.numberofbedrooms = data.numberBedrooms;
                    $scope.household.tarrif = data.tariff.name;
                    $scope.household.electricityprovider = data.tariff.electricityProviderXML.name;


                    $scope.electricityproviderlistvalue = $scope.GetElectricityValue($scope.household.electricityprovider);
                    $scope.Tariffvalue = $scope.GetTariffValue($scope.household.tarrif);

                    $('#Propertytypelist option[value="' + $scope.household.propertytype + '"]').prop('selected', true);
                    $('#numberofadult option[value="' + $scope.household.numberofadults + '"]').prop('selected', true);
                    $('#numberofchildren option[value="' + $scope.household.numberofchildrens + '"]').prop('selected', true);
                    $('#numberofbedroom option[value="' + $scope.household.numberofbedrooms + '"]').prop('selected', true);

                    $('#electricityproviderlist option[value="' + $scope.electricityproviderlistvalue + '"]').prop('selected', true);
                    $('#tarriflist option[text="' + $scope.Tariffvalue + '"]').prop('selected', true);




                    $scope.$apply();

                }


            },
            error: function (xhr, status) {

                log.error(xhr)


            }
        });

    }


    $scope.getpostcode = function () {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: 'http://54.154.64.51:8080/voltaware/v1.0/user/' + $scope.uid + '/property',
            contentType: "application/json; charset=utf-8",
            headers: {
                'Authorization': 'Bearer ' + $scope.token
            },
            success: function (json) {

                var data = json.length == 0 ? null : json[json.length - 1];


                if (data.address != null) {


                    $scope.postcode = data.address.postcode;

                    $scope.$apply();

                    $scope.getareacode();
                }


            },
            error: function (xhr, status) {

                log.error(xhr)
            }
        });
    }

    $scope.getareacode = function () {

        $.ajax({
            type: "GET",
            dataType: "json",
            url: 'http://54.154.64.51:8080/voltaware/v1.0/postcode/' + $scope.postcode,   
            contentType: "application/json; charset=utf-8",
            success: function (data) {


                $scope.areacode = data.areaCode;
                $scope.$apply();



                $scope.getelectricityprovider();


            },
            error: function (xhr, status) {


            }
        });
    }


    $scope.GetElectricityValue = function (text) {
        for (var i = 0; i < $scope.ElectricityProviderData.length; i++) {
            if ($scope.ElectricityProviderData[i].name === text) {
                console.log($scope.ElectricityProviderData[i].id);

                return $scope.ElectricityProviderData[i].id;

            }

        }
    }

    $scope.GetTariffValue = function (text) {
        for (var i = 0; i < $scope.TariffData.length; i++) {
            if ($scope.TariffData[i].name === text) {
                console.log($scope.TariffData[i].id);
                return $scope.TariffData[i].id;

            }

        }
    }
    $scope.getpropertytype = function () {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: 'http://54.154.64.51:8080/voltaware/v1.0/property_type',
            contentType: "application/json; charset=utf-8",
            success: function (json) {


                $('#Propertytypelist').empty();
                var i = 0;
                $('#Propertytypelist').append($('<option>').text($scope.selectpropertytext).attr('value', ""));
                for (i = 0; i < json.length; i++) {
                    $('#Propertytypelist').append($('<option>').text(json[i].name).attr('value', json[i].id));

                }




            },
            error: function (xhr, status) {

                log.error(xhr)


            }
        });
    }


    $scope.getelectricityprovider = function () {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: 'http://54.154.64.51:8080/voltaware/v1.0/electricityprovider',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                //$scope.ElectricityProviderData = data;

                $('#electricityproviderlist').empty();
                var i = 0;
                $('#electricityproviderlist').append($('<option>').text($scope.electricityprovidertext).attr('value', ""));
                for (i = 0; i < data.length; i++) {
                    $('#electricityproviderlist').append($('<option>').text(data[i].name).attr('value', data[i].id));
                    $scope.ElectricityProviderData.push(data[i]);
                }


            },
            error: function (xhr, status) {



            }
        });
    }







    $('#electricityproviderlist').on('change', function () {
        var electricityid = $('#electricityproviderlist option:selected').val();



        $.ajax({
            type: "GET",
            dataType: "json",

            url: 'http://54.154.64.51:8080/voltaware/v1.0/electricityprovider/' + electricityid + '/postcode/' + 'e14hj',



            //  url: 'http://54.154.64.51:8080/voltaware/v1.0/electricityprovider/' + electricityid,
            contentType: "application/json; charset=utf-8",
            success: function (tarrif) {

                $('#tarriflist').empty();
                var i = 0;
                $('#tarriflist').append($('<option>').text($scope.providertext).attr('value', ""));
                for (i = 0; i < tarrif.listTariff.length; i++) {
                    $('#tarriflist').append($('<option>').text(tarrif.listTariff[i].name).attr('value', tarrif.listTariff[i].id));
                }
            },
            error: function (xhr, status) {





            }
        });

    })



    $scope.getselectedtariff = function () {


        var electricityid = $scope.GetElectricityValue($scope.household.electricityprovider);

        $.ajax({
            type: "GET",
            dataType: "json",

            url: 'http://54.154.64.51:8080/voltaware/v1.0/electricityprovider/' + electricityid + '/postcode/' + 'e14hj',
            contentType: "application/json; charset=utf-8",
            success: function (tarrif) {
                $('#tarriflist').empty();
                var i = 0;
                for (i = 0; i < tarrif.listTariff.length; i++) {
                    $('#tarriflist').append($('<option>').text(tarrif.listTariff[i].name).attr('value', tarrif.listTariff[i].id));
                    $scope.TariffData.push(data[i]);
                }

                $('#tarriflist option[value="' + $scope.household.tarrif + '"]').prop('selected', true);
            },
            error: function (xhr, status) {





            }
        });
    }









    $scope.saveproperty = function () {




        var URL = "";
        var MethodTYPE = ""

        if ($scope.iseditmode == true) {

            URL = 'http://54.154.64.51:8080/voltaware/v1.0/user/' + $scope.uid + '/property/' + $scope.propertyID;
            MethodTYPE = "PUT";

        }

        if ($scope.iseditmode == false) {

            URL = 'http://54.154.64.51:8080/voltaware/v1.0/user/' + $scope.uid + '/property';
            MethodTYPE = "POST";

        }



        if ($("#Propertytypelist").val() != "") {
            $.ajax({
                url: URL,
                type: MethodTYPE,
                accept: "application/json",
                data: JSON.stringify({ "numberBedrooms": $scope.household.numberofbedrooms, "numberAdults": $scope.household.numberofadults, "numberChildren": $scope.household.numberofchildrens, "propertyType": { "id": $("#Propertytypelist").val(), "name": $("#Propertytypelist option:selected").text() } }),
                headers: {
                    'Authorization': 'Bearer ' + $scope.token
                },
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response, status) {

                    if ($scope.currentselectedlanguage == "it") {

                        log.info("бытовые Профиль успешно обновлены");

                    }
                    else {

                        log.success("House hold profile updated successfully. ");

                    }


                 
                    if ($("#electricityproviderlist").val() != "" && $("#tarriflist").val() != "") {
                        $.ajax({
                            url: 'http://54.154.64.51:8080/voltaware/v1.0/user/' + $scope.uid + '/property/' + response.id + '/tariff/' + $("#tarriflist").val(),
                            type: "PUT",
                            accept: "application/json",

                            headers: {
                                'Authorization': 'Bearer ' + $scope.token
                            },
                            dataType: "json",
                            contentType: "application/json; charset=utf-8",
                            success: function (response, status) {


                            },
                            error: function (err) {


                                log.error("Error::" + err.statusText);


                            }
                        });
                    }

                    if ($("#electricityproviderlist").val() == "" || $("#tarriflist").val() == "") {
                        log.info("Electricity provider is not updating");
                    }

                    //  $('#houseHold').find("input[type=text], select").val("");

                },
                error: function (err) {



                    log.error("Error::" + err);


                }
            })
        }



    }


    setTimeout(function () {

        $('#Propertytypelist option[value="' + $scope.household.propertytype + '"]').prop('selected', true);
        $scope.electricityproviderlistvalue = $scope.GetElectricityValue($scope.household.electricityprovider);
        $('#electricityproviderlist option[value="' + $scope.electricityproviderlistvalue + '"]').prop('selected', true);
        $scope.Tariffvalue = $scope.GetTariffValue($scope.household.tarrif);
        $('#tarriflist option[value="' + $scope.Tariffvalue + '"]').prop('selected', true);
        $scope.getselectedtariff();
        $scope.$apply();

    }, 3000);

    $(".languagechanger").click(function () {
        $scope.getpropertyvalue()
        $scope.getpropertytype()
        $scope.getelectricityprovider()

        setTimeout(function () {
            $('#Propertytypelist option[value="' + $scope.household.propertytype + '"]').prop('selected', true);
            $scope.electricityproviderlistvalue = $scope.GetElectricityValue($scope.household.electricityprovider);
            $('#electricityproviderlist option[value="' + $scope.electricityproviderlistvalue + '"]').prop('selected', true);
            $scope.Tariffvalue = $scope.GetTariffValue($scope.household.tarrif);
            $('#tarriflist option[value="' + $scope.Tariffvalue + '"]').prop('selected', true);
            $scope.$apply();

        }, 2000);

    });

    $scope.getpostcode();
    $scope.getpropertyvalue();
    $scope.getpropertytype();



}]);

