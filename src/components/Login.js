import React, { useState } from "react";

export default function Login() {
  const [user , setUser] = useState({});

  const baseUrl = process.env.REACT_APP_BASE_URl;

  return (
    <div>
      <h1 className="text-center">Login here</h1>
      {/* onSubmit={loginUser} */}
      <form style={{margin : '30px 0'}} action={`${baseUrl}/login`} method="post">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            name="username"
            onChange={(e) => {
              setUser({ ...user, username: e.target.value });
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            onChange={(e) => {
              setUser({ ...user, password: e.target.value });
            }}
          />
        </div>
        <div className="text-center">
        <button type="submit" className="btn btn-dark">
          Submit
        </button>
        </div>
      </form>
    </div>
  );
}
