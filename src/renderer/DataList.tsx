import React from 'react';
import { Button, Col, Input, List, Row, Tooltip, Typography } from 'antd';
import { DataItem, read, write } from './renderer';
import { duringTime } from './datetime-util';

export function DataList(props: {
  data: { startTime?: string, stopTime: string, message: string, thisWeek: boolean }[],
  onChange?: any,
  type: 'show' | 'edit'
}) {
  const { data, onChange, type } = props;
  const [, refresh] = React.useState(false);
  React.useEffect(() => {
    let interval = setInterval(() => {
      refresh(fresh => !fresh);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return <>
    <List dataSource={data} style={{ height: '400px', overflow: 'auto' }} renderItem={(item, index) =>
      <List.Item>
        <Row style={{ width: '100%' }}>
          {type === 'edit' && <Col span={6}>
            {
              item.startTime &&
              <Tooltip title={item.startTime}>
                <Typography.Text style={{ color: item.thisWeek ? 'black' : 'lightgray' }}>
                  耗时 {duringTime(new Date(item.stopTime).getTime() - new Date(item.startTime).getTime())}
                </Typography.Text>
              </Tooltip>
            }
          </Col>}
          <Col span={6}>
            <Tooltip title={item.stopTime}>
              <Typography.Text style={{ color: item.thisWeek ? 'black' : 'lightgray' }}>
                {duringTime(new Date().getTime() - new Date(item.stopTime).getTime()) + ' 前'}
              </Typography.Text>
            </Tooltip>
          </Col>
          <Col span={6}>
            <Input.TextArea autoSize key={item.stopTime} defaultValue={item.message} disabled={type === 'show'}
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
