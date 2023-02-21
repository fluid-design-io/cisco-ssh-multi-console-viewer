# Cisco Lab Admin Essentials

## Introduction

A web app that allows you to automate many task in a beautiful effeciant way. It is built with Python FastAPI, Next.js, MUI and TailwindCSS.

## Installation

```
# Frontend
pnpm && pnpm build
pnpm start

# Backend
pip install -r requirements.txt
uvicorn app:app --reload
```

## Apps

| App                                                                                          | Description                                                                                        |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| SSH multi-console viewer                                                                     | A web-based SSH multi-console viewer that allows you to connect to multiple devices at once.       |
| A web-based SSH multi-console viewer that allows you to connect to multiple devices at once. | A web-based AP version converter that allows you to convert AP version from one format to another. |
| Qbv Test automation | Test Qbv automation with 5 devices at the same time, generating .pcap report and download to local machine/upload to tftp server in one click |

## Features

- Allows send same commands to multiple Cisco devices.
- Code templates to help you get actions you want right away.
- Code highlights: if a user input is needed, part of the code will highlight indicate user input with descriptions to better help user understand the purpose of the field.
- Multiprocess support, now the app can handle up to 4 devices at the same time.
- Generates beautiful results with table.
- Save outputs as txt, json, or csv format.
- Easy to copy and past results.
- Restore code upon refreshing the browser.
- Elegant UI & dark mode & mobile responsive.

## Demo Video

AP version converter

https://user-images.githubusercontent.com/13263720/213951107-c11ab5a1-a3b9-4175-aeec-08e32e840bd9.mp4

SSH multi-console viewer

https://user-images.githubusercontent.com/13263720/211260385-b7391be5-3dff-47e0-8b8b-50969060b4b2.mp4

Qbv validation tool



## Screenshot

![CleanShot 2023-01-08 at 23 11 22@2x](https://user-images.githubusercontent.com/13263720/211256635-9879606e-75ba-4ae2-93c1-f418d8bf0241.jpg)

![CleanShot 2023-02-19 at 02 27 29@2x](https://user-images.githubusercontent.com/13263720/219942415-413fcff2-aff3-4027-9d90-a179738b9d15.jpg)

![CleanShot 2023-02-21 at 00 28 51@2x](https://user-images.githubusercontent.com/13263720/220290149-461498af-7aea-4cff-98d0-4cd6b0ab265d.jpg)

![CleanShot 2023-01-08 at 23 43 10@2x](https://user-images.githubusercontent.com/13263720/211260452-7630a7a9-ad63-43e8-86bd-d6182ffac9a0.jpg)

![CleanShot 2023-01-10 at 00 16 30@2x](https://user-images.githubusercontent.com/13263720/211497489-6cbcfbf6-f267-4bb4-adfc-e59c886c612a.jpg)

![CleanShot 2023-01-08 at 23 12 38@2x](https://user-images.githubusercontent.com/13263720/211256767-bc96d407-91e5-4469-a8a7-eea59e35475e.jpg)
