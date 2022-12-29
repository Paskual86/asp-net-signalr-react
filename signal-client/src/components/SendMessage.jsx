import React, { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Button, Input, Card } from 'antd';

const SendMessage = () => {
  const [message, setMessage] = useState('');
  const [userToSendMessage, setUserToSendMessage] = useState('');

  const sendMessage = async () => {
    fetch(
      `http://localhost:7261/api/sendmessage?target=profile&userid=${userToSendMessage}`,
      {
        method: 'POST',
        body: JSON.stringify({ message: message }),
      }
    ).then(() => {
      console.log('Mssage sent');
    });
    setMessage('');
  };

  return (
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
  );
};

export default SendMessage;
