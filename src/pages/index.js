import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { newKitFromWeb3 } from '@celo/contractkit';

export default function Home() {
  const [web3, setWeb3] = useState(null);
  const [kit, setKit] = useState(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    connectToCelo();
  }, []);

  const connectToCelo = async () => {
    if (window.celo) {
      const web3 = new Web3(window.celo);
      const kit = newKitFromWeb3(web3);
      const accounts = await web3.eth.getAccounts();

      setWeb3(web3);
      setKit(kit);
      setAccounts(accounts);
    } else {
      console.error('Celo wallet not detected');
    }
  };

  // Rest of the code...
  const CHAT_ABI = [
    // Define the ABI for your chat smart contract here
    // Example: ["function sendMessage(string _message) public"]
  ];
  
  const CHAT_CONTRACT_ADDRESS = 'YOUR_CHAT_CONTRACT_ADDRESS';

  const [chatMessages, setChatMessages] = useState([]);

useEffect(() => {
  fetchChatMessages();
}, []);

const fetchChatMessages = async () => {
  if (!kit) return;

  const chatContract = new kit.web3.eth.Contract(CHAT_ABI, CHAT_CONTRACT_ADDRESS);

  // Fetch the chat messages from the smart contract
  const messageCount = await chatContract.methods.messageCount().call();
  const messages = [];
  for (let i = 0; i < messageCount; i++) {
    const message = await chatContract.methods.messages(i).call();
    messages.push(message);
  }

  setChatMessages(messages);
};
const [message, setMessage] = useState('');

const sendMessage = async () => {
  if (!kit || !accounts[0] || !message) return;
  
  const chatContract = new kit.web3.eth.Contract(CHAT_ABI, CHAT_CONTRACT_ADDRESS);
  
  // Call the sendMessage function on the chat contract
  await chatContract.methods.sendMessage(message).send({ from: accounts[0] });
  
  // Clear the message input field
  setMessage('');
  
  // Fetch updated chat messages
  fetchChatMessages();
  };

  return (
    <div>
      <h1>Celo Chat dApp Example</h1>
      <div>
        {chatMessages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}
