import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");

  const baseUrl = process.env.REACT_APP_BASE_URl;
  let navigate = useNavigate();
  
  useEffect(() => {
    // console.log(token);
    if (token !== "") {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    }
  }, [token]);

  const loginUser = async (e) => {
    e.preventDefault();
    const response = await axios.post(`${baseUrl}/signin`, user).then(
      (response) => {
        return response;
      },
      (error) => {
        // console.log(error);
        alert(
          "Email or Password is wrong!! Try with correct email and password"
        );
      }
    );
    if (response) {
      const auth = response.data;
      setToken(auth);

      // console.log("Token is ", localStorage.getItem("token"));
    }
  };

  return (
    <div>
      <h1 className="text-center">Login here</h1>

      {/* action={`${baseUrl}/login` method="post" } */}
      <form style={{ margin: "30px 0" }} onSubmit={loginUser}>
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
            Login
          </button>
        </div>
      </form>
      <h4>
        Don't have account yet??{" "}
        <Link className="create_account" to="/signup">
          Create Account
        </Link>{" "}
      </h4>
    </div>
  );
}
