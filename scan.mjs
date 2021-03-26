import EddystoneBeaconScanner from '@abandonware/eddystone-beacon-scanner'

// Code is duplicated from Dan Jackson practicals from CSC8604 Module     

// Used to find and determine unique IDs of MicroBits to be used as filters in server.mjs

const filter = [
    ''  // Put your ID in this string
]

EddystoneBeaconScanner.on('updated', (beacon) => {
    if (filter.join() && !filter.includes(beacon.id)) return
    console.log('Updated: ' + beacon.id + ' - ' + beacon.url);
});

EddystoneBeaconScanner.startScanning(true)