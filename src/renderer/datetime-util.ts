import dayjs from 'dayjs';

function date2properties(date: Date) {
  return {
    year: String(date.getFullYear()),
    month: (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1),
    day: (date.getDate() < 10 ? '0' : '') + date.getDate(),
    hour: (date.getHours() < 10 ? '0' : '') + date.getHours(),
    minute: (date.getMinutes() < 10 ? '0' : '') + date.getMinutes(),
    second: (date.getSeconds() < 10 ? '0' : '') + date.getSeconds(),
    millisecond: (date.getMilliseconds() < 100 ? '0' : '') + (date.getMilliseconds() < 10 ? '0' : '') + date.getMilliseconds()
  };
}

export function date2string(date: Date, formatter: string = 'yyyy-MM-dd HH:mm:ss.SSS') {
  const { year, month, day, hour, minute, second, millisecond } = date2properties(date);
  return formatter
    .replaceAll('yyyy', year)
    .replaceAll('MM', month)
    .replaceAll('dd', day)
    .replaceAll('HH', hour)
    .replaceAll('mm', minute)
    .replaceAll('ss', second)
    .replaceAll('SSS', millisecond);
}

export function date2dayjs(date: Date, formatter: string = 'YYYY-MM-DD HH:mm:ss.SSS') {
  const { year, month, day, hour, minute, second, millisecond } = date2properties(date);
  return dayjs(formatter
    .replaceAll('YYYY', year)
    .replaceAll('MM', month)
    .replaceAll('DD', day)
    .replaceAll('HH', hour)
    .replaceAll('mm', minute)
    .replaceAll('ss', second)
    .replaceAll('SSS', millisecond), formatter);
}

export function duringTime(time: number) {
  const units = [{ name: '天', rate: 24 * 60 * 60 * 1000 }, { name: '时', rate: 60 * 60 * 1000 }, { name: '分', rate: 60 * 1000 }, { name: '秒', rate: 1000 }];
  for (let i = 0; i < units.length - 1; i++) {
    if (Math.floor(time / units[i].rate) !== 0) {
      return Math.floor(time / units[i].rate) + units[i].name + Math.round(time % units[i].rate / units[i + 1].rate) + units[i + 1].name;
    }
  }
  return Math.round(time/units[units.length-1].rate) + units[units.length - 1].name;
}
