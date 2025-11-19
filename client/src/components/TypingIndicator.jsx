export default function TypingIndicator({ users }) {
  if (users.length === 0) return null;
  return (
    <div className="px-6 py-2 text-sm text-gray-400 italic">
      {users.join(', ')} {users.length === 1 ? 'is' : 'are'} typing...
      <span className="ml-2">•••</span>
    </div>
  );
}