import {
  LOGOUT,
  USER_LOGIN_FAILURE,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
} from "./authTypes";

// Используем localStorage для сохранения токена после закрытия браузера
const initalState = {
  isAuth: localStorage.getItem("isAuth") === "true" || false,
  token: localStorage.getItem("token") || "",
  name: localStorage.getItem("name") || "",
  email: localStorage.getItem("email") || "",
  address: localStorage.getItem("address") || "",
  phone: localStorage.getItem("phone") || "",
  city: localStorage.getItem("city") || "",
  pincode: localStorage.getItem("pincode") || "",
  state: localStorage.getItem("state") || "",
  isLoading: false,
  isError: false,
};

export const reducer = (state = initalState, { type, payload }) => {
  switch (type) {
    case USER_LOGIN_REQUEST:
      return { ...state, isLoading: true };
    case USER_LOGIN_SUCCESS:
      // Сохраняем токен и данные пользователя в localStorage
      localStorage.setItem("token", payload.token || "");
      localStorage.setItem("isAuth", "true");
      localStorage.setItem("email", payload.email || "");
      localStorage.setItem("name", payload.name || "");
      localStorage.setItem("address", payload.address || "");
      localStorage.setItem("phone", payload.phone || "");
      localStorage.setItem("city", payload.city || "");
      localStorage.setItem("pincode", payload.pincode || "");
      localStorage.setItem("state", payload.state || "");
      return { 
        ...state, 
        isLoading: false, 
        isAuth: true, 
        token: payload.token || "",
        name: payload.name || "",
        email: payload.email || "",
        address: payload.address || "",
        phone: payload.phone || "",
        city: payload.city || "",
        pincode: payload.pincode || "",
        state: payload.state || ""
      };
    case USER_LOGIN_FAILURE:
      return { ...state, isLoading: false, isError: true, isAuth: false };
    case LOGOUT: {
      // Очищаем localStorage при выходе
      localStorage.removeItem("token");
      localStorage.removeItem("isAuth");
      localStorage.removeItem("email");
      localStorage.removeItem("name");
      localStorage.removeItem("address");
      localStorage.removeItem("phone");
      localStorage.removeItem("city");
      localStorage.removeItem("pincode");
      localStorage.removeItem("state");
      return {
        isAuth: false,
        token: "",
        name:"",
        email:"",
        address: "",
        phone: "",
        city: "",
        pincode: "",
        state: "",
        isLoading: false,
        isError: false,
      };
    }
    default:
      return state;
  }
};