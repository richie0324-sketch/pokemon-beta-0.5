
import { Peer, DataConnection } from "peerjs";
import { PeerMessage } from '../types';

export type PeerStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR';
export type { PeerMessage };

class PeerService {
    private peer: Peer | null = null;
    private conn: DataConnection | null = null;
    public myId: string = ''; // Made public for easier access if needed
    
    // Callbacks
    private onStatusChange: ((status: PeerStatus, msg?: string) => void) | null = null;
    // UPDATED: Now provides the sender's Peer ID alongside the data
    private onDataReceived: ((data: PeerMessage, peerId: string) => void) | null = null;

    constructor() {
        // Singleton pattern handled by export
    }

    // Initialize as Host or Guest (get an ID from PeerServer)
    init(onId: (id: string) => void, onStatus: (s: PeerStatus, m?: string) => void, onData: (d: PeerMessage, pid: string) => void) {
        this.onStatusChange = onStatus;
        this.onDataReceived = onData;

        // Clean up previous
        if (this.peer) this.peer.destroy();

        // Create Peer. 
        this.peer = new Peer();

        this.onStatusChange('CONNECTING', 'Connecting to Global Server...');

        this.peer.on('open', (id) => {
            this.myId = id;
            onId(id);
            this.onStatusChange?.('DISCONNECTED', 'Ready to Connect');
        });

        this.peer.on('connection', (connection) => {
            this.handleConnection(connection);
        });

        this.peer.on('error', (err) => {
            console.error("Peer Error", err);
            this.onStatusChange?.('ERROR', err.message || 'Connection Error');
        });
    }

    // Connect to another peer (Host)
    connectToPeer(hostId: string) {
        if (!this.peer) return;
        this.onStatusChange?.('CONNECTING', `Dialing ${hostId}...`);
        
        const conn = this.peer.connect(hostId);
        this.handleConnection(conn);
    }

    private handleConnection(conn: DataConnection) {
        this.conn = conn;

        conn.on('open', () => {
            this.onStatusChange?.('CONNECTED', `Connected to ${conn.peer}`);
        });

        conn.on('data', (data) => {
            if (this.onDataReceived) {
                // PASS THE CONNECTION PEER ID CORRECTLY
                this.onDataReceived(data as PeerMessage, conn.peer);
            }
        });

        conn.on('close', () => {
            this.conn = null;
            this.onStatusChange?.('DISCONNECTED', 'Connection Closed');
        });
        
        conn.on('error', (err) => {
            console.error("Conn Error", err);
            this.onStatusChange?.('ERROR', 'Connection Lost');
        });
    }

    send(msg: PeerMessage) {
        if (this.conn && this.conn.open) {
            this.conn.send(msg);
        } else {
            console.warn("Cannot send, no connection");
        }
    }

    disconnect() {
        if (this.conn) this.conn.close();
        if (this.peer) this.peer.destroy();
        this.peer = null;
        this.conn = null;
    }

    isConnected(): boolean {
        return !!this.conn && this.conn.open;
    }
}

export const peerService = new PeerService();
