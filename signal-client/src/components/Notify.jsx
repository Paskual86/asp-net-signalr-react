import { HubConnectionBuilder } from '@microsoft/signalr';
import { Button, Input, notification } from 'antd';
import React, { useEffect, useState } from 'react';

export const Notify = () => {
  const [connection, setConnection] = useState(null);
  const [inputText, setInputText] = useState('');
  const [messageReceived, setMessageReceived] = useState('');

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl('https://localhost:7128/hubs/notifications')
      .withAutomaticReconnect()
      .build();

    setConnection(connect);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on('ReceiveMessage', (message) => {
            console.log(message);
            setMessageReceived(message.message);
            notification.open({
              message: 'New Notification',
              description: message.message,
              onClick: () => {
                console.log('Notification Clicked!');
              },
            });
          });
        })
        .catch((error) => console.log(error));
    }
  }, [connection]);

  const sendMessage = async () => {
    if (connection) {
      console.log('Sending Message');
      const result = await connection.send('SendMessage', {
        message: inputText,
      });
      console.log(result);
    }
    setInputText('');
  };

  return (
    <>
      <Input
        value={inputText}
        onChange={(input) => {
          setInputText(input.target.value);
        }}
      />
      <Button onClick={sendMessage} type="primary">
        Send
      </Button>
      <h1>{messageReceived}</h1>
    </>
  );
};
