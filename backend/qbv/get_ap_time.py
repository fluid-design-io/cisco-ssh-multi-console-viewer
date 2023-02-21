import time
from netmiko import ConnectHandler


AP_IP = '10.10.12.52'
AP_PW = 'SecureAP1'
AP_USERNAME = 'apuser'


def extractLastHexString(output):
    lines = output.strip().split('\n')
    lastLine = lines[-1].strip() if lines else ""
    hexString = lastLine.split(':')[-1].strip() if lastLine else ""
    return hexString


def get_utc_us(ip, username, password, enable_password):
    conn = {
        "device_type": "cisco_ios",
        "host": ip,
        "username": username,
        "password": password,
        "secret": enable_password,  # enable password
    }
    with ConnectHandler(**conn) as ssh:
        ssh.enable()
        ssh.write_channel('dev\n')
        ssh.write_channel('cd ..\n')
        ssh.write_channel('cd ./storage\n')
        ssh.write_channel('./utc_us.sh\n')
        time.sleep(3)
        ssh.write_channel(chr(3))  # Ctrl + C
        output = ssh.read_channel()
        # if "not found" in output, then the file does not exist
        if "not found" in output:
            return "File not found"
        else:
            hexString = extractLastHexString(output)
            return hexString
