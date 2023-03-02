// wifitool apr1v0 setUnitTestCmd 0x47 13 402 0 1 0 0xfc564edd 0x5f4c4 35000 3 10000 10000 0 10000 100000
export const defaultApConfig = {
  radioId: 0,
  enable: 1,
  epochId: 0,
  utcStartTimeLoUs: '',
  utcStartTimeHiUs: '',
  guardIntervalUs: 35000,
  tsnAc: 3,
  tsnDurationUs: 10000,
  tsnUlOffsetUs: 10000,
  tsnDlOffsetUs: 0,
  tsnUlDlOffsetUs: 10000,
  epochDurationUs: 100000,
};

export type QbvApConfig = typeof defaultApConfig;

export type QbvApTemplate = {
  title: string;
  description: string;
  config: QbvApConfig[];
};

export const qbvApConfigTemplates: QbvApTemplate[] = [
  {
    title: 'UL Gate (MRF 1.14.1)',
    description:
      'PTP synced AP via Ethernet (Cisco 9300) – instructions as per Oliver’s update to “DRAW tuning notes” NUC (AX210) acting as a Wi-Fi STA running iPerf3 Another wired PC running iPerf ',
    config: [
      /* 
        wifitool apr1v0 setUnitTestCmd 0x47 13 402 0 1 0 <utc_start_time_lo_us> <utc_start_time_hi_us> 2000 2 3000 0 3000 3000 20000
     */
      {
        radioId: 0,
        enable: 1,
        epochId: 0,
        utcStartTimeLoUs: '',
        utcStartTimeHiUs: '',
        guardIntervalUs: 2000,
        tsnAc: 2,
        tsnDurationUs: 3000,
        tsnUlOffsetUs: 0,
        tsnDlOffsetUs: 3000,
        tsnUlDlOffsetUs: 3000,
        epochDurationUs: 20000,
      },
    ],
  },
  {
    title: 'DL Gate (MRD 1.14.1)',
    description:
      'PTP synced AP via Ethernet (Cisco 9300) NUC acting as a Wi-Fi STA running iPerf Another PC running iPerf ',
    config: [
      /* 
        wifitool apr1v0 setUnitTestCmd 0x47 13 402 0 1 0 <utc_start_time_lo_us> <utc_start_time_hi_us> 2000 2 2500 2500 0 2500 20000
        wifitool apr1v0 setUnitTestCmd 0x47 13 402 0 1 1 <utc_start_time_lo_us> + 4500 to 18500 <utc_start_time_hi_us> 2000 0 1500 1500 0 1500 20000
        */
      {
        radioId: 0,
        enable: 1,
        epochId: 0,
        utcStartTimeLoUs: '',
        utcStartTimeHiUs: '',
        guardIntervalUs: 2000,
        tsnAc: 2,
        tsnDurationUs: 2500,
        tsnUlOffsetUs: 2500,
        tsnDlOffsetUs: 0,
        tsnUlDlOffsetUs: 2500,
        epochDurationUs: 20000,
      },
      {
        radioId: 0,
        enable: 1,
        epochId: 1,
        utcStartTimeLoUs: '',
        utcStartTimeHiUs: '',
        guardIntervalUs: 2000,
        tsnAc: 0,
        tsnDurationUs: 1500,
        tsnUlOffsetUs: 1500,
        tsnDlOffsetUs: 0,
        tsnUlDlOffsetUs: 1500,
        epochDurationUs: 20000,
      },
    ],
  },
];

export type DeviceConnType = {
  type: 'eth' | 'wifi' | 'sniffer' | 'tftp';
  ip: string;
  username: string;
  password: string;
  sudo_password: string;
};

export const defaultDeviceConnConfig: DeviceConnType[] = [
  {
    type: 'eth',
    ip: '10.10.12.97',
    username: 'sanjaynuc1',
    password: 'sjnuc1',
    sudo_password: 'sjnuc1',
  },
  {
    type: 'wifi',
    ip: '10.10.12.99',
    username: 'sanjaynuc2',
    password: 'sjnuc2',
    sudo_password: 'sjnuc2',
  },
  {
    type: 'sniffer',
    ip: '10.10.12.101',
    username: 'sanjaynuc3',
    password: 'sjnuc3',
    sudo_password: 'sjnuc3',
  },
  {
    type: 'tftp',
    ip: '10.9.1.135',
    username: 'Cisco',
    password: 'Cisco',
    sudo_password: 'Cisco',
  },
];

export const defaultApConnection: ApConnType = {
  ip: '10.10.12.52',
  username: 'apuser',
  password: 'SecureAP1',
  enable_password: 'SecureAP1',
};

export const defaultServerCommands = [
  {
    type: 'BE 5010',
    command: 'iperf -s -p 5010 -t 60', // We need to set timeout for the server to close the connection
  },
  {
    type: 'VI 5020',
    command: 'iperf -s -p 5020 -t 60',
  },
];

export const defaultStationCommands = [
  {
    type: 'BE',
    command: "'/home/sanjaynuc1/Desktop/iperf' -c 10.10.12.99 -l 1500 -b 212M -t 55 -i 1 -p 5010", // give a little more time for the server to close the connection
  },
  {
    type: 'VI',
    command: "'/home/sanjaynuc1/Desktop/iperf' -c 10.10.12.99 -l 128 -b 50pps -t 55 -i 1 -p 5020",
  },
];

export const defaultQbvOptions: QBVOptions = {
  direction: 'DL',
  tftp: false,
  output_folder: 'output',
};

export type ApConnType = {
  ip: string;
  username: string;
  password: string;
  enable_password: string;
};

export type QBVcommand = {
  type: string;
  command: string;
};

export type QBVOptions = {
  /**
   * Store the captures in the local output folder or using the TFTP server
   */
  tftp: boolean;
  /**
   * The local output folder
   */
  output_folder: string;
  direction: 'DL' | 'UL' | 'ULDL';
};

export type QBVconfig = {
  ap_connection: ApConnType;
  ap_commands: string[];
  device_wifi: DeviceConnType;
  device_eth: DeviceConnType;
  device_tftp: DeviceConnType;
  device_sniffer: DeviceConnType;
  server_commands: QBVcommand[];
  station_commands: QBVcommand[];
  options: QBVOptions;
};
