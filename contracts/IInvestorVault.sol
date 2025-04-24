// SPDX-License-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IInvestorVault {
    function setVestingSchedule(address beneficiary, uint256 totalAllocation, uint256 startTime) external;
}