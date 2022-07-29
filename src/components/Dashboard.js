import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Image } from "cloudinary-react";
import ScrollToBottom from "react-scroll-to-bottom";
import { over } from "stompjs";
import SockJS from "sockjs-client";

let stompClient = null;
export default function Dashboard() {
  const baseUrl = process.env.REACT_APP_BASE_URl;
  const CHAT_SERVICE = "https://howzz-chat-service.herokuapp.com";
  const IMAGE_URL =
    "https://res.cloudinary.com/dlbokp0mc/image/upload/v1658475937/chat_webapp/";

  const [user, setUser] = useState({});
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [text, setText] = useState("");
  const [isGlobal, setIsGlobal] = useState(true);
  const [activeContact, setActiveContact] = useState();
  const [messages, setMessages] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const tok = localStorage.getItem("token");
    setToken(tok);

    const checkToken = () => {
      if (token === "") {
        if (!localStorage.getItem("token")) {
          navigate("/", { replace: true });
        }
      }
    };

    checkToken();
  }, []);

  useEffect(() => {
    if (activeContact === undefined) return;
    // console.log("ActiveContact is ", activeContact);
    if (isGlobal) {
      // console.log("Is Global",isGlobal)
      loadGlobalMessages();
    } else {
      // contacts.map(async(contact) => {
      //   const response = await countNewMessages(contact.id , user.id);
      //   console.log(contact.id , " , " , response);
      // })
      findChatMessages(activeContact.id, user.id).then((msgs) => {
        setMessages(msgs);
      });
    }
    loadContacts();
  }, [activeContact]);

  useEffect(() => {
    // console.log(token);
    if (token !== "") {
      fetchUserInfo();
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      makeRequest();
    }
  }, [user]);

  // useEffect(() => {
  //   console.log("Contacts from use Effect : ", contacts);
  // }, [contacts]);

  // useEffect(() => {
  //   console.log("Messages : ", messages);
  // }, [messages]);

  const fetchUserInfo = async () => {
    // console.log("Token == ", token);
    const response = await axios
      .get(`${baseUrl}/user/email/getInfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (response) => {
          return response;
        },
        (error) => {
          alert("Your session is expired!! You have to login again..");
          logoutUser();
        }
      );
    setUser(response.data);
  };

  const logoutUser = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const findUsers = async (e) => {
    if (e.target.value) {
      const response = await axios.get(
        `${baseUrl}/user/auth/users/${e.target.value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response);
      setUsers(response.data);
      document.querySelector("#users").style.display = "block";
    } else {
      document.querySelector("#users").style.display = "none";
    }
  };

  const makeRequest = () => {
    // const stomp = require("stompjs");
    // var sockJs = require("sockjs-client");
    let sockJs = new SockJS(`${CHAT_SERVICE}/ws-connect`);
    stompClient = over(sockJs);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    // console.log("Connected");
    // fetchUserInfo();
    stompClient.subscribe(`/chatroom/public`, onGlobalMessageReceived);
    stompClient.subscribe(`/user/${user.id}/queue/messages`, onMessageReceived);
    const c = {
      id: "1704",
      name: "Global",
      userId: "howzzGlobal",
    };
    setActiveContact(c);
    // const chatMessage = {
    //   senderId : user.id,
    //   receiverId: '1',
    //   content: 'Hii'
    // }
    // console.log(chatMessage);
    // stompClient.send("/app/message" , {} , JSON.stringify(chatMessage));
  };

  const onGlobalMessageReceived = (msg) => {
    const data = JSON.parse(msg.body);
    const newMessages = [...messages];
    newMessages.push(data);
    setMessages(newMessages);
    // console.log("Data from global msg = ", data);
  };

  const onError = () => {
    // console.log("Error");
    // console.log("Something went wrong..");
  };

  const findChatMessages = async (senderId, receiverId) => {
    // if (token === null || token === "") {
    //   navigate("/", { replace: true });
    // }
    const response = await axios.get(
      `${CHAT_SERVICE}/messages/${senderId}/${receiverId}`
    );
    return response.data;
  };

  const findChatMessage = async (id) => {
    // if (token === null || token === "") {
    //   navigate("/", { replace: true });
    // }
    const response = await axios.get(`${CHAT_SERVICE}/messages/${id}`);
    return response.data;
  };

  const onMessageReceived = (msg) => {
    // console.log("msg == ", msg);
    const notification = JSON.parse(msg.body);
    const active = JSON.parse(activeContact);

    if (active.id === notification.senderId) {
      findChatMessage(notification.id).then((notificationMsg) => {
        const msgs = messages;
        msgs.push(notificationMsg);
        setMessages(msgs);
      });
    } else {
      toast("Received a new message from " + notification.senderName, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });
    }
    loadContacts();
  };

  const loadContacts = async () => {
    setContacts([]);
    const response = await axios.get(`${CHAT_SERVICE}/getUsers/${user.id}`);
    const userIds = response.data;
    // console.log("UserIds = ", userIds);
    const data = userIds.map(async (senderIdAndReceiverId) => {
      let res;
      // const res = await axios.get(`${baseUrl}/user/${id}`);
      const id = JSON.parse(senderIdAndReceiverId);
      // const u = JSON.parse(user);
      // console.log("U == ",u);
      // console.log("ids = ",id);
      if (id.senderId === user.id) {
        if (id.receiverId !== "1704") {
          res = await axios.get(`${baseUrl}/user/${id.receiverId}`);
        }
      } else {
        res = await axios.get(`${baseUrl}/user/${id.senderId}`);
      }

      if (res !== undefined) {
        return res.data;
      }
      return;
    });

    Promise.all(data).then((con) => {
      // console.log("CON == ",con);
      setContacts(con);
    });
  };

  // const countNewMessages = async (senderId, receiverId) => {
  //   if (token === null || token === "") {
  //     navigate("/", { replace: true });
  //   }
  //   const response = await axios.get(
  //     `${CHAT_SERVICE}/messages/${senderId}/${receiverId}/count`
  //   );
  //   return response.data;
  // };

  const sendMessage = (msg) => {
    if (msg.trim() !== "") {
      const message = {
        senderId: user.id,
        receiverId: activeContact.id,
        senderName: user.name,
        receiverName: activeContact.name,
        content: msg,
        timeStamp: new Date(),
      };

      // console.log("Message : ", message);
      if (isGlobal) {
        stompClient.send("/app/message", {}, JSON.stringify(message));
      } else {
        stompClient.send("/app/chat", {}, JSON.stringify(message));
      }

      const newMessages = [...messages];
      newMessages.push(message);
      setMessages(newMessages);
    }
  };

  const loadGlobalMessages = async () => {
    const response = await axios.get(`${CHAT_SERVICE}/messages/global/1704`);
    // console.log(response.data);
    setMessages(response.data);
  };

  return (
    <div>
      <nav className="navbar bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand chat_apk_name" to="/dashboard">
            Howzz
          </Link>
          {/* <p className="navbar-link">{`Welcome ${user.name}`}</p> */}
          <button className="btn btn-dark user_name">
            Welcome {user.name}
          </button>
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search your friend"
              aria-label="Search"
              onChange={findUsers}
            />
          </form>
          <div id="users" style={{ display: "none" }}>
            {users.map((user) => (
              <p
                key={user.id}
                onClick={() => {
                  setIsGlobal(false);
                  const s = [...contacts];
                  s.push(user);
                  setContacts(s);
                  setActiveContact(user);
                }}
              >
                {user.name} ({user.userId})
              </p>
            ))}
          </div>
        </div>
      </nav>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
      />
      <div className="user_info text-center">
        <h1>Howzz</h1>
        <h3>Welcome {user.name}</h3>
      </div>
      <div className="dashboard">
        <div className="chatList">
          <h2 className="chats">Chats</h2>
          <ul>
            <li
              id="global"
              className={isGlobal ? "active" : ""}
              onClick={() => {
                const globalUser = {
                  id: "1704",
                  name: "Global",
                  userId: "howzzGlobal",
                };
                setIsGlobal(true);
                setActiveContact(globalUser);
              }}
            >
              Global
            </li>
            {contacts &&
              contacts.map((contact) => (
                <li
                  key={contact.id}
                  className={contact.id === activeContact.id ? "active" : ""}
                  onClick={() => {
                    setIsGlobal(false);
                    setActiveContact(contact);
                  }}
                >
                  {contact.name}
                </li>
              ))}
          </ul>

          <button className="btn btn-dark logoutBtn" onClick={logoutUser}>
            Logout
          </button>
        </div>
        <div className="rightSide">
          <div className="receiverDetails">
            {isGlobal ? (
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    height: "40px",
                    width: "40px",
                    borderRadius: "50%",
                    border: "1px solid black",
                  }}
                >
                  <Image
                    style={{ height: "30px", width: "30px", margin: "5px 5px" }}
                    cloudName="dlbokp0mc"
                    publicId={`${IMAGE_URL}chat_cxogbd.png`}
                  />
                </div>
                <p>Global</p>
              </div>
            ) : (
              <div style={{ display: "flex" }}>
                <div>
                  <Image
                    style={{
                      height: "40px",
                      width: "40px",
                      margin: "5px 5px",
                      borderRadius: "50%",
                    }}
                    cloudName="dlbokp0mc"
                    publicId={`${IMAGE_URL}${activeContact.imageName}`}
                  />
                </div>
                <p style={{ marginTop: "5px" }}>{activeContact.name}</p>
              </div>
            )}
            <hr />
          </div>
          <div className="chatContainer">
            <ScrollToBottom
              className="messages"
              mode="bottom"
              initialScrollBehavior="smooth"
            >
              {messages &&
                messages.map((msg) =>
                  isGlobal ? (
                    <div
                      className={msg.senderId === user.id ? "sent" : "replied"}
                      id={msg.id}
                      key={msg.id}
                    >
                      <p>
                        {msg.senderId === user.id ? (
                          <span>You</span>
                        ) : (
                          <span className="blank"></span>
                        )}{" "}
                        {msg.content}{" "}
                        {msg.senderId !== user.id ? (
                          <span>{msg.senderName}</span>
                        ) : (
                          <span className="blank"></span>
                        )}
                      </p>
                    </div>
                  ) : (
                    <div
                      className={msg.senderId === user.id ? "sent" : "replied"}
                      id={msg.id}
                      key={msg.id}
                    >
                      <p>{msg.content}</p>
                    </div>
                  )
                )}
            </ScrollToBottom>
          </div>
          <div className="sendForm">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Enter message"
              aria-label="Search"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
            <button
              className="btn btn-dark"
              onClick={() => {
                sendMessage(text);
                setText("");
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
