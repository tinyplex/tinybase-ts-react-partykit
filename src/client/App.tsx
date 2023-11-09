import React, { StrictMode } from 'react';
import PartySocket from 'partysocket';
import { createStore } from 'tinybase';
import {
  Provider,
  useCreatePersister,
  useCreateStore,
} from 'tinybase/debug/ui-react';
import {
  SortedTableInHtmlTable,
  StoreInspector,
  ValuesInHtmlTable,
} from 'tinybase/debug/ui-react-dom';
import { createPartyKitPersister } from 'tinybase/persisters/persister-partykit-client';
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
        <Share roomId={roomId} createRoomId={createRoomId} />
        <Buttons />
        <div>
          <h2>Values</h2>
          <ValuesInHtmlTable />
        </div>
        <div>
          <h2>Species Table</h2>
          <SortedTableInHtmlTable
            tableId='species'
            cellId='price'
            descending={true}
            sortOnClick={true}
            className='sortedTable'
          />
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
        <StoreInspector />
      </Provider>
    </StrictMode>
  );
};
