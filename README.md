# USDx

### Install

```
npm install -g truffle
npm install -g ganache-cli
npm install
```

### Build

```
npm run build
```

### Test

```
npm run test
```

### Deploy

#### private network

Download `Ganache-cli` or `Ganache(GUI)`, start private network to simulation Ethereum network

```
truffle migrate
```

#### publick network

Sign up infura.io, save project id for configration of `truffle-config.js`

##### kovan

```
truffle migrate --network kovan
```

##### ropsten

```
truffle migrate --network ropsten
```