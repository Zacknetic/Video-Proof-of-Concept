import Turn from 'node-turn';

const serverOptions = {
	listeningPort: 3478, // TURN listener port for UDP (default is 3478 if not specified)
	listeningIps: ['0.0.0.0'], // Listen on all available IPs/interfaces
  //   relayIps: ['your-server-local-ip'], // Specify your server's local IP address here
  //   externalIps: {'your-server-local-ip': 'your-server-external-ip'}, // Specify if your server is behind a NAT
  //   minPort: 49152, // Lower bound of the UDP relay endpoints
  //   maxPort: 65535, // Upper bound of the UDP relay endpoints
	authMech: 'long-term', // TURN credential mechanism
	credentials: {
	  username: "password" // User accounts for credentials mechanisms
	},
	debugLevel: 'INFO' // Server log verbose level
};

const server = new Turn(serverOptions);
server.start();