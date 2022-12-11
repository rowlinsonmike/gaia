// import create from "zustand";
import { useState, useEffect } from "react";
import { createAuthProvider } from "react-token-auth";
import toast from "react-hot-toast";

export function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export const { useAuth, authFetch, login, logout } = createAuthProvider({
  getAccessToken: (session) => session.access_token,
  storage: localStorage,
});

const useAuthentication = () => {
  const [user, setUser] = useState(null);
  const [logged, session] = useAuth();
  useEffect(() => {
    if (logged && localStorage.getItem("REACT_TOKEN_AUTH_KEY")) {
      let { access_token, ...rest } = JSON.parse(
        localStorage.REACT_TOKEN_AUTH_KEY
      );
      setUser({ ...parseJwt(access_token), ...rest });
    } else {
      setUser(null);
    }
  }, [session]);
  return user;
};

export default useAuthentication;

export const fetcher = (...rest) => {
  return authFetch(...rest)
    .then(async (res) => {
      if (res.status === 401) {
        logout();
        return null;
      } else if (res.status === 403) {
        toast.error("Unauthorized Access!");
        logout();
      } else if ([500, 502].includes(res.status)) {
        toast.error("Hmmm, I feel a disturbance in the force...");
        logout();
      } else {
        const data = await res.json();
        return [res.status, data];
      }
    })
    .then(([status, data]) => {
      console.log(data);
      return data;
    })
    .catch((e) => {
      // logout();
    });
};
