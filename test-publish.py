#!/usr/bin/python
import re, json, datetime
import subprocess

def processVersionNum(version_string):
    version = version_string.split(".")
    for i in range(len(version)):
        version[i] = int(version[i])
    version.reverse()
    version[0] = version[0] + 1
    for i in range(len(version)):
        if version[i] > 999:
            version[i] = 0
            version[i+1] = version[i+1] + 1
    version.reverse()
    ver_num = '.'.join(str(x) for x in version)
    return ver_num

def getBuildCount(line):
    items = line.split(" ")
    build_count = items[-1]
    build_count = build_count.replace(";","")
    return int(build_count)


if __name__ == "__main__":
    # print(getBuildCount('const BUILD_COUNT = 28290;'))
    print ("Start update build count in constants/Constants.ts")
    with open('constants/Constants.ts') as f:
        lines = f.readlines()
        f.close()

    with open('constants/Constants.ts', 'w') as f:
        for line in lines:
            new_line = None
            if 'const BUILD_COUNT = ' in line:
                # print("found build count const")
                build_count = getBuildCount(line) + 1
                # print(build_count)
                new_line = 'const BUILD_COUNT = {};\n'.format(build_count)
                print(new_line)
                f.write(new_line)
            else:
                f.write(line)
        f.close()
    print ("Finish update build count in constants/Constants.ts")

    with open('app.json') as f:
        lines = f.readlines()
        f.close()

    with open('app.json', 'w') as f:
        for line in lines:
            new_line = None
            if '"release":' in line:
                new_line = '            "release":"test-background-fetch-app@{}"\n'.format(build_count)
                print(new_line)
                f.write(new_line)
            else:
                f.write(line)
        f.close()


    print ("Start publish app to testing channel")
    subprocess.call(['expo-cli', 'ph'])
    subprocess.call(['expo-cli', 'w'])
    subprocess.call(['expo-cli', 'publish', '--release-channel', 'testing'])
    subprocess.call(['expo-cli', 'ph'])
    print ("Publish to testing channel finished.")
