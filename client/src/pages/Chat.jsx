import axios from 'axios';
import React, { useState, useRef, useId } from "react";
import { useEffect } from "react";
import io from "socket.io-client";

const userId = Math.random();

const socket = { current: io('http://localhost:4500') }

const Chat = () => {
    const [message, setMessage] = useState({ text: '' });
    const [allMessage, setAllMessage] = useState([]);
    const [currentUser, setCurrentUser] = useState({
        name: '',
    });
    const [onlineUsers, setOnlineUsers] = useState(0);

    // const socket = useRef({})
    // socket.current = io('http://localhost:4500');

    useEffect(() => {
        axios.get('http://localhost:4500/api/chat').then(({ data }) => setAllMessage(data))
        socket.current.on("onlineUser", (data) => { setOnlineUsers(data);  console.log('data', data)})

    }, []);

    useEffect(() => {
        socket.current.on("message-listener", (data) => setAllMessage(prevState => {

            // console.log("broadcast, data:", data)
            // if (allMessage.find(message => {
            //     if (message.text === data.text) return true;
            //     else return false;
            // })) {
            //     return prevState
            // }


            return [...prevState, data];
        }));
    }, [])

    

    // const handlerChange = ({ target }) => {
    //     const { name, value } = target;
    //     setCurrentUser(prevState => ({
    //         ...prevState,
    //         [name]: value,
    //     }))
    // }

    const submitName = (e) => {
        e.preventDefault();
        socket.current.emit("addUser", userId)
    }

    const submitMessage = (e) => {
        e.preventDefault();
        const note = { name: currentUser.name, text: message }
        socket.current.emit("sendMessage", note);
     
        axios.post('http://localhost:4500/api/chat', note);


        setAllMessage(prevState => {
            return [...prevState, note];
        });
    }

    // console.log('allMessage', allMessage)
    return (
        <div>
            <p>{!!onlineUsers ? onlineUsers : 0}</p>
            <form action="">
                <label htmlFor="user">Enter your name</label>
                <input onChange={e => setCurrentUser({ name: e.target.value })} name="name" type="text" id='user' placeholder="Name" value={currentUser.name} />
                <button type="submit" onClick={submitName}>Enter to chat</button>
            </form>
            <ul>{allMessage.map((message, index) =>
                <li key={index}>
                    <p>{message.name}</p>:
                    <em>{message.text}</em>
                </li>
            )}
            </ul>

            <form action="">
                <input onChange={e => setMessage(e.target.value)} name="message" type="text" placeholder="message" value={message.text} />
                <button onClick={submitMessage}>Send</button>
            </form>
        </div>
    );
}

export default Chat;