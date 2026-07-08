export function getDeviceToken() {
  let token = localStorage.getItem("deviceToken");

  if (!token) {
    token =
      Date.now().toString() +
      "-" +
      Math.random().toString(36).substring(2);

    localStorage.setItem("deviceToken", token);
  }

  return token;
}