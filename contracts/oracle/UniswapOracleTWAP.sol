pragma solidity ^0.5.2;

interface IUniswapV2Pair {
    function getReserves()
        external
        view
        returns (
            uint112 _reserve0,
            uint112 _reserve1,
            uint32 _blockTimestampLast
        );

    function price0CumulativeLast() external view returns (uint256);

    function price1CumulativeLast() external view returns (uint256);
}

library FixedPoint {
    // range: [0, 2**112 - 1]
    // resolution: 1 / 2**112
    struct uq112x112 {
        uint224 _x;
    }

    // range: [0, 2**144 - 1]
    // resolution: 1 / 2**112
    struct uq144x112 {
        uint256 _x;
    }

    uint8 private constant RESOLUTION = 112;

    // decode a UQ144x112 into a uint144 by truncating after the radix point
    function decode144(uq144x112 memory self) internal pure returns (uint144) {
        return uint144(self._x >> RESOLUTION);
    }

    // multiply a UQ112x112 by a uint256, returning a UQ144x112
    // reverts on overflow
    function mul(uq112x112 memory self, uint256 y) internal pure returns (uq144x112 memory) {
        uint256 z = 0;
        require(y == 0 || (z = self._x * y) / y == self._x, 'FixedPoint: MUL_OVERFLOW');
        return uq144x112(z);
    }

    // returns a UQ112x112 which represents the ratio of the numerator to the denominator
    // lossy
    function fraction(uint112 numerator, uint112 denominator) internal pure returns (uq112x112 memory) {
        require(denominator > 0, 'FixedPoint: DIV_BY_ZERO_FRACTION');
        return uq112x112((uint224(numerator) << RESOLUTION) / denominator);
    }
}

contract Oracle {
    using FixedPoint for *;

    address public constant USDxDFpair = 0xFe7308D6Ba8A64a189074f3c83a6cC56Fc13B3aF;
    uint256 public constant PERIOD = 24 hours;
    uint256 public constant BASE = 10**18;
    uint256 public constant defaultPrice = 0.1e15;
    
    uint256 public priceCumulativeLast;
    uint32 public blockTimestampLast;

    uint256 public priceAverage = defaultPrice;

    constructor() public {
        (priceCumulativeLast, blockTimestampLast) = currentCumulativePrices(USDxDFpair);
    }

    // helper function that returns the current block timestamp within the range of uint32, i.e. [0, 2**32 - 1]
    function currentBlockTimestamp() internal view returns (uint32) {
        return uint32(block.timestamp % 2 ** 32);
    }

    // produces the cumulative price using counterfactuals to save gas and avoid a call to sync.
    function currentCumulativePrices(
        address _pair
    ) internal view returns (uint256 _price0Cumulative, uint32 _blockTimestamp) {
        _blockTimestamp = currentBlockTimestamp();
        _price0Cumulative = IUniswapV2Pair(_pair).price0CumulativeLast();

        // if time has elapsed since the last update on the _pair, mock the accumulated price values
        (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) = IUniswapV2Pair(_pair).getReserves();
        if (_blockTimestampLast != _blockTimestamp) {
            // subtraction overflow is desired
            uint32 _timeElapsed = _blockTimestamp - _blockTimestampLast;
            // addition overflow is desired
            // counterfactual
            _price0Cumulative += uint256(FixedPoint.fraction(_reserve1, _reserve0)._x) * _timeElapsed;
        }
    }

    function getCurrentTWAP() internal view returns (uint256, uint256, uint32) {
        (uint256 _price0Cumulative, uint32 _blockTimestamp) = currentCumulativePrices(USDxDFpair);
        uint32 _timeElapsed = _blockTimestamp - blockTimestampLast; // overflow is desired

        // ensure that at least one full period has passed since the last update
        if (_timeElapsed < PERIOD)
            return (priceAverage, priceCumulativeLast, blockTimestampLast);

        // overflow is desired, casting never truncates
        // cumulative price is in (uq112x112 price * seconds) units so we simply wrap it after division by time elapsed
        uint256 _priceAverage = FixedPoint.uq112x112(uint224((_price0Cumulative - priceCumulativeLast) / _timeElapsed)).mul(BASE).decode144();
        
        return (_priceAverage, _price0Cumulative, _blockTimestamp);
    }

    function read() external returns (bytes32) {
        (priceAverage, priceCumulativeLast, blockTimestampLast) = getCurrentTWAP();
        return bytes32(priceAverage);
    }
}
