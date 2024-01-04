// server/app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const winston = require('winston');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = 3000;

// Configure winston logger
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' })
    ]
});

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Serve static files from the 'public' folder (if needed)
app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());

const databaseport = 27017;
const tempDatabase = "designio";

mongoose.connect(`mongodb://localhost:${databaseport}/${tempDatabase}`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(error => {
        logger.error('Error connecting to MongoDB:', error);
    });

// Render index.ejs when a request is made to the root route
app.get('/', (req, res) => {
  res.render('index');
});



app.all('/getAllDatabaseList', async (req, res) => {
    try {
        const adminDb = mongoose.connection.useDb('admin');
        const databaseList = await adminDb.db.admin().listDatabases();
        const adminDatabaseExists = databaseList.databases.some(db => db.name === 'admin');

        if (!adminDatabaseExists) {
            await adminDb.createCollection('dummyCollection');
        }

        const allDbList = await mongoose.connection.db.admin().listDatabases();
        const databaseNames = allDbList.databases.map(db => db.name);

        res.json(databaseNames);
    } catch (error) {
        console.error('Error getting database list:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/getAllDatabaseListWithCollections', async (req, res) => {
    try {
        const adminDb = mongoose.connection.useDb('admin');
        const databaseList = await adminDb.db.admin().listDatabases();
        const databaseNames = databaseList.databases.map(db => db.name);

        const databasesWithCollections = await Promise.all(databaseNames.map(async dbName => {
            const database = mongoose.connection.useDb(dbName);
            await database.modelNames();
            const collections = await database.db.listCollections().toArray();
            const collectionNames = collections.map(collection => collection.name);
            return { [dbName]: collectionNames };
        }));

        res.json(databasesWithCollections);
    } catch (error) {
        logger.error('Error getting database list with collections:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/getCollectionByDatabase', async (req, res) => {
    try {
        const databaseName = req.body.dbname;

        if (!databaseName) {
            return res.status(400).json({ error: 'Database name is missing in the query parameters.' });
        }

        const database = mongoose.connection.useDb(databaseName);
        await database.modelNames();
        const collections = await database.db.listCollections().toArray();
        const collectionNames = collections.map(collection => collection.name);

        res.json({ collections: collectionNames });
    } catch (error) {
        logger.error('Error getting collection list by database:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/createCollection', async (req, res) => {
    try {
        const { dbname, collectionname } = req.body;

        if (!dbname || !collectionname) {
            return res.status(400).json({ error: 'Database name and collection name are required in the request body.' });
        }

        const database = mongoose.connection.useDb(dbname);
        await database.db.createCollection(collectionname);

        res.json({ success: true, message: `Collection '${collectionname}' created in database '${dbname}'` });
    } catch (error) {
        logger.error('Error creating collection:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/createDatabaseAndCollection', async (req, res) => {
    try {
        const { dbname, collectionname } = req.body;

        if (!dbname || !collectionname) {
            return res.status(400).json({ error: 'Database name and collection name are required in the request body.' });
        }

        const newDbConnection = mongoose.createConnection(`mongodb://localhost:${databaseport}/${dbname}`, { useNewUrlParser: true, useUnifiedTopology: true });
        await newDbConnection.db.createCollection(collectionname);

        res.json({ success: true, message: `Database '${dbname}' and collection '${collectionname}' created` });
    } catch (error) {
        logger.error('Error creating database and collection:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/connectToHost', (req, res) => {
    res.json({ success: true });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
