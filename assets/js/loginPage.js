// to show or hide password
$("#showPassword").click(function() {
    const passwordInput = $("#user_password");

    if ($(this).is(":checked")) {
      passwordInput.attr("type", "text");
    } else {
      passwordInput.attr("type", "password");
    }
  });