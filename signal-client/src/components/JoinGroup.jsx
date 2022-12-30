import React, { useState } from 'react';
import { Button, Input, Card } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
const URL = 'http://localhost:7261/api';
const JoinGroup = ({ userId }) => {
  const [group, setGroup] = useState('');
  const [loading, setLoading] = useState(false);

  const onAddGroupHandler = () => {
    setLoading(true);
    fetch(`${URL}/${group}/add/${userId}`, {
      method: 'POST',
    })
      .then(() => {})
      .finally(() => {
        setLoading(false);
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
      <Button onClick={onAddGroupHandler} type="primary" loading={loading}>
        Join
      </Button>
    </Card>
  );
};

export default JoinGroup;
