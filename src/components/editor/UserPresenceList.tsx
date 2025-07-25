import React, { useEffect, useState } from 'react';
import { WebsocketProvider } from 'y-websocket';
import { User } from 'firebase/auth';
import { getEmailForUid } from '../../services/documentService';

export interface UserPresenceListProps {
  provider: WebsocketProvider | null;
  currentUser: User;
}

interface PresenceUser {
  name: string;
  color: string;
  uid?: string;
}

const UserPresenceList: React.FC<UserPresenceListProps> = ({ provider, currentUser }) => {
  const [users, setUsers] = useState<PresenceUser[]>([]);

  useEffect(() => {
    if (!provider) return;
    console.log('Initializing user presence list');
    const states = Array.from(provider.awareness.getStates().values());
    console.log('Current user states:', states);
    

    const updateUsers = async () => {
      const states = Array.from(provider.awareness.getStates().values());
      const presenceUsers: PresenceUser[] = states.map((state: any) => ({
        name: state.user?.name || 'Unknown',
        color: state.color || '#888',
        uid: state.uid,
      }));
      setUsers(presenceUsers);
    };

    provider.awareness.on('change', updateUsers);
    updateUsers();

    return () => {
      provider.awareness.off('change', updateUsers);
    };
  }, [provider, currentUser]);

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
          {users.map((user, idx) => (
            <div key={user.uid || user.name || `user-${idx}`}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                style={{ backgroundColor: user.color }}
                title={user.name}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPresenceList;