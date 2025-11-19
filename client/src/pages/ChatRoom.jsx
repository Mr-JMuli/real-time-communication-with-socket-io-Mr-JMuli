import { useSocketContext } from '../context/SocketContext';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import TypingIndicator from '../components/TypingIndicator';

export default function ChatRoom({ username }) {
  const { isConnected, users, typingUsers } = useSocketContext();

  return (
    <div className="h-screen flex bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-6 flex flex-col">
        <h1 className="text-3xl font-bold text-purple-400 mb-8">SocketChat</h1>
        <p className="text-sm text-gray-400 mb-4">Welcome, <span className="font-bold text-white">{username}</span></p>
        <div className="flex items-center gap-2 text-sm mb-6">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
          <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
        </div>
        <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Online — {users.length}</h3>
        <div className="space-y-2 flex-1 overflow-y-auto">
          {users.map(u => (
            <div key={u} className="flex items-center gap-3 text-gray-300 hover:bg-gray-700 p-2 rounded transition">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              {u} {u === username && <span className="text-gray-500 text-xs">(you)</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-800 px-8 py-5 border-b border-gray-700">
          <h2 className="text-xl font-bold"># general</h2>
        </div>
        <MessageList currentUser={username} />
        <TypingIndicator users={typingUsers.filter(u => u !== username)} />
        <MessageInput />
      </div>
    </div>
  );
}