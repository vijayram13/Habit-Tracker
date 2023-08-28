// to show or hide password
$("#showPassword").click(function() {
    const passwordInput = $("#user_password");
    const confirmPassword = $("#conf_password");

    if ($(this).is(":checked")) {
      passwordInput.attr("type", "text");
      confirmPassword.attr("type", "text");
    } else {
      passwordInput.attr("type", "password");
      confirmPassword.attr("type", "password");
    }
  });