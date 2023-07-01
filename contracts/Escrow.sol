// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Escrow {
    event Approved(uint balance);
    address public depositor;
    address public beneficiary;
    bool public isApproved;
    address public arbiter;

    constructor(address _arb, address _ben) payable {
        arbiter = _arb;
        beneficiary = _ben;
        depositor = msg.sender;
    }

    function approve() external {
        require(
            msg.sender == arbiter,
            "Failed, action can be performed only by arbiter"
        );
        uint amount = address(this).balance;
        (bool s, ) = beneficiary.call{value: amount}("");
        require(s, "Failed to send ether");
        isApproved = true;
        emit Approved(amount);
    }
}
