const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Allow the server to receive JSON data
app.use(express.json());

// Serve your existing HTML, CSS, JS and assets
app.use(express.static(__dirname));

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`Aurora Cakes server running at http://localhost:${PORT}`);
});