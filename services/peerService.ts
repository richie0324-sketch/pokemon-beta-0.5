
import { Peer, DataConnection } from "peerjs";
import { PeerMessage } from '../types';

export type PeerStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR';
export type { PeerMessage };

class PeerService {
    private peer: Peer | null = null;
    private conn: DataConnection | null = null;
    public myId: string = ''; 
    private heartbeatInterval: number | null = null;
    private lastHeartbeat: number = 0;
    
    // Callbacks
    private onStatusChange: ((status: PeerStatus, msg?: string) => void) | null = null;
    private onDataReceived: ((data: PeerMessage, peerId: string) => void) | null = null;

    constructor() {
        // Singleton
    }

    init(onId: (id: string) => void, onStatus: (s: PeerStatus, m?: string) => void, onData: (d: PeerMessage, pid: string) => void) {
        this.onStatusChange = onStatus;
        this.onDataReceived = onData;

        if (this.peer) this.peer.destroy();
        this.stopHeartbeat();

        this.peer = new Peer();

        this.onStatusChange('CONNECTING', 'Connecting to Server...');

        this.peer.on('open', (id) => {
            this.myId = id;
            onId(id);
            this.onStatusChange?.('DISCONNECTED', 'Ready');
        });

        this.peer.on('connection', (connection) => {
            this.handleConnection(connection);
        });

        this.peer.on('error', (err) => {
            console.error("Peer Error", err);
            this.onStatusChange?.('ERROR', 'Connection Error: ' + err.type);
        });
    }

    connectToPeer(hostId: string) {
        if (!this.peer) return;
        this.onStatusChange?.('CONNECTING', `Dialing...`);
        
        const conn = this.peer.connect(hostId);
        this.handleConnection(conn);
    }

    private handleConnection(conn: DataConnection) {
        this.conn = conn;

        conn.on('open', () => {
            this.onStatusChange?.('CONNECTED', `Connected`);
            this.startHeartbeat();
        });

        conn.on('data', (data) => {
            const msg = data as PeerMessage;
            if (msg.type === 'HEARTBEAT') {
                this.lastHeartbeat = Date.now();
                return;
            }
            if (this.onDataReceived) {
                this.onDataReceived(msg, conn.peer);
            }
        });

        conn.on('close', () => {
            this.conn = null;
            this.stopHeartbeat();
            this.onStatusChange?.('DISCONNECTED', 'Disconnected');
        });
        
        conn.on('error', (err) => {
            console.error("Conn Error", err);
            this.onStatusChange?.('ERROR', 'Connection Failed');
        });
    }

    private startHeartbeat() {
        this.stopHeartbeat();
        this.lastHeartbeat = Date.now();
        this.heartbeatInterval = window.setInterval(() => {
            if (this.conn && this.conn.open) {
                this.conn.send({ type: 'HEARTBEAT', payload: {} });
                
                // Check if peer is dead (no heartbeat for 10s)
                if (Date.now() - this.lastHeartbeat > 10000) {
                    console.warn("Peer heartbeat lost — closing connection");
                    this.onStatusChange?.('ERROR', 'Connection lost: peer stopped responding');
                    this.conn.close();
                }
            }
        }, 2000);
    }

    private stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    send(msg: PeerMessage) {
        if (this.conn && this.conn.open) {
            this.conn.send(msg);
        } else {
            console.warn("Cannot send, no connection open");
        }
    }

    disconnect() {
        this.stopHeartbeat();
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
