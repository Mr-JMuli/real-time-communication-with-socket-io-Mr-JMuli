// src/App.jsx
import { useState } from 'react';
import Login from './pages/Login';
import ChatRoom from './pages/ChatRoom';

function App() {
  const [username, setUsername] = useState('');

  if (!username) {
    return <Login setUsername={setUsername} />;
  }

  return <ChatRoom username={username} />;
}

export default App;