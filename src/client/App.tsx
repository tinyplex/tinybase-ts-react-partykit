import React, { StrictMode } from 'react';
import PartySocket from 'partysocket';
import { createStore } from 'tinybase';
import { createPartyKitPersister } from 'tinybase/persisters/persister-partykit-client';
import {
  Provider,
  useCreatePersister,
  useCreateStore,
} from 'tinybase/ui-react';
import {
  SortedTableInHtmlTable,
  ValuesInHtmlTable,
} from 'tinybase/ui-react-dom';
import { Inspector } from 'tinybase/ui-react-inspector';
import { Buttons } from './Buttons';
import { useRoomId } from './hooks';
import { Share } from './Share';

declare const PARTYKIT_HOST: string;

export const App = () => {
  const store = useCreateStore(() => {
    // Create the TinyBase Store and initialize the Store's data
    return createStore()
      .setValue('counter', 0)
      .setRow('pets', '0', { name: 'fido', species: 'dog' })
      .setTable('species', {
        dog: { price: 5 },
        cat: { price: 4 },
        fish: { price: 2 },
        worm: { price: 1 },
        parrot: { price: 3 },
      });
  });

  const [roomId, createRoomId] = useRoomId();
  useCreatePersister(
    store,
    (store) => {
      if (roomId) {
        return createPartyKitPersister(
          store,
          new PartySocket({ host: PARTYKIT_HOST, room: roomId }),
          location.protocol.slice(0, -1) as 'http' | 'https'
        );
      }
    },
    [roomId],
    async (persister) => {
      if (persister) {
        await persister.startAutoSave();
        await persister.startAutoLoad();
      }
    }
  );

  return (
    <StrictMode>
      <Provider store={store}>
        <header>
          <h1>
            <img src='/favicon.svg' />
            TinyBase & PartyKit
          </h1>
        </header>
        <Share roomId={roomId} createRoomId={createRoomId} />
        <Buttons />
        <div>
          <h2>Values</h2>
          <ValuesInHtmlTable />
        </div>
        <div>
          <h2>Pets Table</h2>
          <SortedTableInHtmlTable
            tableId='pets'
            cellId='name'
            limit={5}
            sortOnClick={true}
            className='sortedTable'
            paginator={true}
          />
        </div>
        <Inspector />
      </Provider>
    </StrictMode>
  );
};
