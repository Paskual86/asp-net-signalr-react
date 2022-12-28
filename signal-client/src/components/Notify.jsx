import { HubConnectionBuilder } from '@microsoft/signalr';
import { Button, Input, notification, Card, Col, Row, Divider } from 'antd';
import React, { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';

export const Notify = () => {
  const [connection, setConnection] = useState(null);
  const [message, setMessage] = useState('');
  const [userToSendMessage, setUserToSendMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [messageReceived, setMessageReceived] = useState('');
  const [connectedSuccessfully, setConnectedSuccessfully] = useState(false);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on('profile', (message) => {
            console.log(message);
            setMessageReceived(`Message Received: "${message}"`);
            notification.open({
              message: 'New Notification',
              description: message,
              onClick: () => {
                console.log('Notification Clicked!');
              },
            });
          });
          setConnectedSuccessfully(true);
          setMessageReceived(`User: ${userId} connected`);
        })
        .catch((error) => {
          setMessageReceived(`Error: ${error.message}`);
          console.log(error);
        });
    }
  }, [connection, userId]);

  const sendMessage = async () => {
    if (connection) {
      console.log('Sending Message');
      fetch(
        `http://localhost:7261/api/sendmessage?target=profile&userid=${userToSendMessage}`,
        {
          method: 'POST',
          body: JSON.stringify({ message: message }),
        }
      ).then(() => {
        console.log('Mssage sent');
      });
      /*const result = await connection.send('SendMessage', {
        message: inputText,
      });
      console.log(result);*/
    }
    setMessage('');
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
        {!connectedSuccessfully && (
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
        )}
        {connectedSuccessfully && (
          <Card
            title="Send Message"
            bordered={true}
            style={{
              margin: 20,
              width: 300,
            }}
          >
            <Input
              value={userToSendMessage}
              onChange={(input) => {
                setUserToSendMessage(input.target.value);
              }}
              style={{
                marginBottom: 20,
              }}
              prefix={<UserOutlined />}
              placeholder="User"
            />

            <Input
              value={message}
              onChange={(input) => {
                setMessage(input.target.value);
              }}
              style={{
                marginBottom: 20,
              }}
              placeholder="Message"
            />

            <Button onClick={sendMessage} type="primary">
              Send
            </Button>
          </Card>
        )}
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
