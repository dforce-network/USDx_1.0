# USDx

### Prepare

```
npm install -g truffle
npm install -g ganache-cli
```

### Install

```
git clone https://github.com/HorsenLi/USDx_1.0.git
cd ./USDx_1.0
npm install
```

### Build

```
npm run build
```

### Test

```
ganache-cli --port=7545 --gasLimit=8000000 --accounts=10 --defaultBalanceEther=10000
truffle test ./test/DFEngine_deposit_claim.js > testDF_deposit_claim.log
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

##### rinkeby

```
truffle migrate --network rinkeby
```
