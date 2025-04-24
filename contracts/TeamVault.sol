// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TeamVault {
    IERC20 public immutable token;
    address public immutable teamWallet;
    uint256 public immutable cliffEnd;
    uint256 public constant INITIAL_RELEASE_PERCENT = 5;
    uint256 public constant QUARTERLY_RELEASE_PERCENT = 8;
    uint256 public constant QUARTER_DURATION = 90 days;
    uint256 public immutable totalAllocation;
    uint256 public released;

    constructor(
        IERC20 _token,
        address _teamWallet,
        uint256 _totalAllocation,
        uint256 _cliffDuration
    ) {
        token = _token;
        teamWallet = _teamWallet;
        totalAllocation = _totalAllocation;
        cliffEnd = block.timestamp + _cliffDuration;
    }

    function release() external {
        require(block.timestamp >= cliffEnd, "Cliff not reached");
        uint256 elapsedQuarters = (block.timestamp - cliffEnd) / QUARTER_DURATION;
        uint256 totalReleasable = totalAllocation * INITIAL_RELEASE_PERCENT / 100;
        totalReleasable += totalAllocation * QUARTERLY_RELEASE_PERCENT * elapsedQuarters / 100;
        totalReleasable = totalReleasable > totalAllocation ? totalAllocation : totalReleasable;

        uint256 unreleased = totalReleasable - released;
        require(unreleased > 0, "Nothing to release");
        released += unreleased;
        token.transfer(teamWallet, unreleased);
    }
}
