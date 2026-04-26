// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract TipJar {
    address public owner;
    uint256 public minTip;
    uint256 public totalReceived;

    struct TipRecord {
        address tipper;
        uint256 amount;
        string message;
        uint256 timestamp;
    }

    TipRecord[] public tipHistory;
    mapping(address => uint256) public totalTippedBy;

    address public topTipper;
    uint256 public topTipAmount;

    event TipReceived(address indexed tipper, uint256 amount, string message);
    event TipWithdrawn(address indexed owner, uint256 amount);
    event OwnerChanged(address indexed oldOwner, address indexed newOwner);
    event MinTipChanged(uint256 newMinTip);

    error NotOwner();
    error BelowMinTip();
    error NoTips();
    error ZeroAddress();
    error TransferFailed();

    constructor(uint256 _minTip) {
        owner = msg.sender;
        minTip = _minTip;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    receive() external payable {
        _recordTip(msg.sender, msg.value, "");
    }

    function tip(string calldata message) public payable {
        if (msg.value < minTip) revert BelowMinTip();
        _recordTip(msg.sender, msg.value, message);
    }

    function _recordTip(address tipper, uint256 amount, string memory message) internal {
        tipHistory.push(TipRecord(tipper, amount, message, block.timestamp));
        totalTippedBy[tipper] += amount;
        totalReceived += amount;

        if (totalTippedBy[tipper] > topTipAmount) {
            topTipper = tipper;
            topTipAmount = totalTippedBy[tipper];
        }

        emit TipReceived(tipper, amount, message);
    }

    function withdrawTips() public onlyOwner {
        uint256 bal = address(this).balance;
        if (bal == 0) revert NoTips();
        emit TipWithdrawn(owner, bal);
        (bool ok, ) = payable(owner).call{value: bal}("");
        if (!ok) revert TransferFailed();
    }

    function getTipHistory() public view returns (TipRecord[] memory) {
        return tipHistory;
    }

    function getTipCount() public view returns (uint256) {
        return tipHistory.length;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function setMinTip(uint256 _minTip) public onlyOwner {
        minTip = _minTip;
        emit MinTipChanged(_minTip);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        emit OwnerChanged(owner, newOwner);
        owner = newOwner;
    }
}
