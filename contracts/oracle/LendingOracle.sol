pragma solidity ^0.5.2;

interface PriceOracle {
    function getUnderlyingPrice(address _asset) external view returns (uint256);
}

contract Oracle {
    function read() external view returns (bytes32) {
        address DF = 0x431ad2ff6a9C365805eBaD47Ee021148d6f7DBe0;
        uint256 price = PriceOracle(0x34BAf46eA5081e3E49c29fccd8671ccc51e61E79)
        .getUnderlyingPrice(DF);
        return bytes32(price);
    }
}
