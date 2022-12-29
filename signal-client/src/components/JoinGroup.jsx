import React, { useState } from 'react';
import { Button, Input, Card } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

const JoinGroup = ({ userId }) => {
  const [group, setGroup] = useState('');

  const onAddGroupHandler = () => {
    fetch(`http://localhost:7261/api/${group}/add/${userId}`, {
      method: 'POST',
    }).then(() => {
      console.log('Mssage sent');
    });
  };

  return (
    <Card
      title="Join Group"
      bordered={true}
      style={{
        margin: 20,
        width: 300,
      }}
    >
      <Input
        value={group}
        onChange={(input) => {
          setGroup(input.target.value);
        }}
        style={{
          marginBottom: 20,
        }}
        prefix={<TeamOutlined />}
        placeholder="User"
      />
      <Button onClick={onAddGroupHandler} type="primary">
        Join
      </Button>
    </Card>
  );
};

export default JoinGroup;
