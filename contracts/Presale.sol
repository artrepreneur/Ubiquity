// SPDX-License-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IInvestorVault {
    function setVestingSchedule(address beneficiary, uint256 totalAllocation, uint256 startTime) external;
}

contract Presale is Ownable {
    IERC20 public usdt;
    IInvestorVault public investorVault;
    address public treasuryVault;
    uint256 public constant TOKEN_PRICE_USDT = 15000; // $0.015 for 6-decimal USDT
    uint256 public constant MAX_TOKENS_FOR_SALE = 66_670_000 * 1e18;
    uint256 public totalTokensSold;
    uint256 public saleStart;
    uint256 public saleEnd;

    event TokensPurchased(address indexed buyer, uint256 usdtAmount, uint256 tokenAmount);

    constructor(
        IERC20 _usdt,
        IInvestorVault _investorVault,
        address _treasuryVault,
        uint256 _saleStart,
        uint256 _saleEnd,
        address initialOwner
    ) Ownable(initialOwner) {
        require(_saleStart < _saleEnd, "Invalid sale period");
        usdt = _usdt;
        investorVault = _investorVault;
        treasuryVault = _treasuryVault;
        saleStart = _saleStart;
        saleEnd = _saleEnd;
    }

    function buyTokens(uint256 usdtAmount) external {
        require(block.timestamp >= saleStart && block.timestamp <= saleEnd, "Sale is not active");
        uint256 tokenAmount = (usdtAmount * 1e18) / TOKEN_PRICE_USDT;
        require(totalTokensSold + tokenAmount <= MAX_TOKENS_FOR_SALE, "Exceeds token sale cap");
        usdt.transferFrom(msg.sender, treasuryVault, usdtAmount);
        totalTokensSold += tokenAmount;
        uint256 vestingStart = saleEnd + 180 days;
        investorVault.setVestingSchedule(msg.sender, tokenAmount, vestingStart);
        emit TokensPurchased(msg.sender, usdtAmount, tokenAmount);
    }
}