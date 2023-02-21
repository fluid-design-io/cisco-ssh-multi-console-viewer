
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
    type: str
    ip: str
    username: str
    password: str
    sudo_password: str


class QBVcommand(BaseModel):
    type: str
    command: str


class QBVOptions(BaseModel):
    # Either 'local' or 'tftp', where the file is stored
    tftp: bool
    direction: str
    output_folder: str


class ApConnection(BaseModel):
    ip: str
    username: str
    password: str
    enable_password: str


class QBVconfig(BaseModel):
    ap_connection: ApConnection
    ap_commands: List[str]
    device_wifi: DeivceConfig
    device_eth: DeivceConfig
    device_tftp: DeivceConfig
    device_sniffer: DeivceConfig
    server_commands: List[QBVcommand]
    station_commands: List[QBVcommand]
    options: QBVOptions


class QBVApConfig(BaseModel):
    ip: str
    username: str
    password: str
    enable_password: str
