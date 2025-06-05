import React from 'react';
import { UserPresence } from '../../types';

interface UserPresenceListProps {
  users: UserPresence[];
}

const UserPresenceList: React.FC<UserPresenceListProps> = ({ users }) => {
  if (users.length <= 1) {
    return null;
  }
  
  return (
    <div className="border-t border-gray-200 py-2 px-4 bg-white">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">
          {users.length} {users.length === 1 ? 'person' : 'people'} viewing
        </span>
        <div className="flex -space-x-2">
          {users.slice(0, 5).map((user, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
              style={{ backgroundColor: user.color }}
              title={user.name}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {users.length > 5 && (
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 text-xs font-medium border-2 border-white">
              +{users.length - 5}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPresenceList;