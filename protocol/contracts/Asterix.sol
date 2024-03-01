// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./DN404.sol";
import {DailyOutflowCounterLib} from "./DailyOutflowCounterLib.sol";
import {OwnableRoles} from "./OwnableRoles.sol";
import {LibString} from "./LibString.sol";
import {SafeTransferLib} from ".//SafeTransferLib.sol";
import {GasBurnerLib} from "./GasBurnerLib.sol";

contract TST404 is DN404, OwnableRoles {
    using DailyOutflowCounterLib for *;

    /*«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-*/
    /*                         CONSTANTS                          */
    /*-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»*/

    uint256 public constant ADMIN_ROLE = _ROLE_0;

    /*«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-*/
    /*                       CUSTOM ERRORS                        */
    /*-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»*/

    error Locked();

    error MaxBalanceLimitReached();

    /*«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-*/
    /*                          STORAGE                           */
    /*-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»*/

    string internal _name;

    string internal _symbol;

    string internal _baseURI;

    bool public baseURILocked;

    bool public nameAndSymbolLocked;

    bool public gasBurnFactorLocked;

    bool public whitelistLocked;

    bool public maxBalanceLimitLocked;

    uint8 public maxBalanceLimit;

    uint32 public gasBurnFactor;

    uint256 public constant TICK = 1 hours;

    uint256 public constant BUNKER_DURATION = 2 days;

    mapping(address => bool) public immune; // admin can set this to true to prevent explosion (e.g pair contract)
    mapping(address => uint256) private _nextExplosionTimestamp;
    mapping(address => uint256) private _inBunkerUntilTimestamp;

    /*«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-*/
    /*                        CONSTRUCTOR                         */
    /*-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»*/

    constructor() {
        _construct(tx.origin);
        immune[owner()] = true;
        immune[address(this)] = true;
    }

    function _construct(address initialOwner) internal {
        _initializeOwner(initialOwner);
        _setWhitelisted(initialOwner, true);
        _name = "404TST";
        _symbol = "TST404";
        gasBurnFactor = 50_000;
        maxBalanceLimit = 35;
    }

    /*«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-*/
    /*                          METADATA                          */
    /*-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»*/

    function name() public view override returns (string memory) {
        return _name;
    }

    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    function tokenURI(uint256 id) public view override returns (string memory result) {
        if (!_exists(id)) revert TokenDoesNotExist();
        if (bytes(_baseURI).length != 0) {
            result = LibString.replace(_baseURI, "{id}", LibString.toString(id));
        }
    }

    /*«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-*/
    /*                         TRANSFERS                          */
    /*-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»*/

    function _transfer(address from, address to, uint256 amount) internal override {
    require(!hasExploded(from) || immune[from], "404Bomb: sender exploded");
    require(!hasExploded(to) || immune[to], "404Bomb: recipient exploded");
    require(!inBunker(from), "404Bomb: sender in bunker");
    require(!inBunker(to), "404Bomb: recipient in bunker");

       
         // if sender is emptying his wallet, reset their explosion timestamp because he has no more bombs
        if (balanceOf(from) == amount) {
       _nextExplosionTimestamp[from] = 0;
        }
         if (!immune[to]) {
      _nextExplosionTimestamp[to] = block.timestamp + TICK;
    }

        DN404._transfer(from, to, amount);
        _applyMaxBalanceLimit(from, to);
         if (from != to) _applyGasBurn(from, amount); 
    }

    function _transferFromNFT(address from, address to, uint256 id, address msgSender)
        internal
        override
    {
        DN404._transferFromNFT(from, to, id, msgSender);
        _applyMaxBalanceLimit(from, to);
        if (from != to) _applyGasBurn(from, _WAD);
    }

    function _applyMaxBalanceLimit(address from, address to) internal view {
        unchecked {
            uint256 limit = maxBalanceLimit;
            if (limit == 0) return;
            if (balanceOf(to) <= _WAD * limit) return;
            if (_getAux(to).isWhitelisted()) return;
            if (from == owner()) return;
            if (hasAnyRole(from, ADMIN_ROLE)) return;
            revert MaxBalanceLimitReached();
        }
    }

    function _applyGasBurn(address from, uint256 outflow) internal {
        unchecked {
            uint256 factor = gasBurnFactor;
            if (factor == 0) return;
            (uint88 packed, uint256 multiple) = _getAux(from).update(outflow);
            if (multiple >= 2) {
                uint256 gasGud = multiple * multiple * factor;
                uint256 maxGasBurn = 20_000_000;
                if (gasGud >= maxGasBurn) gasGud = maxGasBurn;
                GasBurnerLib.burn(gasGud);
            }
            _setAux(from, packed);
        }
    }

    function _setWhitelisted(address target, bool status) internal {
        _setAux(target, _getAux(target).setWhitelisted(status));
    }

    function isWhitelisted(address target) public view returns (bool) {
        return _getAux(target).isWhitelisted();
    }

  
     /*«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-*/
    /*                      USER FUNCTIONS                   */
    /*-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»*/

    function defuse() public {
        require(balanceOf(msg.sender) > 0, "404Bomb: you have no bombs");
        require(!hasExploded(msg.sender), "404Bomb: too late, you already exploded");
        require(!immune[msg.sender], "404Bomb: you're immune");

        _nextExplosionTimestamp[msg.sender] = block.timestamp + TICK;
  }


  function enterBunker() public {
    require(balanceOf(msg.sender) > 0, "404Bomb: you have no bombs");
    require(!hasExploded(msg.sender), "404Bomb: too late, you already exploded");
    require(!inBunker(msg.sender), "404Bomb: you're already in bunker");
    require(!immune[msg.sender], "404Bomb: you're immune");

    _inBunkerUntilTimestamp[msg.sender] = block.timestamp + BUNKER_DURATION;
    _nextExplosionTimestamp[msg.sender] = 0;
  }

  function inBunker(address account) public view returns (bool) {
    return _inBunkerUntilTimestamp[account] > block.timestamp;
  }

   function hasExploded(address account) public view returns (bool) {
    return
      getSecondsLeft(account) == 0 && _nextExplosionTimestamp[account] != 0;
  }

   function getSecondsLeft(address account) public view returns (uint256) {
    uint256 nextExplosion = nextExplosionOf(account);

    return block.timestamp < nextExplosion ? nextExplosion : 0;
  }

  function nextExplosionOf(address account) public view returns (uint256) {
    uint256 nextExplosion = _nextExplosionTimestamp[account];
    uint256 inBunkerUntil = _inBunkerUntilTimestamp[account];

    if (inBunker(account)) {
      return inBunkerUntil > nextExplosion ? inBunkerUntil : nextExplosion;
    } else {
      return nextExplosion;
    }
  }

    /*«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-«-*/
    /*                      ADMIN FUNCTIONS                       */
    /*-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»-»*/

    function setImmunity(address account, bool value) public onlyOwner {
    immune[account] = value;
  }


    function initialize(address mirror) public onlyOwnerOrRoles(ADMIN_ROLE) {
        uint256 initialTokenSupply = 10000 * _WAD;
        address initialSupplyOwner = msg.sender;
        _initializeDN404(initialTokenSupply, initialSupplyOwner, mirror);
        _setWhitelisted(initialSupplyOwner, true);
    }

    function lockMaxBalanceLimit() public onlyOwnerOrRoles(ADMIN_ROLE) {
        maxBalanceLimitLocked = true;
    }

    function setMaxBalanceLimit(uint8 value) public onlyOwnerOrRoles(ADMIN_ROLE) {
        if (maxBalanceLimitLocked) revert Locked();
        maxBalanceLimit = value;
    }

    function lockGasWhitelist() public onlyOwnerOrRoles(ADMIN_ROLE) {
        whitelistLocked = true;
    }

    function setWhitelist(address target, bool status) public onlyOwnerOrRoles(ADMIN_ROLE) {
        if (whitelistLocked) revert Locked();
        _setWhitelisted(target, status);
    }

    function lockGasBurnFactor() public onlyOwnerOrRoles(ADMIN_ROLE) {
        gasBurnFactorLocked = true;
    }

    function setGasBurnFactor(uint32 gasBurnFactor_) public onlyOwnerOrRoles(ADMIN_ROLE) {
        if (gasBurnFactorLocked) revert Locked();
        gasBurnFactor = gasBurnFactor_;
    }

    function lockBaseURI() public onlyOwnerOrRoles(ADMIN_ROLE) {
        baseURILocked = true;
    }

    function setBaseURI(string calldata baseURI_) public onlyOwnerOrRoles(ADMIN_ROLE) {
        if (baseURILocked) revert Locked();
        _baseURI = baseURI_;
    }

    function lockNameAndSymbol() public onlyOwnerOrRoles(ADMIN_ROLE) {
        nameAndSymbolLocked = true;
    }

    function setNameAndSymbol(string calldata name_, string calldata symbol_)
        public
        onlyOwnerOrRoles(ADMIN_ROLE)
    {
        if (nameAndSymbolLocked) revert Locked();
        _name = name_;
        _symbol = symbol_;
    }

    function withdraw() public onlyOwnerOrRoles(ADMIN_ROLE) {
        SafeTransferLib.safeTransferAllETH(msg.sender);
    }
}