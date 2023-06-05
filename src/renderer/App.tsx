import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import { Button, Col, Input, Modal, Row } from 'antd';
import { date2string } from './datetime-util';
import { DataItem, read, write } from './renderer';
import { DataList } from './DataList';
import { ShowNumber } from './ShowNumber';


function Hello() {
  const [data, setData] = React.useState<DataItem[]>([]);
  const [inputMessage, setInputMessage] = React.useState('');
  const [showDetails, setShowDetails] = React.useState(false);
  const [clearModal, setClearModal] = React.useState(false);
  const [startTime, setStartTime] = React.useState<Date>();
  React.useEffect(() => {
    read().then(setData);
  }, []);
  return (<>
    <ShowNumber number={dataCheck(data).filter(datum => datum.thisWeek).length} />
    <Row>
      <Col span={14}>
        <Input.TextArea autoSize value={inputMessage} onChange={(e) => {
          setInputMessage(e.target.value);
        }}></Input.TextArea>
      </Col>
      <Col span={2}>
        <Button style={{ width: '100%' }} onClick={() => {
          setStartTime(startTime => startTime ? undefined : new Date());
        }}>{startTime === undefined ? 'Start' : 'Cancel'}</Button>
      </Col>
      <Col span={2}>
        <Button style={{ width: '100%' }} onClick={async () => {
          let data = await read();
          let dataItem: DataItem = {
            stopTime: date2string(new Date()),
            message: inputMessage
          };
          if (startTime) {
            dataItem.startTime = date2string(startTime);
          }
          data.unshift(dataItem);
          await write(data);
          setStartTime(undefined);
          setInputMessage('');
          read().then(setData);
        }}>{startTime ? 'Stop' : '+1'}</Button>
      </Col>
      <Col span={2}>
        <Button style={{ width: '100%' }} onClick={() => setShowDetails(showDetails => !showDetails)}>Details</Button>
      </Col>
      <Col span={2}>
        <Button style={{ width: '100%' }} onClick={() => {
          setClearModal(true);
        }}>Clear All</Button>
      </Col>
    </Row>
    <Modal open={clearModal} okText={'Clear'} onOk={async () => {
      await write([]);
      setClearModal(false);
      read().then(setData);
    }} onCancel={() => setClearModal(false)}>
      <DataList data={dataCheck(data)} type={'show'} />
    </Modal>
    <br />
    {showDetails && <DataList data={dataCheck(data)} onChange={setData} type={'edit'} />}
  </>);
}

function dataCheck(data: DataItem[]) {
  let day = new Date().getDay();
  let date = day === 0 ? new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 6) : new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * (day - 1));
  date.setHours(4);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return data.map(datum => {
    return {
      startTime: datum.startTime,
      stopTime: datum.stopTime,
      message: datum.message,
      thisWeek: new Date(datum.stopTime).getTime() > date.getTime() &&
        new Date(datum.stopTime).getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000
    };
  });
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Hello />} />
      </Routes>
    </Router>
  );
}
