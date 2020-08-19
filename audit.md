### USDx 1.1

USDx 此次升级加入了对 dToken 的支持，铸成 USDx 的成分币，被铸成相应的 dToken，进入生息系统。

#### 审计目标

- 新旧合约切换过程中资产的转移正确；
- 切换至新合约之后，铸币以及销币的流程正确；

#### 审计合约

- converter/DFEngineV2.sol
- storage/DFPoolV2.sol

#### 修改内容

- DFEngine 升级为 DFEngineV2, 使用 DFPoolV2，适配新的铸币销币流程。
- DFPool 升级为 DFPoolV2：
  - 铸币时，增加了将底层成分币铸成相应 dToken 的动作。
  - 销币时，增加了将底层成分币从相应 dToken 中取回的动作。
  - 添加查询底层成分币接口
  - 添加查询xToken对应的利息接口
