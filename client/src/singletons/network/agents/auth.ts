import { Auth, User } from "@shared/types";
import { get, post, request } from "../request";
import { APIResponse, fallback } from "../response";

function auth() {

  async function register(data: Auth.Register.Request): Promise<APIResponse<Auth.Register.Response>> {
    var res = await post<Auth.Register.Response>(Auth.Register.path, data, fallback("Registration failed"));
    return res;
  }

  async function login(data: Auth.Login.Request): Promise<APIResponse<Auth.Login.Response>> {
    var res = await post<Auth.Login.Response>(Auth.Login.path, data, fallback("Login Failed"));
    return await res;
  }

  async function logout(): Promise<APIResponse<User.Logout.Response>> {
    var res = await post<User.Logout.Response>(User.Logout.path, undefined, fallback("Logout Failed"));
    return res;
  }

  async function checkAuth(): Promise<APIResponse<User.ValidateToken.Response>> {
    var res = await get<User.ValidateToken.Response>(User.ValidateToken.path, undefined, fallback("Authorization Failed"));
    return res;
  }

  return {
    checkAuth,
    register,
    login,
    logout,
  };
}

export var authAgent = auth();