import { Col, Row, Divider } from 'antd';
import React, { useState } from 'react';
import JoinChat from './JoinChat';
import JoinGroup from './JoinGroup';
import SendMessage from './SendMessage';
export const Notify = () => {
  const [userId, setUserId] = useState('');
  const [messageReceived, setMessageReceived] = useState('');
  const [connectedSuccessfully, setConnectedSuccessfully] = useState(false);

  return (
    <>
      <Row justify="center">
        {!connectedSuccessfully && (
          <JoinChat
            callbackConnectSuccessfully={(val) => setConnectedSuccessfully(val)}
            callbackMessage={(msg) => setMessageReceived(msg)}
            callbackUserId={(usr) => setUserId(usr)}
          />
        )}
        {connectedSuccessfully && (
          <Row justify="center">
            <Col>
              <SendMessage />
            </Col>
            <Col>
              <JoinGroup userId={userId} />
            </Col>
          </Row>
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
