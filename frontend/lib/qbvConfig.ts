import { QBVconfig } from 'app/qbv-legacy/page';

export const defaultConfig: QBVconfig = {
  device_wifi: {
    ip: '10.10.12.99',
    username: 'sanjaynuc2',
    password: 'sjnuc2',
  },
  device_eth: {
    ip: '10.10.12.97',
    username: 'sanjaynuc1',
    password: 'sjnuc1',
  },
  device_tftp: {
    ip: '10.9.1.135',
    username: 'Cisco',
    password: 'Cisco',
  },
  device_sniffer: {
    ip: '10.10.12.101',
    username: 'sanjaynuc3',
    password: 'sjnuc3',
  },
  ap_command: 'wifitool apr1v0 setUnitTestCmd 0x47 13 402 0 1 0 0x3c8a85d 0x5f3d4f 35000 2 5000 3000 0 3000 100000',
  server_commands: [
    {
      type: 'BE 5010',
      command: 'iperf -s -p 5010 -t 60',
    },
    {
      type: 'VI 5020',
      command: 'iperf -s -p 5020 -t 60',
    },
  ],
  station_commands: [
    {
      type: 'BE',
      command: '',
    },
    {
      type: 'VI',
      command: '',
    },
  ],
  options: {
    store: 'tftp',
    // default as qbv-Jan-01-23
    output: `qbv-${new Date()
      .toLocaleString('default', { month: 'short', day: '2-digit', year: '2-digit' })
      .replace(/\s/g, '-')
      .replace(/,/g, '')}`,
    direction: 'DL',
  },
};
