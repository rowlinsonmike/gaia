import React from "react";
import Router from "routes";
import Login from "pages/Login";
import useAuthentication from "auth";
export default function App() {
  let user = useAuthentication();
  if (!user) return <Login />;
  return <Router />;
}
