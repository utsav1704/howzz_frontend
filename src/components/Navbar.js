import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav className="navbar bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand chat_apk_name" to="/">Howzz</Link>
          <h3 style={{paddingTop : '5px'}}><Link to="/signup" className="signup">Signup</Link></h3>
        </div>
      </nav>
    </div>
  );
}
