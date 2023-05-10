import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import { Button, Input, List } from 'antd';
import { date2string } from './datetime-util';

async function read(): Promise<DataItem[]> {
  window.electron.ipcRenderer.sendMessage('read', []);
  return new Promise<any>((res, rej) => {
    window.electron.ipcRenderer.once('read', (args) => {
      if (args) {
        res(JSON.parse(String(args)));
      } else {
        res([]);
      }
    });
  });
}

async function write(data: DataItem[]) {
  window.electron.ipcRenderer.sendMessage('write', [JSON.stringify(data)]);
}

interface DataItem {
  time: string;
  message: string;
}

function Hello() {
  const [data, setData] = React.useState<DataItem[]>([]);
  const [inputMessage, setInputMessage] = React.useState('');
  const [showDetails, setShowDetails] = React.useState(false);
  React.useEffect(() => {
    read().then(setData);
  }, []);
  return (<>
    {data.length}
    <br />
    <Input value={inputMessage} onChange={(e) => {
      setInputMessage(e.target.value);
    }}></Input>
    <Button onClick={async () => {
      let data = await read();
      data.unshift({
        time: date2string(new Date()),
        message: inputMessage
      });
      await write(data);
      setInputMessage('');
      read().then(setData);
    }}>+1</Button>
    <Button onClick={() => {
      setShowDetails(showDetails => !showDetails);
    }}>Details</Button>
    <br />
    {

      showDetails &&
      <List dataSource={data} style={{ height: '400px', overflow: 'auto' }} renderItem={(item, index) =>
        <List.Item>
          <span>{item.time}</span>
          <Input key={item.time} defaultValue={item.message}
                 onChange={(e) => {
                   data[index].message = e.target.value;
                   setData(data);
                 }}
                 onBlur={async (e) => {
                   data[index].message = e.target.value;
                   await write(data);
                   read().then(setData);
                 }}></Input>
          <Button onClick={async () => {
            data.splice(index, 1);
            await write(data);
            read().then(setData);
          }}>delete</Button>
        </List.Item>}></List>

    }
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
