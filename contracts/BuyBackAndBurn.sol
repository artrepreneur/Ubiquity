// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IUniswapV3Router {
    function exactInputSingle(
        address tokenIn,
        address tokenOut,
        uint24 fee,
        address recipient,
        uint256 amountIn,
        uint256 amountOutMinimum,
        uint160 sqrtPriceLimitX96
    ) external returns (uint256 amountOut);
}

contract BuyBackAndBurn is Ownable {
    IERC20 public immutable usbx;
    IERC20 public immutable xbu;
    IUniswapV3Router public immutable router;

    constructor(IERC20 _usbx, IERC20 _xbu, IUniswapV3Router _router) Ownable(msg.sender) {
        usbx = _usbx;
        xbu = _xbu;
        router = _router;
    }

    function executeBuyBackAndBurn(uint256 amountUSDX) external onlyOwner {
        require(usbx.balanceOf(address(this)) >= amountUSDX, "Insufficient USBX");
        usbx.approve(address(router), amountUSDX);

        router.exactInputSingle({
            tokenIn: address(usbx),
            tokenOut: address(xbu),
            fee: 3000, // 0.3% pool fee (adjust as needed)
            recipient: address(this),
            amountIn: amountUSDX,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0
        });

        uint256 burnAmount = xbu.balanceOf(address(this));
        xbu.transfer(address(0), burnAmount);
    }
}
