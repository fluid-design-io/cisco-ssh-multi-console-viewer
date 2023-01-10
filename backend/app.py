from typing import List
import fastapi
from pydantic import BaseModel
from netmiko import ConnectHandler
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import multiprocessing

app = fastapi.FastAPI()


class Device(BaseModel):
    hostname: str
    username: str
    password: str


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
    with multiprocessing.Pool(4) as pool:
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
    }
    with ConnectHandler(**conn) as ssh:
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


# Run the app


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
