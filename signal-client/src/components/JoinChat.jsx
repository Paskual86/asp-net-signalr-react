import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Button, Input, notification, Card } from 'antd';

import { UserOutlined } from '@ant-design/icons';

const JoinChat = ({
  callbackConnectSuccessfully,
  callbackMessage,
  callbackUserId,
}) => {
  const [connection, setConnection] = useState(null);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on('profile', (message) => {
            console.log(message);
            callbackMessage(`Message Received: "${message}"`);
            notification.open({
              message: 'New Notification',
              description: message,
              onClick: () => {
                console.log('Notification Clicked!');
              },
            });
          });
          callbackConnectSuccessfully(true);
          callbackMessage(`User: ${userId} connected`);
          callbackUserId(userId);
        })
        .catch((error) => {
          callbackMessage(`Error: ${error.message}`);
          console.log(error);
        });
    }
  }, [
    connection,
    userId,
    callbackConnectSuccessfully,
    callbackMessage,
    callbackUserId,
  ]);

  const connectSignalR = () => {
    if (userId.trim().length > 0) {
      const connect = new HubConnectionBuilder()
        .withUrl('http://localhost:7261/api', {
          headers: {
            'x-ms-client-principal-id': userId,
          },
        })
        .withAutomaticReconnect()
        .build();

      setConnection(connect);
    }
  };

  return (
    <Card
      title="Connect User"
      bordered={true}
      style={{
        margin: 20,
        width: 300,
      }}
    >
      <Input
        value={userId}
        onChange={(input) => {
          setUserId(input.target.value);
        }}
        style={{
          marginBottom: 20,
        }}
        prefix={<UserOutlined />}
        placeholder="User"
      />
      <Button onClick={connectSignalR} type="primary">
        Connect
      </Button>
    </Card>
  );
};

export default JoinChat;
