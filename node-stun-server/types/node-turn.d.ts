// Inside types/node-turn.d.ts
declare module 'node-turn' {
	export interface TurnServerOptions {
	  listeningPort?: number;
	  listeningIps?: string[];
	  relayIps?: string[];
	  externalIps?: { [key: string]: string } | string;
	  minPort?: number;
	  maxPort?: number;
	  authMech?: string;
	  credentials?: { [username: string]: string };
	  realm?: string;
	  debugLevel?: string;
	  maxAllocateLifetime?: number;
	  defaultAllocatetLifetime?: number;
	  debug?: (debugLevel: string, message: string) => void;
	}
  
	class TurnServer {
	  constructor(options: TurnServerOptions);
	  start(): void;
	  stop(): void;
	  addUser(username: string, password: string): void;
	  removeUser(username: string): void;
	}
  
	export = TurnServer;
  }
  