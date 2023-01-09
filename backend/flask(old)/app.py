from flask import Flask, request, render_template
from netmiko import ConnectHandler
import re

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/command", methods=["POST"])
def command():
    devices = []
    for i in range(1, int(request.form["device_count"]) + 1):
        devices.append({
            "device_type": "cisco_ios",
            "host": request.form[f"device_{i}_hostname"],
            "username": request.form[f"device_{i}_username"],
            "password": request.form[f"device_{i}_password"],
        })
    print(devices)
    commands = request.form["commands"]  # A textarea with multiple lines
    print(commands)
    output = {}
    for device in devices:
        print(f'Connecting to {device["host"]}')
        with ConnectHandler(**device) as ssh:
            for command in commands.split("\n"):
                print(f'Executing command: {command} on {device["host"]}')
                # append the output to the dictionary with the key being the hostname
                if device["host"] not in output:
                    output[device["host"]] = []
                output_command = ssh.send_command(command)
                output[device["host"]].append({
                    "command": command,
                    # trim the spaces and tabs from the output
                    "output": output_command
                })

    return render_template("result.html", output=output)


if __name__ == "__main__":
    app.run(debug=True)
