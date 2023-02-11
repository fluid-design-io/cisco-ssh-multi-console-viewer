import os
import tarfile
import shutil
from fastapi import UploadFile
import fileinput


def swap_version_text(file_name, newImageVersion):
    """ 
    Example of info.ver file:
    image_family: ap1g6a
    ws_management_version: 17.10.0.181
    info_end:
    altboot_fallback: 1

    """
    file_path = os.path.join("temp", file_name)
    with fileinput.FileInput(file_path, inplace=True) as file:
        for line in file:
            if line.startswith("ws_management_version"):
                print(f"ws_management_version: {newImageVersion}")
            else:
                print(line, end='')
    return


def ap_version_convert(file: UploadFile, newImageVersion, new_file_name) -> str:
    # delete temp folder if exists
    if os.path.exists("temp"):
        shutil.rmtree("temp")

    os.mkdir("temp")

    contents = file.file.read()

    with open("temp.tar", "wb") as f:
        f.write(contents)

    tar = tarfile.open("temp.tar")
    # if file is not a tar file or is empty, quit
    if not tar or tar.members == []:
        print("No tar file found")
        return
    # extract all files and create a temp folder
    tar.extractall(path="temp")
    # swap info.ver and info file
    swap_version_text("info.ver", newImageVersion)
    swap_version_text("info", newImageVersion)
    # open tar file and create a new tar file named with today's date + version text
    print("Creating new tar file")
    # check if 'output' folder exists, if not, create it
    if not os.path.exists("output"):
        os.mkdir("output")

    if not os.path.exists('output/ap-convert'):
        os.makedirs('output/ap-convert')

    output_path = os.path.join("output", "ap-convert", new_file_name)
    tar = tarfile.open(output_path, "w")
    # for each file in the temp folder, add it to the new tar file
    print("Adding files to new tar file")
    for file in os.listdir('temp'):
        file_path = os.path.join("temp", file)
        tar.add(file_path, arcname=file)
    # close tar file
    tar.close()
    # remove temp folder
    shutil.rmtree('temp')

    # Delete the temporary file after it's been used
    os.remove("temp.tar")

    return output_path
