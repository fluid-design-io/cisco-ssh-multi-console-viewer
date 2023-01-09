from typing import List
import fastapi
from pydantic import BaseModel
from netmiko import ConnectHandler
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = fastapi.FastAPI()


class Device(BaseModel):
    hostname: str
    username: str
    password: str


class ExecuteCommand(BaseModel):
    commands: str
    # A list of devices
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
    for device in device_list:
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
                if device.hostname not in output:
                    output[device.hostname] = []
                output_command = ssh.send_command(command)
                output[device.hostname].append({
                    "command": command,
                    # trim the spaces and tabs from the output
                    "output": output_command
                })
    return output

# Run the app


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
