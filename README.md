# AllSpark

```
NOTE: This Repo is Under Construction.
It is Advised to Not Copy Codes From Here Unless You Know What is Happening.
Because You cannot Complain if it not works as of now :)
```

## - Description
An Open Source Online Coding platform




##  Running Steps 

- ### First of All Your Docker Should be Installed & IPv6 Enabled
    Enable IPv6 in the Docker daemon if you haven’t already. This is typically done by editing /etc/docker/daemon.json and adding:

    ```
    {
    "ipv6": true,
    "fixed-cidr-v6": "2001:db8:1::/64"
    }

    ```
    <br />

    Then restart the Docker daemon:

    ```
    sudo systemctl restart docker

    ```



    <br />
    <br />

- ### Then Edit the "main.conf" file Steps Written into that
    <br />
    <br />

- ### Then Run These Commands Below & Have a Cup of Chai ☕ 
    These Commands will run everything for you and You have to just wait while these commands finishes there tasks 
    ```
    docker-compose -f compose.dev.yaml up -d zookeeper
    sleep 20s
    docker-compose -f compose.dev.yaml up -d redis kafka
    sleep 20s
    docker-compose -f compose.dev.yaml up
    ```
    <br />
    
    <br />
    <br />

- ### Access the App 
    ```
    // Frontend 
    http://localhost:5173

    // Backend
    http://localhost:8000
    ```

