module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     },
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      gasprice:1,
      token:'ETH',
      showTimeSpent: true,
    }
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.17", 
      settings: {        
        optimizer: {
          enabled: false,
          runs: 200
        },
      }
    }
  }
};
