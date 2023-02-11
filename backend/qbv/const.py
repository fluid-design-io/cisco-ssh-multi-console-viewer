import os
from dotenv import load_dotenv

load_dotenv()

NUC1_SUDO_PW = os.getenv('NUC1_SUDO_PW')  # Wired
NUC2_SUDO_PW = os.getenv('NUC2_SUDO_PW')  # WiFi
NUC3_SUDO_PW = os.getenv('NUC3_SUDO_PW')  # Sniffer

NUC1_IP = os.getenv('NUC1_IP')
NUC2_IP = os.getenv('NUC2_IP')
NUC3_IP = os.getenv('NUC3_IP')

TFTP_IP = os.getenv('TFTP_IP')
TFTP_PW = os.getenv('TFTP_PW')
