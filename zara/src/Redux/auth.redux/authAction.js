import axios from "axios";
import { BASE_URL1 } from "../../constants/config";
import { USER_LOGIN_FAILURE, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS,LOGOUT } from "./authTypes";
const loginRequestAction = () => {
  return { type: USER_LOGIN_REQUEST };
};

const loginSuccessAction = (payload) => {
  // console.log(payload)
  return { type: USER_LOGIN_SUCCESS, payload };
};

const loginFailureAction = () => {
  return { type: USER_LOGIN_FAILURE };
};


export const login = (userData) => async (dispatch) => {
  dispatch(loginRequestAction())

  try {
    const res = await axios.post(`${BASE_URL1}/user/login`, userData);
    // Новый формат API: { access_token, token_type, user }
    if(res.data.access_token && res.data.user){
      const user = res.data.user;
      dispatch(loginSuccessAction({
        token: res.data.access_token,
        name: user.name,
        email: user.email,
        address: user.address,
        pincode: user.pincode,
        city: user.city,
        phone: user.phone,
        state: user.state
      }));
      return { "status": 1, "msg": "Вход выполнен успешно" };
    } else {
      dispatch(loginFailureAction());
      return { "status": 0, "msg": "Ошибка входа" };
    }
  
  } catch (err) {
    console.log(err);
    dispatch(loginFailureAction());
    const errorMsg = err.response?.data?.detail || "Ошибка подключения к серверу";
    return { "status": 0, "msg": errorMsg };
  }
} 

export const authLogout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
}