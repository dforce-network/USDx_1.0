## This document is about how to deploy contracts by the Remix.

DSwrappentoken:

1)sourceDAI, 18, bytes32(xDAI)=>0x78444149

2)sourcePAX, 18, bytes32(xPAX)=>0x78504158

3)sourceTUSD, 18, bytes32(xTUSD)=>0x7854555344

4)sourceUSDC, 18, bytes32(xUSDC)=>0x7855534443

5)DSGuard()

6)DSToken.sol: bytes32(USDx)=>0x55534478

7)DSToken.sol: bytes32(DF)=>0x4446

8)DStore():

arrayAddress[address(xDAI),address(xDAI),address(xDAI),address(xDAI)]

arrayUint[“1000000000000000000”,”3000000000000000000”,”3000000000000000000”,"3000000000000000000”]

9)DFCollateral()

10)DFPool(): address(DFCollateral)

11)DFFunds()

12)PriceFeed()

13)Medianizer()

14)DFEngine():address(USDx), address(DFStore), address(DFPool), address(DFCollateral), address(DFFund)

15)DFSetting(): address(DFStore)

16)DFProtocol();

17)DFProtocolView();address(DFStore), address(DFCollateral)

**There is total 17 contracts.**

### After you deploy the contracts, you should set authority by the following steps:
