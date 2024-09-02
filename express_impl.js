const express = require('express');
const app = express();
const port = 3000;

const { runDdosDetection } = require('./ddosDetection'); // Import the detection logic

// Route to trigger DDoS detection
app.get('/api/detect-ddos', (req, res) => {
    const numPackets = parseInt(req.query.numPackets) || 10000;
    const numIps = parseInt(req.query.numIps) || 100;
    const numTests = parseInt(req.query.numTests) || 100;
    const verbose = req.query.verbose === 'true';

    // Run the DDoS detection logic
    const result = runDdosDetection(numPackets, numIps, numTests, verbose);
    
    // Send the result back to the frontend
    res.json(result);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
