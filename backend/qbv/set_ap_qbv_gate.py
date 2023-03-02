import time
from netmiko import ConnectHandler

from lib.classes import QBVApConfig


def set_ap_qbv_gate(ap_connection: QBVApConfig, ap_commands: list[str], nice_print=print, stream=True):
    """Setting AP QBV gate

    Args:
        ap_connection (ApConnection): AP connection information
        ap_commands (List[str]): List of AP commands to execute under AP dev shell
    """
    ip, username, password, enable_password = ap_connection.ip, ap_connection.username, ap_connection.password, ap_connection.enable_password
    conn = {
        "device_type": "cisco_ios",
        'host': ip,
        'username': username,
        'password': password,
        'secret': enable_password,  # enable password
    }
    with ConnectHandler(**conn) as ssh:
        ssh.enable()
        time.sleep(0.5)
        ssh.write_channel('dev\n')
        time.sleep(0.5)
        # Reset wifitool
        ssh.write_channel(
            'wifitool apr1v0 setUnitTestCmd 0x47 13 402 0 0 0 0xfc564edd 0x5f4c4 0 0 0 0 0 0 0 \n')
        time.sleep(0.5)
        # Set QBV gate
        for command in ap_commands:
            if stream:
                yield nice_print(f'Executing command: {command} on {ip}')
            ssh.write_channel(command + '\n')
            time.sleep(1)
        ssh.write_channel(chr(3))  # Ctrl + C
    if stream:
        return
    return f"\n### Done setting QBV gate for {ip}\n\n------\n\n"


def reset_ap_qbv_gate(ap_connection: QBVApConfig, nice_print=print):
    ip, username, password, enable_password = ap_connection.ip, ap_connection.username, ap_connection.password, ap_connection.enable_password
    conn = {
        "device_type": "cisco_ios",
        'host': ip,
        'username': username,
        'password': password,
        'secret': enable_password,  # enable password
    }
    with ConnectHandler(**conn) as ssh:
        ssh.enable()
        ssh.write_channel('dev\n')
        # Reset wifitool
        ssh.write_channel(
            'wifitool apr1v0 setUnitTestCmd 0x47 13 402 0 0 0 0xfc564edd 0x5f4c4 0 0 0 0 0 0 0 \n')
        output = ssh.read_channel()
        yield nice_print(f'Output: {output}')
