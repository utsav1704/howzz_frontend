import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav className="navbar bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">Howzz</a>
          <h3 className="btn btn-outline-dark"><Link to="/signup">SignUp</Link></h3>
        </div>
      </nav>
    </div>
  );
}
