import React from 'react';
import { Col, Progress, Result, Row, Typography } from 'antd';
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
        {(() => {
          if (number >= 33) {
            return <Typography.Title level={2}><Result status={'success'}></Result></Typography.Title>
            // return <Result status={'success'}></Result>;
          } else if (dayjs().day() === 0) {
            return <Typography.Title level={2} type={'danger'}>
              Last Day
            </Typography.Title>;
          } else {
            let average = (33 - number) / (7 - dayjs().day());
            return <Typography.Title level={2} type={(() => {
              if (average > 8) {
                return 'danger';
              } else if (average > 5.5) {
                return 'warning';
              } else {
                return undefined;
              }
            })()}>
              Average: {average}
            </Typography.Title>;
          }
        })()}
      </Col>
      <Col span={6}></Col>
    </Row>
  </>;
}
