fetch('/api/detect-ddos?numPackets=10000&numIps=100&numTests=100&verbose=true')
    .then(response => response.json())
    .then(data => {
        console.log('DDoS Detection Results:', data);
        // Display results in the frontend
    })
    .catch(error => console.error('Error:', error));
