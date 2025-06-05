import * as http from 'http';
import * as WebSocket from 'ws';
import * as Y from 'yjs';
import * as syncProtocol from 'y-protocols/sync.js';
import * as awarenessProtocol from 'y-protocols/awareness.js';

// Create HTTP server
const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Collaborative Editor WebSocket Server');
});

// Map of document name to Y.Doc
const documents = new Map();

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws, req) => {
  console.log('Connection established');
  
  // Extract document ID from URL query parameters
  const url = new URL(req.url, 'http://localhost');
  const docId = url.searchParams.get('docId');
  
  if (!docId) {
    console.error('No document ID provided');
    ws.close();
    return;
  }
  
  // Get or create document
  let doc = documents.get(docId);
  if (!doc) {
    doc = new Y.Doc();
    documents.set(docId, doc);
  }
  
  // Initialize awareness (for user presence)
  const awareness = new awarenessProtocol.Awareness(doc);
  
  // Handle WebSocket messages
  ws.on('message', (message) => {
    const m = new Uint8Array(message);
    
    // Check message type
    const messageType = m[0];
    
    // Handle sync messages
    if (messageType === 0) {
      syncProtocol.readSyncMessage(m, 0, ws, doc);
    }
    
    // Handle awareness messages
    else if (messageType === 1) {
      awarenessProtocol.applyAwarenessUpdate(awareness, m.subarray(1), ws);
    }
  });
  
  // Send document state when client connects
  const encoder = new TextEncoder();
  const initMessage = syncProtocol.encodeStateAsUpdate(doc);
  ws.send(initMessage);
  
  // Clean up on WebSocket close
  ws.on('close', () => {
    console.log('Connection closed');
    awarenessProtocol.removeAwarenessStates(awareness, [ws.userId], 'connection closed');
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});