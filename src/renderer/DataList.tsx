import React from 'react';
import { Button, Col, Input, List, Row } from 'antd';
import { DataItem, read, write } from './renderer';

export function DataList(props: { data: DataItem[], onChange?: any, type: 'show' | 'edit' }) {
  const { data, onChange, type } = props;
  return <>
    <List dataSource={data} style={{ height: '400px', overflow: 'auto' }} renderItem={(item, index) =>
      <List.Item>
        <Row style={{ width: '100%' }}>
          {type === 'edit' && <Col span={6}>
            {item.startTime}
          </Col>}
          <Col span={6}>{item.stopTime} </Col>
          <Col span={6}>
            <Input key={item.stopTime} defaultValue={item.message} disabled={type === 'show'}
                   onChange={(e) => {
                     data[index].message = e.target.value;
                     onChange(data);
                   }}
                   onBlur={async (e) => {
                     data[index].message = e.target.value;
                     await write(data);
                     read().then(onChange);
                   }} />
          </Col>
          <Col span={6}>
            <Button disabled={type === 'show'} onClick={async () => {
              data.splice(index, 1);
              await write(data);
              read().then(onChange);
            }}>delete</Button>
          </Col>
        </Row>
      </List.Item>}></List>
  </>;
}
