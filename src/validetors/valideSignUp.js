function validateSignUp(state) {
  var emailPattern = new RegExp(
    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
  );
  var usernamePattern = new RegExp(/^[a-zA-Z0-9]+$/);
  var passwordPattern = new RegExp(/[a-z1-9A-Z.*+\-?^${}()|[\]\\@#$%^&*(!@]+/);
  if (
    (state.username[0] !== state.username[0].toUpperCase() &&
      state.username.length < 8) ||
    !usernamePattern.test(state.username)
  ) {
    state.usernameError =
      "Nazwa użytkownika musi zawierać co najmniej 8 liter bądź cyfr i pierwsza litera musi być wielka";
  } else if (state.username.length < 8) {
    state.usernameError = "Nazwa użytkownika musi zawierać co najmniej 8 liter";
  } else if (state.username[0] !== state.username[0].toUpperCase()) {
    state.usernameError = "Nazwa użytkonika musi mieć pierwszą literę wielką";
  } else {
    state.usernameError = "";
  }
  if (!emailPattern.test(state.email)) {
    state.emailError = "Nie jest to prawidłowy adres email";
  } else {
    state.emailError = "";
  }
  if (state.password1.length < 8 || !passwordPattern.test(state.password1)) {
    state.password1Error = "Hasło musi zawierać conajmniej 8 liter bądź cyfr";
  } else {
    state.password1Error = "";
  }
  if (state.password2.length < 8 || !passwordPattern.test(state.password2)) {
    state.password2Error = "Hasło musi zawierać conajmniej 8 liter";
  }
  if (
    state.password1 !== state.password2 &&
    (state.password1Error || state.password2Error)
  ) {
    state.password2Error = "Hasła nie są jednakowe";
  }
  if (!(state.password2.length < 8) && !(state.password1 !== state.password2)) {
    state.password2Error = "";
  }
  if (
    state.password1Error ||
    state.password2Error ||
    state.emailError ||
    state.usernameError
  ) {
    return { state: state, validateError: false };
  } else {
    return { state: state, validateError: true };
  }
}

export default validateSignUp;
