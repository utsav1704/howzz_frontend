import React, { useEffect, useState } from "react";
import axios from "axios";
import { IKContext, IKUpload } from "imagekitio-react";

export default function SignUp() {
  const [image, setImage] = useState(null);
  const [user, setUser] = useState({ roles: ["ROLE_USER"] , imageName : "d9hdbsylrazjdhmmoih1.jpg"});
  let imgName;

  const baseUrl = process.env.REACT_APP_BASE_URl;
  const cloudinaryUrl = "https://api.cloudinary.com/v1_1/dlbokp0mc/upload";
  const publicKey = "public_TxTzagmxpXtAWtXDsngmgtCrkAM=";
  const authEndPoint = `${baseUrl}/signup/uploadImage`;
  const endPoint = "https://ik.imagekit.io/oujtaqkkg/";

  useEffect(() => {
    console.log("User == ",user);
    console.log("Image == ",image);
    if(image === user.imageName){
      setImage(null);
      sendDataToServer();
    }
  } , [user,image])

  const addUser = async (e) => {
    e.preventDefault();
    console.log(user);
    const img = document.querySelector("#img");
    console.log(img.files[0]);
    
    const file = img.files[0];
    if(file){
      await tyrCloudinary(file);
    }
    else{
      setImage('d9hdbsylrazjdhmmoih1.jpg');
    }
  };
  
  const sendDataToServer = async () => {
    // setUser({...user , imageName : "ppp.png"});
    // console.log("IMG NAME == ",img);
    // setUser({...user , imageName : img});
    // console.log("After printing and setting img name == ",user);
    await axios.post(`${baseUrl}/user`, user).then(
      (response) => {
        console.log(response);
        console.log(image);
        console.log("After getting response == ",user);
        setUser({});
      },
      (error) => {
        console.log("error");
        console.log(error);
      }
      );
    };
    
    const tyrCloudinary = async (file) => {
      setUser({...user , imageName : imgName});
      // setImage('abc');
      console.log(image)
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "y1s0unn0");
      formData.append("folder", "chat_webapp");
      const res = await axios.post(cloudinaryUrl, formData);
      //   .then(
        //   (response) => {
          //     const url = response.data.secure_url;
          //     const index = url.lastIndexOf("/");
          //     imageName = url.substring(index + 1);
          
          //     // setImage(""+url.substring(index + 1));
    //     // console.log("After setting image")
    //     // console.log(image);
    //     // setUser({ ...user, name: e.target.value });
    //     // console.log(iName);
    //     // setUser({ ...user , imageName : iName});
    //     // setUser((preUse) => {
      //     //   return {...preUse , ...imgName}
      //     // });
      //     console.log(user);
      //     console.log(response);
      //   },
      //   (error) => {
        //     console.log(error);
        //   }
        //   );
        console.log("res");
        console.log(res);
        const url = res.data.secure_url;
        const index = url.lastIndexOf("/");
        imgName = url.substring(index + 1);
        setImage(imgName);
        console.log(imgName);
        setUser({...user , imageName : imgName});
        console.log(user);
    // setImage(imgName);
    // sendDataToServer(imgName);
  };

  const uploadImage = (userId, file) => {
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };

    axios.post(`${baseUrl}/signup/uploadImage/${userId}`, file, config).then(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log("error");
        console.log(error);
      }
    );
  };

  const onError = (err) => {
    console.log("Error", err);
  };

  const onSuccess = (res) => {
    console.log("Success", res);
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
          {/* <IKContext publicKey={publicKey} urlEndpoint={endPoint} authenticationEndpoint={authEndPoint}>
            <IKUpload fileName="test-upload.png" onError={onError} onSuccess={onSuccess}/>
          </IKContext> */}
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
    </div>
  );
}
