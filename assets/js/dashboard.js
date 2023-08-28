
$(document).ready(function () {
    const currentUrl = window.location.href;
    const parts = currentUrl.split("/");

    // to show or hide password
    $("#showPassword").click(function () {
        const passwordInput = $("#user_password");

        if ($(this).is(":checked")) {
            passwordInput.attr("type", "text");
        } else {
            passwordInput.attr("type", "password");
        }
    });


    $(".form-select").on("change", function () {
        var selectedStatus = $(this).val(); // Get the selected value
        var currentUrl = $(this).closest("form").attr("action"); // Get the ID of the closest form

        // get the selected status
        var formData = {
            "status": selectedStatus,
        };


        // to change the status
        $.ajax({
            type: "GET",
            url: currentUrl,
            data: formData,
            dataType: "json",
            

        });

    });


    // add habit form ID
    let addHabitForm = $("#add_habit");
    // add new habit
    addHabitForm.on("submit", function (event) {
        $.ajax({

            type: "post",
            url: `/HabitTracker/${parts[parts.length - 1]}/add-habit`,
            data: addHabitForm.serialize(),
            success: function (data) {
                // remove empty text
                $("#empty").remove();
                

                // reload the page
                location.reload();

                // to change status
                $(".form-select").on("change", function () {
                    var selectedStatus = $(this).val(); // Get the selected value
                    var currentUrl = $(this).closest("form").attr("action"); // Get the ID of the closest form

                    // get the selected status
                    var formData = {
                        "status": selectedStatus,
                    };


                    // to change the status
                    $.ajax({
                        type: "GET",
                        url: currentUrl,
                        data: formData,
                        dataType: "json",


                    });

                });


            }, error: function (error) {
                return console.log(error.responseText);
            }
        });
        return false;
    });





});