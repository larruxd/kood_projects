## [Video](https://www.youtube.com/watch?v=HR5L9J0bkvQ)

### Is the student able to explain clearly what a port means?

A port is a communication endpoint for different applications and services to interact with each other over a network. They are identified by unique numbers ranging from 0 to 65535. When a device communicates over a network, data is sent from the sender device's specific port to a specific port on the recipient's device.

### Is the student able to explain clearly what port scanning means?

Port scanning is the process of probing a system or network to discover open ports. It's like trying door handles to see which ones are open.

### Is the student able to explain clearly why port scanning is important in pentesting?

It's important to identify potential entry points to your system or network. By finding open ports, you can discover what services are running on them, which may have vulnerabilities that could be exploited.

### Is the student able to explain clearly how their program works?

The program works by taking three arguments: protocol, IP, and port. It then creates a socket to try to connect to the specified port. If the connection is successful, it prints out that the port is open. If the connection throws an exception, it means the connection was not possible and it prints that the port is closed to the terminal. It's also possible to scan a range of ports. In that case, threads are used so that a number of ports can be checked simultaneously to make it more efficient.
