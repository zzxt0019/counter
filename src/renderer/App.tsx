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
    <ShowNumber number={data.length} />
    <Row>
      <Col span={14}>
        <Input value={inputMessage} onChange={(e) => {
          setInputMessage(e.target.value);
        }}></Input>
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
      <DataList data={data} type={'show'} />
    </Modal>
    <br />
    {showDetails && <DataList data={data} onChange={setData} type={'edit'} />}
  </>);
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
