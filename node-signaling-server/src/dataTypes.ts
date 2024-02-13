export type User = {
	username: string;
	userId: string;
};

export type PeerInfo = {
	user: User;
	peerConnection: RTCPeerConnection;
};

// Generic base type for signaling messages
export type SignalingMessage<T> = {
	type: string;
	local: User;
	target: User;
} & T;

// Specific types using the base type with a differentiating field
export type SignalingCandiate = SignalingMessage<{
	candidate: RTCIceCandidate;
}>;

export type SignalingOffer = SignalingMessage<{
	offer: RTCSessionDescriptionInit;
}>;

export type SignalingAnswer = SignalingMessage<{
	answer: RTCSessionDescriptionInit;
}>;

export type SignalingRoom = {
	rooms: Room[];
};

export type SignalingData =
	| SignalingRoom
	| SignalingMessage<SignalingCandiate | SignalingOffer | SignalingAnswer>;

export type Room = {
	id: string;
	name: string;
	users?: string[];
};
