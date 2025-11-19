import { useState } from 'react';
import { useSocketContext } from '../context/SocketContext';

export default function MessageInput() {
  const { sendMessage, setTyping } = useSocketContext();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage('');
      setTyping(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 border-t border-gray-700">
      <div className="flex gap-4">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setTyping(e.target.value.length > 0);
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-6 py-4 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-4 focus:ring-purple-500"
        />
        <button onClick={handleSend} className="px-8 bg-purple-600 hover:bg-purple-700 rounded-full font-bold transition">
          Send
        </button>
      </div>
    </div>
  );
}