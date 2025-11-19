import { useState } from 'react';
import { useSocketContext } from '../context/SocketContext';

export default function Login({ setUsername }) {
  const { connect } = useSocketContext();
  const [input, setInput] = useState('');

  const handleJoin = () => {
    if (input.trim()) {
      setUsername(input.trim());
      connect(input.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-12 w-full max-w-md border border-white/20">
        <h1 className="text-5xl font-bold text-center mb-10 text-white drop-shadow-lg">SocketChat</h1>
        <input
          type="text"
          placeholder="Enter your username..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
          className="w-full px-8 py-5 rounded-full bg-white/20 border border-white/30 text-white placeholder-white/70 text-lg focus:outline-none focus:ring-4 focus:ring-purple-500 focus:bg-white/30 transition"
        />
        <button
          onClick={handleJoin}
          className="w-full mt-8 py-5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition duration-300 shadow-lg"
        >
          Join Chat
        </button>
      </div>
    </div>
  );
}