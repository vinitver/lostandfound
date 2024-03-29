import React, { useEffect } from "react";
import { LOGGED_IN, setConstraint } from "../constraints";
import "../css/Navbar.css";
import axios from "axios";
import Lost_item from "./Lost_item";
import { ToastProvider } from 'react-toast-notifications';

function Navbar() {
  const token = window.localStorage.getItem("token");

  useEffect(()=>{
    axios({
      url:'checktoken',
      method:"POST",
      headers:{
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
    .then((res)=>{
      console.log(res)
    })
    .catch((err)=>{
      console.log("400 : ",err)
    })
  },[])
  const signout = () => {
    // constraint.LOGGED_IN = false;
    setConstraint(false);

    console.log("Signed out !");
    axios({
      url: "/signout",
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then(localStorage.clear())
      .catch((error) => {
        console.log(error);
        console.log("Error occured");
      });
  };
  return (
    <>
      <div className="navbar">
        <div className="logo">
          <a style={{ textDecoration: "none", color: "white" }} href="/">
            <h2>Lost and Found</h2>
          </a>
        </div>

        <div
          style={token ? { display: "none" } : {}}
          id="login"
          className="signin"
        >
          <ul>
            <a
              id="a"
              style={{ textDecoration: "none", color: "white" }}
              href="/sign-up"
            >
              Sign-up
            </a>
          </ul>
          <ul>
            <a
              id="a"
              style={{ textDecoration: "none", color: "white" }}
              href="/log-in"
            >
              Log-in
            </a>
          </ul>
        </div>
        <div style={token ? {} : { display: "none" }} className="postsignin">
        <ToastProvider autoDismiss={true} placement={"bottom-right"}><Lost_item /></ToastProvider>
          {/* <Found_item /> */}
          <ul>
            {/* <a style={{ textDecoration: "none", color: "white" }} href="/feed">
              Feed
            </a> */}
            
            <a
              style={{ textDecoration: "none", color: "white" }}
              href="/mylistings"
            >
              My Listings
            </a>
            <a
              style={{ textDecoration: "none", color: "white" }}
              onClick={signout}
              href="/log-in"
            >
              Sign-out
            </a>
            
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
