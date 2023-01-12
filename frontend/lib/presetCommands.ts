// Some preset Cisco commands:
// Such as: set terminal length 0, set up SNMP, regenerating the RSA key, etc.

import { IpAddressSchema } from 'lib/form-schema';
import { z } from 'zod';

export const DEVICES = {
  switch: 'Switch',
  router: 'Router',
  ap: 'Access Point',
  firewall: 'Firewall',
  server: 'Server',
  other: 'Other',
};

export const COMMAND_REPLACE = {
  ip: {
    sign: '{{ip}}',
    description: 'IP address',
    schema: IpAddressSchema,
    color: '#134b6e',
  },
  username: {
    sign: '{{username}}',
    description: 'Username',
    schema: z.string().min(1, { message: 'Username should not be empty' }),
    color: '#064a1a',
  },
  password: {
    sign: '{{password}}',
    description: 'Password',
    schema: z.string().min(1, { message: 'Password should not be empty' }),
    color: '#062e4a',
  },
  community: {
    sign: '{{community}}',
    description: 'Community',
    schema: z.string().min(1, { message: 'Community should not be empty' }),
    color: '#3e4b54',
  },
  port: {
    sign: '{{port}}',
    description: 'Port',
    schema: z.string().min(1, { message: 'Port should not be empty' }),
    example: 'GigabitEthernet0/0, gi0/1, etc.',
    color: '#3e4b54',
  },
  vlan: {
    sign: '{{vlan}}',
    description: 'VLAN',
    schema: z.string().min(1, { message: 'VLAN should not be empty' }),
    color: '#9c611f',
  },
  pool: {
    sign: '{{pool}}',
    description: 'The pool name',
    schema: z.string().min(1, { message: 'Pool should not be empty' }),
    color: '#1f9c97',
  },
  network: {
    sign: '{{network}}',
    description: 'Network: The network address',
    schema: IpAddressSchema,
    color: '#235375',
  },
  mask: {
    sign: '{{mask}}',
    description: 'Mask: The network mask',
    schema: IpAddressSchema,
    color: '#546b5d',
  },
  gateway: {
    sign: '{{gateway}}',
    description: 'Gateway: The gateway address',
    schema: IpAddressSchema,
    color: '#3a335e',
  },
  dns: {
    sign: '{{dns}}',
    description: 'DNS: The DNS address',
    schema: IpAddressSchema,
    example: '8.8.8.8',
    color: '#425251',
  },
};

export const COMMAND_TYPE = {
  show: 'show',
  config: 'config',
  other: 'other',
};

export const presetCommands = [
  {
    name: 'Configure terminal',
    command: ['conf t'],
    availableDevices: [DEVICES.switch, DEVICES.router, DEVICES.ap, DEVICES.firewall, DEVICES.server, DEVICES.other],
    description: 'Enter configuration mode',
    type: COMMAND_TYPE.config,
  },
  {
    name: 'Show running-config',
    command: ['show running-config'],
    availableDevices: [DEVICES.switch, DEVICES.router, DEVICES.ap, DEVICES.firewall, DEVICES.server, DEVICES.other],
    description: 'Show running-config',
    type: COMMAND_TYPE.show,
  },
  {
    name: 'Set access port',
    command: ['interface {{port}}', 'switchport mode access', 'switchport access vlan {{vlan}}'],
    commandReplace: {
      port: COMMAND_REPLACE.port,
      vlan: COMMAND_REPLACE.vlan,
    },
    availableDevices: [DEVICES.switch],
    description: 'Set an access port',
    type: COMMAND_TYPE.config,
  },
  {
    name: 'Set trunk port',
    command: ['interface {{port}}', 'switchport mode trunk', 'switchport trunk allowed vlan {{vlan}}'],
    commandReplace: {
      port: COMMAND_REPLACE.port,
      vlan: COMMAND_REPLACE.vlan,
    },
    availableDevices: [DEVICES.switch],
    description: 'Set a trunk port',
    type: COMMAND_TYPE.config,
  },
  {
    name: 'Show IP interface brief',
    command: ['show ip interface brief'],
    availableDevices: [DEVICES.switch, DEVICES.router, DEVICES.ap, DEVICES.firewall, DEVICES.server, DEVICES.other],
    description: 'Show IP interface brief',
    type: COMMAND_TYPE.show,
  },
  {
    name: 'Show CDP neighbors',
    command: ['show cdp neighbors'],
    availableDevices: [DEVICES.switch, DEVICES.router, DEVICES.ap, DEVICES.firewall, DEVICES.server, DEVICES.other],
    description: 'Show CDP neighbors',
    type: COMMAND_TYPE.show,
  },
  {
    name: 'Show CDP neighbors detail',
    command: ['show cdp neighbors {{port}} detail'],
    availableDevices: [DEVICES.switch, DEVICES.router, DEVICES.ap, DEVICES.firewall, DEVICES.server, DEVICES.other],
    description: 'Show CDP neighbors detail of a specific port',
    type: COMMAND_TYPE.show,
  },
  {
    name: 'Show VLAN brief',
    command: ['show vlan brief'],
    availableDevices: [DEVICES.switch, DEVICES.router, DEVICES.ap, DEVICES.firewall, DEVICES.server, DEVICES.other],
    description: 'Show VLAN brief',
    type: COMMAND_TYPE.show,
  },
  {
    name: 'Show MAC address-table',
    command: ['show mac address-table'],
    availableDevices: [DEVICES.switch, DEVICES.router, DEVICES.ap, DEVICES.firewall, DEVICES.server, DEVICES.other],
    description: 'Show MAC address-table',
    type: COMMAND_TYPE.show,
  },
  {
    name: 'Show associated clients',
    command: ['show wireless client summary'],
    availableDevices: [DEVICES.ap],
    description: 'Show associated clients',
    type: COMMAND_TYPE.show,
  },
  {
    name: 'Show interface status',
    command: ['show interface status'],
    availableDevices: [DEVICES.switch, DEVICES.router, DEVICES.ap, DEVICES.firewall, DEVICES.server, DEVICES.other],
    description: 'Show interface status',
    type: COMMAND_TYPE.show,
  },
  {
    name: 'Show version',
    command: ['show version'],
    availableDevices: [DEVICES.switch, DEVICES.router, DEVICES.ap, DEVICES.firewall, DEVICES.server, DEVICES.other],
    description: 'Show version',
    type: COMMAND_TYPE.show,
  },
  {
    name: 'Show IP route',
    command: ['show ip route'],
    availableDevices: [DEVICES.router, DEVICES.ap, DEVICES.firewall, DEVICES.server, DEVICES.other],
    description: 'Show IP route',
    type: COMMAND_TYPE.show,
  },
  {
    name: 'Set IP route',
    command: ['ip route {{network}} {{mask}} {{gateway}}'],
    commandReplace: {
      network: COMMAND_REPLACE.network,
      mask: COMMAND_REPLACE.mask,
      gateway: COMMAND_REPLACE.gateway,
    },
    availableDevices: [DEVICES.router, DEVICES.ap, DEVICES.firewall, DEVICES.server, DEVICES.other],
    description: 'Set IP route',
    type: COMMAND_TYPE.config,
  },
  {
    name: 'Set IP route static',
    command: ['ip route {{network}} {{mask}} {{gateway}} {{metric}}'],
    commandReplace: {
      network: COMMAND_REPLACE.network,
      mask: COMMAND_REPLACE.mask,
      gateway: COMMAND_REPLACE.gateway,
      metric: {
        sign: '{{metric}}',
        description: 'The metric for the route',
        schema: z.number().min(1).max(255),
      },
    },
    availableDevices: [DEVICES.router, DEVICES.ap, DEVICES.firewall, DEVICES.server, DEVICES.other],
    description: 'Set IP route static',
    type: COMMAND_TYPE.config,
  },
  {
    name: 'Configure NAT',
    command: [
      'ip nat inside source static {{local_ip}} {{global_ip}}',
      'interface {{inside_port}}',
      'ip address {{ip}} {{mask}}',
      'ip nat inside',
      'exit',
      'interface {{outside_port}}',
      'ip address {{ip}} {{mask}}',
      'ip nat outside',
    ],
    commandReplace: {
      local_ip: {
        sign: '{{local_ip}}',
        description:
          'The local IP address. Establishes static translation between an inside local address and an inside global address.',
        schema: IpAddressSchema,
      },
      global_ip: {
        sign: '{{global_ip}}',
        description:
          'The global IP address. Establishes static translation between an inside local address and an inside global address.',
        schema: IpAddressSchema,
      },
      inside_port: {
        sign: '{{inside_port}}',
        description: 'Specifies an interface and enters the interface configuration mode.',
        schema: z.string(),
      },
      outside_port: {
        sign: '{{outside_port}}',
        description: 'Specifies a different interface and enters the interface configuration mode.',
        schema: z.string(),
      },
      ip: COMMAND_REPLACE.ip,
      mask: COMMAND_REPLACE.mask,
    },
    availableDevices: [DEVICES.router, DEVICES.ap, DEVICES.firewall, DEVICES.server, DEVICES.other],
    description: 'Configure NAT to allow traffic from inside to outside',
  },
  {
    name: 'DHCP pool',
    command: [
      'ip dhcp pool {{pool}}',
      'network {{network}} {{mask}}',
      'default-router {{gateway}}',
      'dns-server {{dns}}',
    ],
    availableDevices: [DEVICES.router, DEVICES.ap, DEVICES.firewall, DEVICES.server, DEVICES.other],
    commandReplace: {
      pool: {
        ...COMMAND_REPLACE.pool,
        description: 'The name of the pool. To configure this pool, use ip dhcp pool <pool-name>.',
      },
      network: COMMAND_REPLACE.network,
      mask: COMMAND_REPLACE.mask,
      gateway: COMMAND_REPLACE.gateway,
      dns: COMMAND_REPLACE.dns,
    },
    description: 'Set a DHCP pool, with default-router and dns-server',
    type: COMMAND_TYPE.config,
  },
  {
    name: 'DHCP pool exclude',
    command: ['ip dhcp excluded-address {{start}} {{end}}'],
    availableDevices: [DEVICES.router, DEVICES.ap, DEVICES.firewall, DEVICES.server, DEVICES.other],
    commandReplace: {
      start: {
        sign: '{{start}}',
        description: 'Start: The start address',
        schema: IpAddressSchema,
      },
      end: {
        sign: '{{end}}',
        description: 'End: The end address',
        schema: IpAddressSchema,
      },
    },
    description: 'Set a DHCP pool exclude',
    type: COMMAND_TYPE.config,
  },
  {
    name: 'Terminal Length 0',
    command: ['terminal length 0'],
    availableDevices: [DEVICES.switch, DEVICES.router, DEVICES.ap, DEVICES.firewall, DEVICES.server, DEVICES.other],
    description: 'Set terminal length to 0',
  },
  {
    name: 'SNMPv2',
    command: [
      'snmp-server community public RO',
      'snmp-server community private RW',
      'snmp-server host {{ip}} traps version 2c public',
      'snmp-server host {{ip}} traps version 2c private',
    ],
    commandReplace: {
      ip: COMMAND_REPLACE.ip,
    },
    availableDevices: [DEVICES.switch, DEVICES.router, DEVICES.ap, DEVICES.firewall, DEVICES.server, DEVICES.other],
    description: 'Set up SNMPv2',
    type: COMMAND_TYPE.config,
  },

  {
    name: 'Generate RSA Key',
    command: ['crypto key generate rsa modulus 2048'],
    availableDevices: [DEVICES.router, DEVICES.ap, DEVICES.firewall, DEVICES.server, DEVICES.other],
    description: 'Regenerate the RSA key, allowing SSH access',
    type: COMMAND_TYPE.config,
  },
  {
    name: 'Add User',
    command: ['username {{username}} privilege 15 secret {{password}}'],
    commandReplace: {
      username: COMMAND_REPLACE.username,
      password: COMMAND_REPLACE.password,
    },
    availableDevices: [DEVICES.switch, DEVICES.router, DEVICES.ap, DEVICES.firewall, DEVICES.server, DEVICES.other],
    description: 'Add a user with privilege 15',
    type: COMMAND_TYPE.config,
  },
  {
    name: 'Remove User',
    command: ['no username {{username}}'],
    commandReplace: {
      username: COMMAND_REPLACE.username,
    },
    availableDevices: [DEVICES.switch, DEVICES.router, DEVICES.ap, DEVICES.firewall, DEVICES.server, DEVICES.other],
    description: 'Remove a user',
    type: COMMAND_TYPE.config,
  },
  {
    name: 'DNS',
    command: ['ip name-server {{dns}}'],
    commandReplace: {
      dns: COMMAND_REPLACE.dns,
    },
    availableDevices: [DEVICES.router, DEVICES.ap, DEVICES.firewall, DEVICES.server, DEVICES.other],
    description: 'Set DNS',
    type: COMMAND_TYPE.config,
  },
  {
    name: 'TFTP download',
    command: ['copy tftp flash', 'address {{ip}}', 'filename {{filename}}'],
    commandReplace: {
      ip: COMMAND_REPLACE.ip,
      filename: {
        sign: '{{filename}}',
        description: 'Filename: The filename',
        schema: z.string(),
      },
    },
    availableDevices: [DEVICES.router, DEVICES.ap, DEVICES.firewall, DEVICES.server, DEVICES.other],
    description: 'Download a file from TFTP',
    type: COMMAND_TYPE.config,
  },
  {
    name: 'AP image upgrade',
    command: ['archive download-sw /reload tftp://{{ip}}/{{filename}}'],
    commandReplace: {
      ip: COMMAND_REPLACE.ip,
      filename: {
        sign: '{{filename}}',
        description: 'Filename: The filename',
        schema: z.string(),
      },
    },
    availableDevices: [DEVICES.ap],
    description: 'Upgrade AP image',
    type: COMMAND_TYPE.config,
  },
];

export type CommandReplaceType = typeof COMMAND_REPLACE;
export type CommandReplaceObjectType = typeof COMMAND_REPLACE[keyof typeof COMMAND_REPLACE];
export type PresetCommand = typeof presetCommands extends (infer U)[] ? U : never;
