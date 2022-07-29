import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate , Link } from "react-router-dom";

export default function SignUp() {
  const [image, setImage] = useState(null);
  const [user, setUser] = useState({ roles: ["ROLE_USER"] , imageName : "d9hdbsylrazjdhmmoih1.jpg"});
  let navigate = useNavigate();
  let imgName;

  const cloudinaryUrl = process.env.REACT_APP_CLOUDINARY_IMAGE_UPLOAD_URL;
  
  useEffect(() => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    // console.log("User == ",user);
    // console.log("Image == ",image);
    const sendDataToServer = async () => {
      await axios.post(`${baseUrl}/user`, user).then(
        (response) => {
          // console.log(response);
          // console.log(image);
          // console.log("After getting response == ",user);
          alert('Successfully registered.. Login to chat with your friends.');
          setUser({});
          navigate('/',{replace:true})
        },
        (error) => {
          alert("Something is wrong!! Registration failed.");
          // console.log("error");
          // console.log(error);
        }
        );
      };

    if(image === user.imageName){
      setImage(null);
      sendDataToServer();
    }
  } , [user,image])

  const addUser = async (e) => {
    e.preventDefault();
    // console.logl(user);
    const img = document.querySelector("#img");
    // console.log(img.files[0]);
    
    const file = img.files[0];
    if(file){
      await tryCloudinary(file);
    }
    else{
      setImage('d9hdbsylrazjdhmmoih1.jpg');
    }
  };
    
    const tryCloudinary = async (file) => {
      setUser({...user , imageName : imgName});
      // setImage('abc');
      // console.log(image)
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "y1s0unn0");
      formData.append("folder", "chat_webapp");
      const res = await axios.post(cloudinaryUrl, formData);
        const url = res.data.secure_url;
        const index = url.lastIndexOf("/");
        imgName = url.substring(index + 1);
        setImage(imgName);
        // console.log(imgName);
        setUser({...user , imageName : imgName});
        // console.log(user);
    // setImage(imgName);
    // sendDataToServer(imgName);
  };

  return (
    <div>
      <h1 className="text-center" style={{ padding: "20px 0" }}>
        Register here
      </h1>
      <form className="signUpForm" onSubmit={addUser}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            onChange={(e) => {
              setUser({ ...user, name: e.target.value });
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="userId" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="userId"
            name="userId"
            onChange={(e) => {
              setUser({ ...user, userId: e.target.value });
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            name="email"
            onChange={(e) => {
              setUser({ ...user, email: e.target.value });
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
        <div className="mb-3 text-center">
          <label htmlFor="img" id="imgLabel" className="form-label">
            Add your Photo
          </label>
          <input
            type="file"
            id="img"
            name="img"
            className="customFileInput"
            accept="image/png, image/jpg, image/jpeg"
            onChange={(e) => {
              if(e.target.files.length > 0){
                document.querySelector('#iName').style.display = 'block';
                document.querySelector('#iName').innerHTML = e.target.files[0].name;
              }
            }}
          />
          <p id="iName" style={{display : 'none'}} onClick={() => {
            document.querySelector('#img').value = null;
            document.querySelector('#iName').style.display = 'none';
            document.querySelector('#iName').innerHTML = ' ';
          }}></p>
        </div>
        <div className="text-center">
          <button type="submit" className=" me-2 btn btn-dark">
            Submit
          </button>
          <button type="reset" className="ms-2 btn btn-dark">
            Reset
          </button>
        </div>
      </form>
      <div className="text-center bottom_div">
          <h2><Link className="create_account" to="/">
          Go To Home
          </Link></h2>
      </div>
    </div>
  );
}
