import React from 'react';
import { Col, Progress, Result, Row, Typography } from 'antd';
import dayjs from 'dayjs';

export function ShowNumber(props: { number: number }) {
  const { number } = props;
  const [, refresh] = React.useState(false);
  React.useEffect(() => {
    let interval = setInterval(() => {
      refresh(fresh => !fresh);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return <>
    <Row>
      <Col span={6}></Col>
      <Col span={6}>
        <Progress type='circle' percent={number / 0.33} format={() => number} />
      </Col>
      <Col span={6}>
        {(() => {
          if (number >= 33) {
            return <Typography.Title level={2}><Result status={'success'}></Result></Typography.Title>;
            /*
             * 平时不计算4点
             */
          } else if ((dayjs().day() === 1 && dayjs().hour() < 4)  // 周一4点前
            || (dayjs().day() === 0)) {  // 周日
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
              Average: {parseFloat(average.toFixed(2))}
            </Typography.Title>;
          }
        })()}
      </Col>
      <Col span={6}></Col>
    </Row>
  </>;
}
