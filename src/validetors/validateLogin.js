function validateLogin(state) {
  var emailPattern = new RegExp(
    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
  );
  var passwordPattern = new RegExp(/[a-z1-9A-Z.*+\-?^${}()|[\]\\@#$%^&*(!@]+/);
  console.log(state.email);
  if (!emailPattern.test(state.email)) {
    state.emailError = "Nieprawidłowy adres email";
  } else {
    state.emailError = "";
  }
  if (!passwordPattern.test(state.password)) {
    state.passwordError = "Błędne hasło";
  } else {
    state.passwordError = "";
  }
  if (state.passwordError || state.emailError) {
    return { state: state, validateError: false };
  } else {
    return { state: state, validateError: true };
  }
}

export default validateLogin;
