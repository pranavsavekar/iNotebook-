const connectToMongo = require("./db");
const express = require('express')
var cors = require('cors')

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

//Available
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// Connect to MongoDB and Start the Server
const startServer = async () => {
  try {
      await connectToMongo(); // Ensure MongoDB is connected
      console.log("Connected to MongoDB!");

      app.listen(port, () => {
          console.log(`iNotbook backend listening on http://localhost:${port}`);
      });
  } catch (error) {
      console.error("Failed to connect to MongoDB:", error.message);
      process.exit(1); // Exit with failure if MongoDB connection fails
  }
};

startServer();
