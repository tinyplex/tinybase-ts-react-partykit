import React from 'react';

type Props = { roomId: string; createRoomId: () => void };

export const Share = ({ roomId, createRoomId }: Props) => (
  <div id='share'>
    {roomId ? (
      <a href={'?' + roomId} target='_blank'>
        &#128279; Share link
      </a>
    ) : (
      <span onClick={createRoomId}>&#127880; Start sharing</span>
    )}
  </div>
);
