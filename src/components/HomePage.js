import React from 'react'
import Navbar from "./Navbar";
import chat from "./chat.svg";
import Login from "./Login";

export default function HomePage() {
  return (
    <div>
        <Navbar />
          <div className="homePage">
            <div className="imgDiv">
              <img src={chat} className="chatImg" alt="" />
              <h1>Chat with your friends</h1>
            </div>
            <hr className='line'/>
            <div className="loginDiv">
              <Login />
            </div>
          </div>
    </div>
  )
}
