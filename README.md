# AllSpark

An Open Source Online Coding platform

<br />
<br />

# Table of Contents
- [Running Steps](#running-steps)
- [Contributing](#contributing)
- [Credits](#credits)


Running Steps 
-------------


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
    These Commands will run everything for you and You have to just wait while these commands finishes there tasks. You have to just run all these commnands by copy & pasting to the terminal on the root folder of the Project i.e. '<b>all-spark</b>' folder and let the Magic begin :
    ```

    docker compose -f compose.dev.yaml up -d zookeeper 
    sleep 20s
    docker compose -f compose.dev.yaml up -d redis kafka 
    sleep 20s
    docker compose -f compose.dev.yaml up -d api
    sleep 20s 

    # If the below Command Get Stucked More than a Minute Then Press ( Ctrl + C ) to terminate and let the Other Process Complete and if anything breaks please report to us
    # If You See Something like: 'LEADER_NOT_AVAILABLE' or 'REQUEST_TIMED_OUT' && then 'Something went wrong while creating topics in kafka' then no need to worry about just hit  ( Ctrl + C ) and then let all the other commands run 

    docker exec -it all-spark-api-1 node temp.js
    sleep 20s
    docker compose -f compose.dev.yaml up --build -d
    sleep 20s


    # Fill the MongoDB with the Required Data Objects 

    cd config/db
    docker cp mera-mongo-data/users.json all-spark-db-1:/
    docker cp mera-mongo-data/permissions.json all-spark-db-1:/
    docker cp mera-mongo-data/problems.json all-spark-db-1:/
    cd ../../

    docker exec all-spark-db-1 mongoimport -d allSpark -c users --type json --file users.json
    docker exec all-spark-db-1 mongoimport -d allSpark -c permissions --type json --file permissions.json
    docker exec all-spark-db-1 mongoimport -d allSpark -c problems --type json --file problems.json

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



<br />
<br />


Contributing
------------

Ready to make your imaginations reality in our platform. Please Read our [CONTRIBUTING](CONTRIBUTING.md) Guidelines before making the Contribution to the project.


<br />
<br />


Credits
------------

- We do not own the name **AllSpark** and do not claim our right onto it. This name is taken from the Cartoon Series **Transformers Prime** and their owner company may have the right to use that name. We are using this name temporarily and this name may subject to change in future.

- We uses the <b>Judge0</b> as our Code Execution Engine. 
Please Visit: https://judge0.com/




<br />
<br />


## - License
We uses the [MIT](LICENSE) License. Please read the [LICENSE](LICENSE) file for more information.

<br />
<br />