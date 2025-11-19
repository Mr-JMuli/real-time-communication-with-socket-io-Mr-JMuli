import { useSocketContext } from '../context/SocketContext';

export default function MessageList({ currentUser }) {
  const { messages } = useSocketContext();

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((msg, i) => (
        <div key={i} className={`flex ${msg.username === currentUser ? 'justify-end' : 'justify-start'}`}>
          {msg.system ? (
            <p className="text-center text-xs text-gray-500 italic">{msg.message}</p>
          ) : (
            <div className={`max-w-md px-6 py-3 rounded-2xl ${msg.username === currentUser ? 'bg-purple-600' : 'bg-gray-700'}`}>
              <p className="text-xs opacity-80">{msg.username}</p>
              <p className="mt-1">{msg.message}</p>
              <p className="text-xs opacity-60 text-right mt-1">
                {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}