// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DeadDrop {
    struct Beneficiary {
        address payable wallet;
        uint256 percentage;
        string label;
    }

    struct Vault {
        address owner;
        string email;
        uint256 lastActivityTimestamp;
        uint256 inactivityThreshold;
        uint256 warningThreshold;
        bool warningIssued;
        bool executed;
        bool active;
        string inheritancePlanRaw;
        uint256 depositedAmount;
    }

    mapping(address => Vault) public vaults;
    mapping(address => Beneficiary[]) private beneficiaries;
    mapping(address => uint256) public vaultBalances;

    address[] public registeredOwners;
    address public authorizedAgent;

    uint256 public constant DEFAULT_INACTIVITY_DAYS = 300;
    uint256 public constant WARNING_DAYS_BEFORE = 7;

    event VaultCreated(address indexed owner, uint256 threshold, uint256 beneficiaryCount, uint256 timestamp);
    event ActivityPinged(address indexed owner, uint256 timestamp);
    event WarningSent(address indexed owner, uint256 daysInactive, uint256 timestamp);
    event InheritanceExecuted(address indexed owner, uint256 totalAmount, uint256 timestamp);
    event FundsDeposited(address indexed owner, uint256 amount, uint256 timestamp);
    event AgentUpdated(address indexed oldAgent, address indexed newAgent);

    modifier onlyAgent() {
        require(msg.sender == authorizedAgent, "DeadDrop: Only AI agent");
        _;
    }

    modifier vaultExists(address _owner) {
        require(vaults[_owner].active, "DeadDrop: Vault does not exist");
        _;
    }

    modifier notExecuted(address _owner) {
        require(!vaults[_owner].executed, "DeadDrop: Already executed");
        _;
    }

    constructor(address _agent) {
        require(_agent != address(0), "DeadDrop: Invalid agent address");
        authorizedAgent = _agent;
    }

    function createVault(
        string memory _email,
        address payable[] memory _beneficiaryAddresses,
        uint256[] memory _percentages,
        string[] memory _labels,
        string memory _inheritancePlanRaw,
        uint256 _customThresholdDays
    ) external payable {
        require(!vaults[msg.sender].active, "DeadDrop: Vault already exists");
        require(_beneficiaryAddresses.length > 0, "DeadDrop: Need at least one beneficiary");
        require(_beneficiaryAddresses.length <= 10, "DeadDrop: Max 10 beneficiaries");
        require(
            _beneficiaryAddresses.length == _percentages.length &&
                _percentages.length == _labels.length,
            "DeadDrop: Array length mismatch"
        );
        require(bytes(_email).length > 0, "DeadDrop: Email required");

        uint256 totalPercentage = 0;
        for (uint256 i = 0; i < _percentages.length; i++) {
            require(_beneficiaryAddresses[i] != address(0), "DeadDrop: Invalid beneficiary address");
            require(_percentages[i] > 0, "DeadDrop: Percentage must be > 0");
            totalPercentage += _percentages[i];
        }
        require(totalPercentage == 10000, "DeadDrop: Percentages must sum to 100%");

        uint256 thresholdDays = _customThresholdDays > 0 ? _customThresholdDays : DEFAULT_INACTIVITY_DAYS;
        require(thresholdDays > WARNING_DAYS_BEFORE, "DeadDrop: Threshold too short");

        vaults[msg.sender] = Vault({
            owner: msg.sender,
            email: _email,
            lastActivityTimestamp: block.timestamp,
            inactivityThreshold: thresholdDays * 1 days,
            warningThreshold: (thresholdDays - WARNING_DAYS_BEFORE) * 1 days,
            warningIssued: false,
            executed: false,
            active: true,
            inheritancePlanRaw: _inheritancePlanRaw,
            depositedAmount: msg.value
        });

        for (uint256 i = 0; i < _beneficiaryAddresses.length; i++) {
            beneficiaries[msg.sender].push(
                Beneficiary({
                    wallet: _beneficiaryAddresses[i],
                    percentage: _percentages[i],
                    label: _labels[i]
                })
            );
        }

        vaultBalances[msg.sender] = msg.value;
        registeredOwners.push(msg.sender);

        emit VaultCreated(msg.sender, thresholdDays, _beneficiaryAddresses.length, block.timestamp);

        if (msg.value > 0) {
            emit FundsDeposited(msg.sender, msg.value, block.timestamp);
        }
    }

    function pingActivity() external vaultExists(msg.sender) notExecuted(msg.sender) {
        vaults[msg.sender].lastActivityTimestamp = block.timestamp;
        vaults[msg.sender].warningIssued = false;
        emit ActivityPinged(msg.sender, block.timestamp);
    }

    function markWarningIssued(address _owner) external onlyAgent vaultExists(_owner) notExecuted(_owner) {
        require(!vaults[_owner].warningIssued, "DeadDrop: Warning already issued");
        require(
            block.timestamp >= vaults[_owner].lastActivityTimestamp + vaults[_owner].warningThreshold,
            "DeadDrop: Warning threshold not reached"
        );

        vaults[_owner].warningIssued = true;
        uint256 daysInactive = (block.timestamp - vaults[_owner].lastActivityTimestamp) / 1 days;
        emit WarningSent(_owner, daysInactive, block.timestamp);
    }

    function executeInheritance(address _owner) external onlyAgent vaultExists(_owner) notExecuted(_owner) {
        require(
            block.timestamp >= vaults[_owner].lastActivityTimestamp + vaults[_owner].inactivityThreshold,
            "DeadDrop: Inactivity threshold not reached"
        );

        uint256 vaultBalance = vaultBalances[_owner];
        require(vaultBalance > 0, "DeadDrop: No funds in vault");

        vaults[_owner].executed = true;
        vaultBalances[_owner] = 0;

        Beneficiary[] storage bens = beneficiaries[_owner];
        uint256 distributed = 0;

        for (uint256 i = 0; i < bens.length; i++) {
            uint256 amount;
            if (i == bens.length - 1) {
                amount = vaultBalance - distributed;
            } else {
                amount = (vaultBalance * bens[i].percentage) / 10000;
            }

            if (amount > 0) {
                (bool sent, ) = bens[i].wallet.call{value: amount}("");
                require(sent, "DeadDrop: Transfer failed");
                distributed += amount;
            }
        }

        emit InheritanceExecuted(_owner, vaultBalance, block.timestamp);
    }

    function depositToVault() external payable vaultExists(msg.sender) notExecuted(msg.sender) {
        require(msg.value > 0, "DeadDrop: Must send XTZ");
        vaultBalances[msg.sender] += msg.value;
        vaults[msg.sender].depositedAmount += msg.value;
        emit FundsDeposited(msg.sender, msg.value, block.timestamp);
    }

    function updateAgent(address _newAgent) external {
        require(msg.sender == authorizedAgent, "DeadDrop: Only current agent");
        require(_newAgent != address(0), "DeadDrop: Invalid address");
        emit AgentUpdated(authorizedAgent, _newAgent);
        authorizedAgent = _newAgent;
    }

    function getVaultStatus(
        address _owner
    )
        external
        view
        returns (
            bool active,
            bool executed,
            bool warningIssued,
            uint256 lastActivityTimestamp,
            uint256 daysInactive,
            uint256 daysUntilExecution,
            uint256 vaultBalance,
            uint256 beneficiaryCount
        )
    {
        Vault storage vault = vaults[_owner];
        uint256 inactiveSecs = vault.active ? block.timestamp - vault.lastActivityTimestamp : 0;
        uint256 inactiveDays = inactiveSecs / 1 days;
        uint256 thresholdDays = vault.inactivityThreshold / 1 days;
        uint256 remaining = inactiveDays >= thresholdDays ? 0 : thresholdDays - inactiveDays;

        return (
            vault.active,
            vault.executed,
            vault.warningIssued,
            vault.lastActivityTimestamp,
            inactiveDays,
            remaining,
            vaultBalances[_owner],
            beneficiaries[_owner].length
        );
    }

    function getBeneficiaries(
        address _owner
    ) external view returns (address[] memory wallets, uint256[] memory percentages, string[] memory labels) {
        Beneficiary[] storage bens = beneficiaries[_owner];
        uint256 len = bens.length;

        wallets = new address[](len);
        percentages = new uint256[](len);
        labels = new string[](len);

        for (uint256 i = 0; i < len; i++) {
            wallets[i] = bens[i].wallet;
            percentages[i] = bens[i].percentage;
            labels[i] = bens[i].label;
        }
    }

    function getInheritancePlan(address _owner) external view returns (string memory) {
        return vaults[_owner].inheritancePlanRaw;
    }

    function getVaultEmail(address _owner) external view onlyAgent returns (string memory) {
        return vaults[_owner].email;
    }

    function getAllOwners() external view returns (address[] memory) {
        return registeredOwners;
    }

    function getTotalVaultCount() external view returns (uint256) {
        return registeredOwners.length;
    }

    function isInactivityThresholdReached(address _owner) external view returns (bool) {
        if (!vaults[_owner].active || vaults[_owner].executed) return false;
        return block.timestamp >= vaults[_owner].lastActivityTimestamp + vaults[_owner].inactivityThreshold;
    }

    function isWarningThresholdReached(address _owner) external view returns (bool) {
        if (!vaults[_owner].active || vaults[_owner].executed) return false;
        return block.timestamp >= vaults[_owner].lastActivityTimestamp + vaults[_owner].warningThreshold;
    }

    receive() external payable {}
}
