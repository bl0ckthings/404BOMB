// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./DN404Mirror.sol";

contract Mirror404 is DN404Mirror {
    constructor() DN404Mirror(tx.origin) {}
}