const crypto = require('crypto');

// Function to simulate sending data packets
function sendPackets(numPackets, numIps, attack = false) {
    const ipAddresses = Array.from({ length: numIps }, (_, i) => `192.168.0.${i + 1}`);
    
    if (attack) {
        // During an attack, most traffic comes from a few IPs
        const attackIps = ipAddresses.slice(0, Math.max(1, Math.floor(numIps / 10)));
        return Array.from({ length: numPackets }, () => attackIps[Math.floor(Math.random() * attackIps.length)]);
    } else {
        // Normal traffic has a more even distribution
        return Array.from({ length: numPackets }, () => ipAddresses[Math.floor(Math.random() * numIps)]);
    }
}

// Function to compute entropy
function computeEntropy(traffic) {
    const totalPackets = traffic.length;
    if (totalPackets === 0) return 0; // Avoid division by zero
    
    const ipCount = traffic.reduce((acc, ip) => {
        acc[ip] = (acc[ip] || 0) + 1;
        return acc;
    }, {});

    const entropy = Object.values(ipCount).reduce((acc, count) => {
        const p = count / totalPackets;
        return acc - p * Math.log2(p);
    }, 0);

    return entropy;
}

// Function to classify traffic based on entropy
function detectDdos(traffic, thresholdEntropy) {
    const entropy = computeEntropy(traffic);
    return entropy < thresholdEntropy ? "DDoS Attack Detected" : "Normal Traffic";
}

// Function to find detection accuracy
function findAccuracy(numTests, numPackets, numIps, thresholdEntropy, verbose = false) {
    let correctDetections = 0;
    
    for (let test = 0; test < numTests; test++) {
        [false, true].forEach(attack => {
            const traffic = sendPackets(numPackets, numIps, attack);
            const result = detectDdos(traffic, thresholdEntropy);
            const expected = attack ? "DDoS Attack Detected" : "Normal Traffic";
            if (result === expected) correctDetections += 1;

            if (verbose) {
                console.log(`Test ${test + 1}, Attack: ${attack}, Result: ${result}, Expected: ${expected}`);
            }
        });
    }

    return correctDetections / (2 * numTests);
}

// Main function to run the DDoS detection simulation
function runDdosDetection(numPackets = 10000, numIps = 100, numTests = 100, verbose = false) {
    // Simulate normal and attack traffic
    const normalTraffic = sendPackets(numPackets, numIps, false);
    const attackTraffic = sendPackets(numPackets, numIps, true);

    // Compute entropy for normal and attack scenarios
    const normalEntropy = computeEntropy(normalTraffic);
    const attackEntropy = computeEntropy(attackTraffic);

    // Set a threshold for detecting attacks
    const thresholdEntropy = (normalEntropy + attackEntropy) / 2;

    // Display results
    console.log(`Normal Entropy: ${normalEntropy.toFixed(4)}`);
    console.log(`Attack Entropy: ${attackEntropy.toFixed(4)}`);
    console.log(`Threshold Entropy: ${thresholdEntropy.toFixed(4)}`);
    
    const accuracy = findAccuracy(numTests, numPackets, numIps, thresholdEntropy, verbose);
    console.log(`Detection Accuracy: ${(accuracy * 100).toFixed(2)}%`);
}

// Example usage
runDdosDetection(10000, 100, 100, true);
