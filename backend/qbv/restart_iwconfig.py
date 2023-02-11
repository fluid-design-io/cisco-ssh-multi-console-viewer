import os
from fabric import Connection, Config
from dotenv import load_dotenv

load_dotenv()

NUC3_IP = os.getenv('NUC3_IP')
NUC3_SUDO_PW = os.getenv('NUC3_SUDO_PW')
nuc3_config = Config(overrides={"sudo": {
    "password": NUC3_SUDO_PW}, 'connect_kwargs': {'password': NUC3_SUDO_PW}})


def restart_wifi(hasMon=True, channel=116):
    wlan0 = 'wlp45s0'
    wlan = f'{wlan0}mon' if hasMon else wlan0
    c = Connection(NUC3_IP, user="sanjaynuc3", config=nuc3_config)
    c.sudo(f'ifconfig {wlan} down')
    c.sudo('service network-manager restart')
    c.sudo(f'ifconfig {wlan} up')
    c.sudo('airmon-ng check kill')
    c.sudo(f'airmon-ng start {wlan}')
    c.sudo(f'iwconfig {wlan} channel {channel}')
    c.sudo('iwconfig')
    print("done!")


restart_wifi()
