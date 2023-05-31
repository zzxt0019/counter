export async function read(): Promise<DataItem[]> {
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

export async function write(data: DataItem[]) {
  window.electron.ipcRenderer.sendMessage('write', [JSON.stringify(data)]);
}

export interface DataItem {
  startTime?: string;
  stopTime: string;
  message: string;
}
