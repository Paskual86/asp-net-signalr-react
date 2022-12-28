import { HubConnectionBuilder } from '@microsoft/signalr';
import { Button, Input, notification, Card, Col, Row, Divider } from 'antd';
import React, { useEffect, useState } from 'react';

export const Notify = () => {
  const [connection, setConnection] = useState(null);
  const [inputText, setInputText] = useState('');
  const [userId, setUserId] = useState('');
  const [messageReceived, setMessageReceived] = useState('');

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on('profile', (message) => {
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
    <>
      <Row justify="center">
        <Col span={12}>
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
                margin: 10,
              }}
            />
            <Button onClick={connectSignalR} type="primary">
              Connect
            </Button>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Send Message"
            bordered={true}
            style={{
              margin: 20,
              width: 300,
            }}
          >
            <Input
              value={inputText}
              onChange={(input) => {
                setInputText(input.target.value);
              }}
            />
            <Button onClick={sendMessage} type="primary">
              Send
            </Button>
          </Card>
        </Col>
      </Row>
      <Divider orientation="center">Messages</Divider>
      <Row justify="center">
        <Col span={24}>
          <h1>{messageReceived}</h1>
        </Col>
      </Row>
    </>
  );
};
