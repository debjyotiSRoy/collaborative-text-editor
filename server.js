// server.js
// Import required modules
const http = require('http')
const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');

// Create Express app
const app = express();
const server = http.createServer(app);

// Create Socket.IO instance and attach it to the server
const io = socketIo(server, {
  cors: { origin: "*" }
});

// Define a map to store connected users for each document
const documentUsersMap = new Map();
// Define a new Map to store socket.ids and corresponding userIds
const socketUserMap = new Map();

// Define WebSocket event handlers
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle user joining a document editing session
  socket.on('join', ({ documentId, userId }) => {
    // Add the user to the document's connected users list
    if (!documentUsersMap.has(documentId)) {
      documentUsersMap.set(documentId, new Set());
    }
    documentUsersMap.get(documentId).add(userId);

    // Store the mapping of socket.id to userId
    socketUserMap.set(socket.id, userId);

    // Notify other users that a new user has joined
    socket.broadcast.emit('userJoined', { documentId, userId });

    // Emit the list of connected users to the newly joined user
    const connectedUsers = Array.from(documentUsersMap.get(documentId));
    socket.emit('connectedUsers', connectedUsers);
  });

  // Handle sending changes from client to server
  socket.on('sendChanges', ({ documentId, lastLocalChange, doc }) => {
    console.log('changes received by server:', lastLocalChange, " for document: ", documentId);
    // Broadcast the changes to all connected clients except the sender
    socket.broadcast.emit('remoteChanges', { documentId, lastLocalChange, doc });
  });

  // Handle user leaving a document editing session
  socket.on('disconnect', () => {
    console.log('A user disconnected:');
    disconnectedUser = socketUserMap.get(socket.id);
    console.log('the userId of the disconnected user:', disconnectedUser);
    // Find and remove the user from all document connected users lists
    for (const [documentId, connectedUsers] of documentUsersMap.entries()) {
      console.log('connectedUsers:', connectedUsers);
      if (connectedUsers.has(disconnectedUser)) {
        connectedUsers.delete(disconnectedUser);
        // Notify other users that a user has left
        socket.broadcast.emit('userLeft', { documentId, userId: disconnectedUser });
        break;
      }
    }
  });

});

const corsOptions = {
  //origin: "http://localhost:8081", // Replace with your frontend URL
  //origin: "http://10.200.125.71:8081", // Replace with your frontend URL
  origin: '*', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Specify the allowed HTTP methods
  allowedHeaders: ["Content-Type", "X-Auth-Token", "Origin", "Authorization"],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./doc-db-270ee-firebase-adminsdk-e5h7h-670dd8a558.json'); // Replace with your service account key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://Google-Doc-DB.firebaseio.com' // Replace with your Firebase project URL
});


// Middleware
app.use(express.json()); // Parse JSON requests
//app.options('*', cors(corsOptions)); // Respond to all OPTIONS requests with CORS headers
app.use(cors(corsOptions));
// Enable CORS for all origins
//app.use(cors());

// Function to get user UID by email
async function getUserUidByEmail(email) {
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    return userRecord.uid;
  } catch (error) {
    console.error('Error fetching user UID by email:', error);
    return null; // Return null or handle error as needed
  }
}

// Define routes and API endpoints here
// POST a new item
/*
app.post('/api/items', async (req, res) => {
  try {
    const { userId, ...newItem } = req.body; // Extract userId and other data from request body
    const db = admin.firestore();
    const itemRef = await db.collection('items').add({
      ...newItem,
      userId: userId, // Include user ID in item document
    });

    res.status(201).json({ message: 'Item created successfully', itemId: itemRef.id });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});
*/

app.get('/', (req, res) => {
  res.status(201).json({msg: 'Hello'});
});

// POST a new item
app.post('/api/items', async (req, res) => {
  try {
    // Extract userId and other data from request body
    const { userId, ...newItem } = req.body;

    // Access Firestore database
    const db = admin.firestore();

    // Initialize userIds as an array with a single userId
    let userIds = [userId];

    // Check if userIds field already exists in the request body
    //if (req.body.userIds) {
      //// If userIds field exists, append the new userId to the existing list
      //userIds = [...req.body.userIds.split(','), userId];
    //}

    // Add a new item document to the Firestore collection 'items'
    const itemRef = await db.collection('items').add({
      ...newItem,
      //userIds: userIds.join(','), // Convert array of userIds to a comma-separated string
      userIds: userIds, // Convert array of userIds to a comma-separated string
    });

    // Send a success response with the ID of the newly created item
    res.status(201).json({ message: 'Item created successfully', itemId: itemRef.id });
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});



// GET user-specific data
app.get('/api/items', async (req, res) => {
  try {
    // Extract userId from the query parameters
    const userId = req.query.userId;
    console.log(userId);
    const db = admin.firestore();
    //const userSpecificData = await db.collection('items').where('userId', '==', userId).get();
    const userSpecificData = await db.collection('items').where('userIds', 'array-contains', userId).get();
    //console.log(userSpecificData);

    // Extract data from query snapshot and format as needed
    //const formattedData = userSpecificData.docs.map(doc => doc.data());
    const formattedData = userSpecificData.docs.map(doc => ({
      itemId: doc.id,
      ...doc.data()
    }));
    //console.log(formattedData);

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching user-specific data:', error);
    res.status(500).json({ error: 'Failed to fetch user-specific data' });
  }
});

// GET a specific item by ID
app.get('/api/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id; // Get the item ID from request parameters
        console.log(itemId);
        const db = admin.firestore();
        const itemDoc = await db.collection('items').doc(itemId).get();

        if (!itemDoc.exists) {
            // If the item does not exist, return a 404 Not Found response
            return res.status(404).json({ error: 'Item not found' });
        }

        // Return the item data in the response
        const itemData = itemDoc.data();
        return res.json(itemData);
    } catch (error) {
        console.error('Error fetching item:', error);
        return res.status(500).json({ error: 'Failed to fetch item' });
    }
});

// PATCH an existing item
app.patch('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get the document ID from the request parameters
        const { content } = req.body; // Get the updated content from the request body
        const db = admin.firestore();
        
        // Update the content field of the document with the specified ID
        await db.collection('items').doc(id).update({
            content: content
        });

        res.status(200).json({ message: 'Document content updated successfully' });
    } catch (error) {
        console.error('Error updating document content:', error);
        res.status(500).json({ error: 'Failed to update document content' });
    }
});


// PATCH an item to invite a user
app.patch('/api/items/invite/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const { email } = req.body;

    // Get the user ID corresponding to the email
    const invitedUserId = await getUserUidByEmail(email);
    if (!invitedUserId) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the item from Firestore
    const itemRef = admin.firestore().collection('items').doc(itemId);
    const itemDoc = await itemRef.get();
    if (!itemDoc.exists) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Update the userIds field to add the invited user ID
    const currentIds = itemDoc.data().userIds || [];
    const updatedIds = [...currentIds, invitedUserId];
    await itemRef.update({ userIds: updatedIds });

    return res.status(200).json({ message: 'Invitation sent successfully' });
  } catch (error) {
    console.error('Error inviting user:', error);
    return res.status(500).json({ error: 'Failed to invite user' });
  }
});


// Start server
const PORT = process.env.PORT || 5000; // Use port 5000 by default
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

