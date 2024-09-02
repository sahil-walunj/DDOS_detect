function runDdosDetection(numPackets = 10000, numIps = 100, numTests = 100, verbose = false) {
    const normalTraffic = sendPackets(numPackets, numIps, false);
    const attackTraffic = sendPackets(numPackets, numIps, true);

    const normalEntropy = computeEntropy(normalTraffic);
    const attackEntropy = computeEntropy(attackTraffic);

    const thresholdEntropy = (normalEntropy + attackEntropy) / 2;
    
    const accuracy = findAccuracy(numTests, numPackets, numIps, thresholdEntropy, verbose);
    
    return {
        normalEntropy: normalEntropy.toFixed(4),
        attackEntropy: attackEntropy.toFixed(4),
        thresholdEntropy: thresholdEntropy.toFixed(4),
        accuracy: (accuracy * 100).toFixed(2) + '%'
    };
}
