// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InvestorVault is Ownable {
    IERC20 public token; // XBU token

    struct VestingSchedule {
        uint256 totalAllocation;
        uint256 released;
        uint256 startTime;
    }

    mapping(address => VestingSchedule) public vestingSchedules;

    event TokensReleased(address beneficiary, uint256 amount);
    event VestingScheduleSet(address beneficiary, uint256 totalAllocation, uint256 startTime);

    constructor(IERC20 _token) {
        token = _token;
    }

    function setVestingSchedule(
        address beneficiary,
        uint256 totalAllocation,
        uint256 startTime
    ) external onlyOwner {
        vestingSchedules[beneficiary] = VestingSchedule({
            totalAllocation: totalAllocation,
            released: 0,
            startTime: startTime
        });
        emit VestingScheduleSet(beneficiary, totalAllocation, startTime);
    }

    function vestedAmount(address beneficiary) public view returns (uint256) {
        VestingSchedule memory schedule = vestingSchedules[beneficiary];
        if (block.timestamp < schedule.startTime) {
            return 0;
        } else {
            uint256 timeSinceStart = block.timestamp - schedule.startTime;
            uint256 quarter = 90 days;
            uint256 periods = timeSinceStart / quarter;
            uint256 initialRelease = (schedule.totalAllocation * 5) / 100; // 5%
            uint256 additional = (schedule.totalAllocation * 8 * periods) / 100; // 8% per quarter
            uint256 totalVested = initialRelease + additional;
            return totalVested > schedule.totalAllocation ? schedule.totalAllocation : totalVested;
        }
    }

    function release() external {
        VestingSchedule storage schedule = vestingSchedules[msg.sender];
        require(schedule.totalAllocation > 0, "No vesting schedule set");
        uint256 vested = vestedAmount(msg.sender);
        uint256 unreleased = vested - schedule.released;
        require(unreleased > 0, "No tokens to release");
        schedule.released += unreleased;
        token.transfer(msg.sender, unreleased);
        emit TokensReleased(msg.sender, unreleased);
    }
}