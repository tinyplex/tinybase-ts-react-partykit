import { useCallback, useState } from 'react';

export const useRoomId = (): [roomId: string, createRoomId: () => void] => {
  const [roomId, setRoomId] = useState(parent.location.search.substring(1));
  return [
    roomId,
    useCallback(() => {
      const newRoomId = ('' + Math.random()).substring(2, 12);
      parent.history.replaceState(null, '', '?' + newRoomId);
      setRoomId(newRoomId);
    }, []),
  ];
};
