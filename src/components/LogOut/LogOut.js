import axios from "axios";
const logout = () => {
  const data = {
    apiToken: localStorage.getItem("api_token"),
  };
  axios
    .post("/logout", data)
    .then((response) => {
      if (response.data.code === 200) {
        return;
      } else {
        window.alert(response.data.message);
      }
    })
    .catch((error) => {
      window.alert(error.response.data.message);
    });
};

export default logout;
