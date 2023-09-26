import React, { useState } from "react";
import Navbar from "./Navbar";
import "../css/landing.css";
import Axios from "axios";
// import image from "../img/undraw_lost_bqr2.svg";
import image from "../img/lost-2.svg";
import developer from "../img/developer_outline I.svg";
import login from "../img/login-1.svg";
import list_item from "../img/list-item.svg";
import notification from "../img/notification.svg";
import github from "../img/github.svg";
import linkedin from "../img/linkedin.svg";
import instagram from "../img/instagram.svg";
import mail from "../img/mail.svg";

// import image from "../img/earth.svg";
import { Container, Row, Button, Form } from "react-bootstrap";
export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const postitem = () => {
    if (localStorage.getItem("user") !== null) {
      console.log("User already logged in !");
    } else {
      console.log("Not logged in");
    }
  };

  const sendMessage = () => {
    const data = {
      name,
      email,
      message,
    };
    Axios({
      method: "POST",
      url: "/sendmessage",
      data: data,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setName("");
    setEmail("");
    setMessage("");
  };
  return (
    <>
      <Navbar />
      <div className="main">
        <div className="intro">
          <div className="part-1">
            <div className="title">
              <h1>Lost and Found</h1>
              <p>Lost it. List it. Find it.</p>
            </div>
          </div>
          <div className="part-2">
            <div className="image">
              <img
                src={image}
                style={{ width: "600px", height: "600px" }}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}
