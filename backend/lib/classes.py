
from typing import List
from pydantic import BaseModel

# This class represents a device. It contains its hostname, username, and password.


class Device(BaseModel):
    hostname: str
    username: str
    password: str
    secret: str


class ExecuteCommand(BaseModel):
    commands: str
    devices: List[Device]


class DeivceConfig(BaseModel):
    ip: str
    username: str
    password: str


class QBVcommand(BaseModel):
    type: str
    command: str


class QBVOptions(BaseModel):
    # Either 'local' or 'tftp', where the file is stored
    store: str
    output: str
    direction: str


class QBVconfig(BaseModel):
    device_wifi: DeivceConfig
    device_eth: DeivceConfig
    device_tftp: DeivceConfig
    device_sniffer: DeivceConfig
    ap_command: str
    server_commands: List[QBVcommand]
    station_commands: List[QBVcommand]
    options: QBVOptions
