from typing import List
from fastapi import FastAPI, File, UploadFile, Form, Response, Request
from fastapi.responses import FileResponse
from pydantic import BaseModel
from netmiko import ConnectHandler
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import multiprocessing
from lib.ap_version_convert import ap_version_convert

from qrcode import make, QRCode
from qrcode.constants import ERROR_CORRECT_L
from typing import Dict

app = FastAPI()


# This class represents a device. It contains its hostname, username, and password.
class Device(BaseModel):
    hostname: str
    username: str
    password: str
    secret: str


class ExecuteCommand(BaseModel):
    commands: str
    devices: List[Device]


origins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/execute")
def execute_command(execute_commands: ExecuteCommand):
    output = {}
    device_list = execute_commands.devices
    commands = execute_commands.commands
    print(device_list)

    # Create a list of tuples, where each tuple contains the arguments
    # for a call to `execute_command_on_device`
    device_commands_pairs = [(device, commands) for device in device_list]

    # Create a pool of workers with 4 processes
    with multiprocessing.Pool(10) as pool:
        # Map the `execute_command_on_device` function over the list of tuples
        results = pool.starmap(execute_command_on_device,
                               device_commands_pairs)

    # Merge the results into a single dictionary
    for result in results:
        output.update(result)

    return output


def execute_command_on_device(device, commands):
    # Create a dictionary to store the output for this device
    device_output = {}
    print(f'Connecting to {device.hostname}')
    conn = {
        "device_type": "cisco_ios",
        "host": device.hostname,
        "username": device.username,
        "password": device.password,
        "secret": device.secret,  # enable password
    }
    with ConnectHandler(**conn) as ssh:
        ssh.enable()
        for command in commands.split("\n"):
            print(f'Executing command: {command} on {device.hostname}')
            # append the output to the dictionary with the key being the hostname
            if device.hostname not in device_output:
                device_output[device.hostname] = []
            output_command = ssh.send_command(command)
            device_output[device.hostname].append({
                "command": command,
                # trim the spaces and tabs from the output
                "output": output_command
            })
    return device_output


@app.post("/ap-convert", response_class=FileResponse)
async def upload(file: UploadFile, newFileName: str = Form(), newImageVersion: str = Form(), versionTemplate: str = Form()) -> Response:

    return ap_version_convert(file, newImageVersion, newFileName)


@app.get("/download/{file_name}")
async def download_file(file_name: str, folder: str = "output"):
    file_path = f"{folder}/{file_name}"
    return FileResponse(file_path, media_type="application/octet-stream", filename=file_name)


@app.post("/qr-code/")
async def create_qr_code(data: str, options: Dict[str, str] = {}):
    qr = QRCode(error_correction=ERROR_CORRECT_L,
                box_size=10, border=5
                )
    qr.add_data(data)
    qr.make(fit=True)

    if 'color' not in options:
        options['color'] = "black"
    if 'bg' not in options:
        options['bg'] = "white"
    if 'format' not in options:
        options['format'] = "png"
    img = qr.make_image(
        back_color=options['bg'], fill_color=options['color'])
    if options['format'] == "png":
        img_file = img.save("qr.png")
        return FileResponse("qr.png", media_type="image/png", filename="qr.png")
    elif options['format'] == "svg":
        img_file = img.save("qr.svg")
        return FileResponse("qr.svg", media_type="image/svg+xml", filename="qr.svg")
    else:
        return "Invalid format"


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
