export const DEADDROP_ADDRESS = (
  process.env.NEXT_PUBLIC_DEADDROP_ADDRESS ||
  "0x29C3B37CD735104812a8A72B9b6FeA9578e044a5"
) as `0x${string}`;

export const DEADDROP_ABI = [
  {
    name: "createVault",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "_email", type: "string" },
      { name: "_beneficiaryAddresses", type: "address[]" },
      { name: "_percentages", type: "uint256[]" },
      { name: "_labels", type: "string[]" },
      { name: "_inheritancePlanRaw", type: "string" },
      { name: "_customThresholdDays", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "updateVault",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "_email", type: "string" },
      { name: "_beneficiaryAddresses", type: "address[]" },
      { name: "_percentages", type: "uint256[]" },
      { name: "_labels", type: "string[]" },
      { name: "_inheritancePlanRaw", type: "string" },
      { name: "_customThresholdDays", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "pingActivity",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    name: "depositToVault",
    type: "function",
    stateMutability: "payable",
    inputs: [],
    outputs: [],
  },
  {
    name: "getVaultStatus",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_owner", type: "address" }],
    outputs: [
      { name: "active", type: "bool" },
      { name: "executed", type: "bool" },
      { name: "warningIssued", type: "bool" },
      { name: "lastActivityTimestamp", type: "uint256" },
      { name: "daysInactive", type: "uint256" },
      { name: "daysUntilExecution", type: "uint256" },
      { name: "vaultBalance", type: "uint256" },
      { name: "beneficiaryCount", type: "uint256" },
    ],
  },
  {
    name: "getActivityStatus",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_owner", type: "address" }],
    outputs: [
      { name: "lastManualCheckInTimestamp", type: "uint256" },
      { name: "lastDetectedActivityTimestamp", type: "uint256" },
      { name: "lastQualifiedActivityTimestamp", type: "uint256" },
      { name: "lastDetectedActivityKind", type: "uint8" },
      { name: "lastResetMethod", type: "uint8" },
    ],
  },
  {
    name: "getBeneficiaries",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_owner", type: "address" }],
    outputs: [
      { name: "wallets", type: "address[]" },
      { name: "percentages", type: "uint256[]" },
      { name: "labels", type: "string[]" },
    ],
  },
  {
    name: "getInheritancePlan",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_owner", type: "address" }],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "getAllOwners",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address[]" }],
  },
  {
    name: "getTotalVaultCount",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "VaultConfigured",
    type: "event",
    inputs: [
      { name: "owner", type: "address", indexed: true },
      { name: "thresholdDays", type: "uint256", indexed: false },
      { name: "beneficiaryCount", type: "uint256", indexed: false },
      { name: "version", type: "uint256", indexed: false },
      { name: "isUpdate", type: "bool", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    name: "ActivityPinged",
    type: "event",
    inputs: [
      { name: "owner", type: "address", indexed: true },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    name: "OnchainActivityDetected",
    type: "event",
    inputs: [
      { name: "owner", type: "address", indexed: true },
      { name: "activityKind", type: "uint8", indexed: true },
      { name: "observedTimestamp", type: "uint256", indexed: false },
      { name: "qualifiedReset", type: "bool", indexed: false },
      { name: "recordedAt", type: "uint256", indexed: false },
    ],
  },
  {
    name: "ActivityAutoReset",
    type: "event",
    inputs: [
      { name: "owner", type: "address", indexed: true },
      { name: "activityKind", type: "uint8", indexed: true },
      { name: "observedTimestamp", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    name: "WarningSent",
    type: "event",
    inputs: [
      { name: "owner", type: "address", indexed: true },
      { name: "daysInactive", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    name: "InheritanceExecuted",
    type: "event",
    inputs: [
      { name: "owner", type: "address", indexed: true },
      { name: "totalAmount", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
] as const;
