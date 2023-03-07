from ast import List
import os
import random
import time
import threading
from datetime import datetime
from fabric import Connection, Config
from multiprocessing import Process
from qbv.set_ap_qbv_gate import set_ap_qbv_gate
from lib.classes import QBVconfig
from queue import Queue


PACKET_COUNT = 80000

FOLDER = f"Captures"


def nice_print(msg, type='default'):
    """A formatted yield

    Args:
        msg (str): The message to be yielded
        type (str, optional): The type of message. Defaults to 'info'.
    """
    if type == 'info':
        return f"\n> {msg}"
    elif type == 'error':
        return f"\n**{msg}\t**\n"
    elif type == 'section':
        return f"\n{msg}\n----------------------------"
    elif type == 'default':
        return f'\n{msg}\n'
    elif type == 'h1':
        return f'\n# {msg}\n'
    elif type == 'h2':
        return f'\n## {msg}\n'
    elif type == 'codeblock':
        return f'\n```\n{msg}\n```\n'

# THIS IS DOWNLINK ONLY TEST SETUP


def run_thread(device_ip, device_user, device_pw, command, queue: Queue):
    generator = connect_and_exec(
        device_ip, device_user, device_pw, command)
    for result in generator:
        queue.put(result)


def connect_and_exec(device_ip, device_user, device_pw, command):
    yield nice_print(f"Connecting to device {device_ip}", type='info')
    try:
        device_config = Config(overrides={"sudo": {
            "password": device_pw}, 'connect_kwargs': {'password': device_pw}})
        conn = Connection(device_ip, user=device_user, config=device_config)
        res = conn.sudo(f"{command}", hide=True)  # iperf -s -p 5010
        yield nice_print(f"Connected to {device_ip}: {command}", type='info')
        output = res.stdout
        # Add an extra \n for each line of output
        output = output.replace('\n', '\n\n')
        yield nice_print(output, type='codeblock')
        conn.close()
    except Exception as e:
        yield nice_print(
            f"Failed to connect to device: {e}", type='error')


def start_wifi_sniffer(device_ip, device_user, device_pw, tftp_ip, tftp_user, tftp_pw, tftp=False, output_folder=FOLDER, queue: Queue = None):
    TIMESTAMPE = datetime.now().strftime("%m-%d-%Y_%H_%M_%S")
    queue.put(nice_print(f"Starting WIFI sniffer", type='info'))
    filename = f"QBV_WIFI__BE__{TIMESTAMPE}.pcap"
    device_config = Config(overrides={"sudo": {
        "password": device_pw}, 'connect_kwargs': {'password': device_pw}})
    wifi_conn = Connection(device_ip, user=device_user, config=device_config)
    wifi_conn.sudo(
        f"tcpdump -i wlp45s0mon 'tcp port 5010 or tcp port 5020' -w './Desktop/captures/{filename}' -c {PACKET_COUNT}")  # Stop the program after reciving PACKET_COUNT lines of info.

    queue.put(nice_print(f"Done sniffing WIFI", type='h2'))

    # create output and qbv folders if they don't exist

    if not os.path.exists('output'):
        os.makedirs('output')
    if not os.path.exists('output/qbv'):
        os.makedirs('output/qbv')
    time.sleep(0.5)

    queue.put(nice_print("Downloading to local machine..."))
    # Transfer the pcap file to local machine
    wifi_conn.get(f'Desktop/captures/{filename}')

    time.sleep(0.5)

    queue.put(nice_print(
        f"\n[Download wifi capture](http://localhost:8000/download/{filename}?folder=output/qbv)\n"))
    # Move the local file into output/qbv
    os.rename(filename, f'output/qbv/{filename}')
    file_path = f'output/qbv/{filename}'
    if tftp:
        # Setup TFTP server
        file_path = upload_to_tftp(
            tftp_ip, tftp_user, tftp_pw, output_folder, filename)

    # Delete the pcap file from the device
    wifi_conn.sudo(f"rm -rf ./Desktop/captures/{filename}")

    wifi_conn.close()

    # read_cap(f'./{filename}')
    return file_path


def start_eth_sniffer(device_ip, device_user, device_pw, tftp_ip, tftp_user, tftp_pw, tftp=False, output_folder=FOLDER, queue: Queue = None):
    TIMESTAMPE = datetime.now().strftime("%m-%d-%Y_%H_%M_%S")
    queue.put(nice_print(f"Starting ETH sniffer", type='info'))
    filename = f"QBV_ETH__BE__{TIMESTAMPE}.pcap"

    device_config = Config(overrides={"sudo": {
        "password": device_pw}, 'connect_kwargs': {'password': device_pw}})
    eth_conn = Connection(device_ip, user=device_user, config=device_config)
    eth_conn.sudo(
        f"tcpdump -i enp89s0 'tcp port 5010 or tcp port 5020' -w './Desktop/captures/{filename}' -c {PACKET_COUNT/2}")  # Stop the program after reciving PACKET_COUNT lines of info.

    queue.put(nice_print(f"Done sniffing ETH", type='h2'))

    # create output and qbv folders if they don't exist

    if not os.path.exists('output'):
        os.makedirs('output')
    if not os.path.exists('output/qbv'):
        os.makedirs('output/qbv')
    time.sleep(0.5)

    queue.put(nice_print("Downloading to local machine..."))
    # Transfer the pcap file to local machine
    eth_conn.get(f'Desktop/captures/{filename}')

    time.sleep(0.5)

    queue.put(nice_print(
        f"\n[Download eth capture](http://localhost:8000/download/{filename}?folder=output/qbv)\n"))
    # Move the local file into output/qbv
    os.rename(filename, f'output/qbv/{filename}')

    file_path = f'output/qbv/{filename}'
    if tftp:
        # Setup TFTP server
        file_path = upload_to_tftp(
            tftp_ip, tftp_user, tftp_pw, output_folder, filename)

    # Delete the pcap file from the device
    eth_conn.sudo(f"rm -rf ./Desktop/captures/{filename}")

    eth_conn.close()

    # read_cap(f'./{filename}')
    return file_path


def upload_to_tftp(device_ip, device_user, device_pw, output_folder, filename=None, tftp_path="/Users/cisco/Desktop/Shared/sniffer"):
    """
    Uploads a file to the TFTP server
    1. Connect to TFTP server
    2. Check if folder exists
    3. If not, create folder
    4. Transfer file to TFTP server 
    """
    print(f"\n\t======\tUploading {filename[4:5]} captures to TFTP \t======\t")
    tftp_config = Config(overrides={"sudo": {
        "password": device_pw}, 'connect_kwargs': {'password': device_pw}})
    tftp_conn = Connection(device_ip, user=device_user, config=tftp_config)
    with tftp_conn.cd(tftp_path):
        folders = tftp_conn.run("ls", hide=True)
        lines = folders.stdout.split("\n")
        if output_folder not in lines:
            tftp_conn.run(f"mkdir {output_folder}")
    # Transfer to TFTP server
    # OR os.path.join('output', 'qbv', filename)
    path = f'output/qbv/{filename}'
    tftp_conn.put(path, tftp_path+"/"+output_folder)

    print(
        f"\n\t======\tFile {filename[:4]} captures uploaded to TFTP \t======\t")

    return os.path.join(tftp_path, output_folder, filename)


def qbv_model(config: QBVconfig):
    """Overview of the QBV test and the steps involved

    Args:
        config (QBVconfig): The configuration for the test

    Steps:

        1. Extract the config
            - Extract the device configs (wifi, eth, sniffer, tftp)
            - Extract the iperf server commands, iperf station commands
            - Extract the options (store, output, direction)
        2. Based on the direction, generate the iperf commands
            - If direction is `DL`
                - Start the iperf server on the wifi device
                - Start the iperf client on the eth device
            - If direction is `UL`
                - Start the iperf server on the eth device
                - Start the iperf client on the wifi device
            - If direction is `DLUL`
                - Start the iperf server and client on both the wifi and eth devices
        3. Start the sniffer on the sniffer device
            - Based on the output option, create a folder on the sniffer device with the name of the output
        4. Based on the store option
            - If store is `local`
                - Do nothing
            - If store is `tftp`
                - Upload the pcap file to the tftp server
        5. Return the path to the pcap file
    """
    yield nice_print("Extracting config", type='info')
    yield nice_print("Extracting device configs", type='section')
    device_wifi = config.device_wifi
    device_eth = config.device_eth
    device_sniffer = config.device_sniffer
    device_tftp = config.device_tftp
    devices = [device_wifi, device_eth, device_sniffer, device_tftp]
    for device in devices:
        yield nice_print(f"Device {device.ip} extracted")
    yield nice_print("Extracting iperf commands", type='section')
    server_commands = config.server_commands
    station_commands = config.station_commands
    time.sleep(1)
    yield nice_print(f"Server command count: {len(server_commands)}")
    for command in server_commands:
        yield nice_print(f"Server command {command.command} extracted")
    yield nice_print(f"Station command count: {len(station_commands)}")
    for command in station_commands:
        yield nice_print(f"Station command {command.command} extracted")
    yield nice_print("Extracting options", type='section')
    time.sleep(1)
    tftp = config.options.tftp
    output_folder = config.options.output_folder
    direction = config.options.direction
    options = [tftp, output_folder, direction]
    for option in options:
        yield nice_print(f"Option {option} extracted")
    yield nice_print("Extracting config complete", type='info')
    yield nice_print("Generating iperf commands", type='section')
    time.sleep(1)
    if direction == 'DL':
        yield nice_print("Starting iperf server on wifi device", type='info')
        yield nice_print("Starting iperf client on eth device", type='info')
    elif direction == 'UL':
        yield nice_print("Starting iperf server on eth device", type='info')
        yield nice_print("Starting iperf client on wifi device", type='info')
    elif direction == 'DLUL':
        yield nice_print("Starting iperf server and client on wifi device", type='info')
        yield nice_print("Starting iperf server and client on eth device", type='info')
    yield nice_print("Starting sniffer on sniffer device", type='info')
    yield nice_print("Generating iperf commands complete", type='info')
    if tftp:
        yield nice_print("Storing pcap locally", type='info')
    else:
        yield nice_print("Storing pcap on tftp server", type='info')
    yield nice_print("QBV test complete", type='section')
    yield nice_print("Returning path to pcap file", type='info')
    random_int = random.randint(0, 3)
    yield f"\n\n[Download](http://localhost:8000/download/{random_int}.pcap?delete=true)\n\n"
    yield f"[clear everything](/demo/?text=)"


def execute_qbv(config: QBVconfig):
    # Get the options from the config.options
    device_wifi = config.device_wifi
    device_eth = config.device_eth
    device_sniffer = config.device_sniffer
    device_tftp = config.device_tftp
    server_commands = config.server_commands
    station_commands = config.station_commands
    tftp = config.options.tftp
    direction = config.options.direction
    output_folder = config.options.output_folder
    ap_commands = config.ap_commands
    ap_connection = config.ap_connection

    # For each config.commands, create a process
    processes: List[Process] = []
    device_processes = []
    results = Queue()

    yield nice_print(f"Performing {direction} test", type='h1')

    yield nice_print("Starting config AP Qbv gate", type='h2')

    set_ap_qbv_gate(ap_connection, ap_commands, nice_print)

    time.sleep(1)

    yield nice_print("Done config AP Qbv gate", type='h2')

    for server_command in server_commands:
        type = server_command.type
        yield nice_print(f"Starting {type} server", type='h2')
        c = server_command.command
        if direction == 'DL':
            device_processes.append(
                (device_wifi.ip, device_wifi.username, device_wifi.password, c, 'server'))
        elif direction == 'UL':
            device_processes.append(
                (device_eth.ip, device_eth.username, device_eth.password, c, 'server'))
        elif direction == 'DLUL':
            device_processes.append(
                (device_wifi.ip, device_wifi.username, device_wifi.password, c, 'server'))
            device_processes.append(
                (device_eth.ip, device_eth.username, device_eth.password, c, 'server'))

    for station_command in station_commands:
        type = station_command.type
        yield nice_print(f"Starting {type} station", type='h2')
        c = station_command.command
        if direction == 'DL':
            device_processes.append(
                (device_eth.ip, device_eth.username, device_eth.password, c, 'station'))
        elif direction == 'UL':
            device_processes.append(
                (device_wifi.ip, device_wifi.username, device_wifi.password, c, 'station'))
        elif direction == 'DLUL':
            device_processes.append(
                (device_wifi.ip, device_wifi.username, device_wifi.password, c, 'station'))
            device_processes.append(
                (device_eth.ip, device_eth.username, device_eth.password, c, 'station'))

    # Create sniffer process, both wifi and eth

    process_wifi_sniffer = threading.Thread(target=start_wifi_sniffer, args=(
        device_sniffer.ip, device_sniffer.username, device_sniffer.password, device_tftp.ip, device_tftp.username, device_tftp.password, tftp, output_folder, results))
    process_eth_sniffer = threading.Thread(target=start_eth_sniffer, args=(
        device_eth.ip, device_eth.username, device_eth.password, device_tftp.ip, device_tftp.username, device_tftp.password, tftp, output_folder, results))

    # Start the sniffer process

    process_wifi_sniffer.daemon = True
    process_eth_sniffer.daemon = True

    process_wifi_sniffer.start()
    process_eth_sniffer.start()

    # reverse the list so that the sniffer is started last

    for device in device_processes:
        device_ip, device_username, device_password, device_command, device_type = device
        yield nice_print(f"Starting {device_command} on {device_ip}")
        process = threading.Thread(target=run_thread, kwargs={
            'device_ip': device_ip,
            'device_user': device_username,
            'device_pw': device_password,
            'command': device_command,
            'queue': results,
        })
        process.daemon = True
        if device_type == 'station':
            time.sleep(1)
        process.start()
        processes.append(process)
    while True:
        while not results.empty():
            result = results.get()
            yield nice_print(result)
            # do something with the result
        if all([not t.is_alive() for t in processes]):
            break
    # Join all processes
    time.sleep(1)

    for process in processes:
        process.join()

    # Join sniffer processes

    process_wifi_sniffer.join()
    process_eth_sniffer.join()

    yield nice_print("All processes finished", type='h1')


async def test_ssh():
    device_config = Config(overrides={"sudo": {
        "password": 'Oculus'}, 'connect_kwargs': {'password': 'Oculus'}})
    print(f"\n\t======\tTesting SSH \t======\t")
    conn = Connection('192.168.1.44', user='OculusPC', config=device_config)
    print(f"Connecting to {'192.168.1.44'} using {'OculusPC'} and {'Oculus'}")

    output = (conn.run(f"ipconfig", hide=True))
    yield(output.stdout)

    output = (conn.run(
        f"C:\\Users\\OculusPC\\Desktop\\iPerf3\\iperf3.exe -c 192.168.1.35 -i 1 -t 5 -b 1Mb", hide=True))
    yield(output.stdout)
    yield(f"\n\t======\tDone\t======\t")
    conn.close()
