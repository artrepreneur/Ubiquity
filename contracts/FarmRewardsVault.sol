// SPDX-License-Identifier: MIT
//Assign a bot wallet as the rewardsDistributor
//Bot regularly calls automatedReleaseRewards to push tokens into the staking contract.

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FarmRewardsVault is Ownable {
    IERC20 public token;

    event RewardsReleased(uint256 amount, address to);

    constructor(IERC20 _token, address initialOwner) Ownable(initialOwner) {
        token = IERC20(_token);
    }

    function releaseRewards(uint256 amount, address to) external onlyOwner {
        require(token.balanceOf(address(this)) >= amount, "Insufficient reward tokens");
        token.transfer(to, amount);
        emit RewardsReleased(amount, to);
    }

    address public rewardsDistributor;

    constructor(IERC20 _token, address initialOwner) Ownable(initialOwner) {
        token = IERC20(_token);
        rewardsDistributor = initialOwner; 
    }

    modifier onlyDistributor() {
        require(msg.sender == rewardsDistributor, "Not distributor");
        _;
    }

    function setRewardsDistributor(address distributor) external onlyOwner {
        rewardsDistributor = distributor;
    }

    function automatedReleaseRewards(uint256 amount, address stakingContract) external onlyDistributor {
        require(token.balanceOf(address(this)) >= amount, "Insufficient rewards");
        token.transfer(stakingContract, amount);
        emit RewardsReleased(amount, stakingContract);
    }

}