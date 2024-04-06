// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000; // Use port 5000 by default

const corsOptions = {
  origin: "http://localhost:8081", // Replace with your frontend URL
  //origin: '*', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify the allowed HTTP methods
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


// Define routes and API endpoints here
// POST a new item
app.post('/api/items', async (req, res) => {
  try {
    //const newItem = req.body; // Get data from request body
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

// GET all items
//app.get('/api/items',  (req, res) => {
//// Implement logic to fetch all items from the database
//res.json({ message: 'Get all items' });
//});

// GET user-specific data
app.get('/api/items', async (req, res) => {
  try {
    // Extract userId from the query parameters
    const userId = req.query.userId;
    const db = admin.firestore();
    const userSpecificData = await db.collection('items').where('userId', '==', userId).get();
    //console.log(userSpecificData);

    // Extract data from query snapshot and format as needed
    //const formattedData = userSpecificData.docs.map(doc => doc.data());
    const formattedData = userSpecificData.docs.map(doc => ({
      itemId: doc.id,
      ...doc.data()
    }));

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


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

