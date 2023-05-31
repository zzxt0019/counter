import React from 'react';
import { Col, Progress, Row, Typography } from 'antd';
import dayjs from 'dayjs';

export function ShowNumber(props: { number: number }) {
  const { number } = props;
  return <>
    <Row>
      <Col span={6}></Col>
      <Col span={6}>
        <Progress type='circle' percent={number / 0.33} format={() => number} />
      </Col>
      <Col span={6}>
        {dayjs().day() !== 0 ?
          <Typography.Title level={2} type={(() => {
            let average = (33 - number) / (7 - dayjs().day());
            if (average > 8) {
              return 'danger';
            } else if (average > 5.5) {
              return 'warning';
            } else {
              return undefined;
            }
          })()}>
            Average: {(33 - number) / (7 - dayjs().day())}
          </Typography.Title> :
          <Typography.Title level={2} type={'danger'}>
            Last Day
          </Typography.Title>}
      </Col>
      <Col span={6}></Col>
    </Row>
  </>;
}
