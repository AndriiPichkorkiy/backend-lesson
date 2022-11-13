
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

    // const socket = useRef({})
    // socket.current = io('http://localhost:4500');

    useEffect(() => {
        socket.current.on("message-listener", (data) => setAllMessage(prevState => {
            console.log("broadcast, data:", data)
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
        socket.current.emit("sendMessage", { name: currentUser.name, text: message });



        setAllMessage(prevState => {
            return [...prevState, { name: currentUser.name, text: message }];
        });
    }

    // console.log('allMessage', allMessage)
    return (
        <div>
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