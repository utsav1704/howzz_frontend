import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  
  const baseUrl = process.env.REACT_APP_BASE_URl;
  const [user , setUser] = useState({});

  // useEffect(() => {
  //   axios.get(`${baseUrl}/user/email/getInfo`).then(
  //     (response) => {
  //       console.log(response);
  //       setUser(response);
  //     },
  //     (error) => {
  //       console.log("ERROR");
  //     })
  // },[]);
  useEffect(()=>{
    console.log("USER == ",user);
  },[user]);
  
  const getInfo = async () => {
    await axios.get(`${baseUrl}/user/email/getInfo`).then(
      (response) => {
        console.log(response);
        setUser(response);
      },
      (error) => {
        console.log("ERROR");
      })
  }

  return (
    <div>
      <form action={`${baseUrl}/logout`}>
        <button>Logout</button>
      </form>
        <button onClick={getInfo}>Send request</button>
    </div>
  );
}
