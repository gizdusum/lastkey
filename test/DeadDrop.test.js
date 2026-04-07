const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("DeadDrop", function () {
  let contract;
  let owner;
  let agent;
  let beneficiary1;
  let beneficiary2;
  let beneficiary3;

  const DAYS_300 = 300 * 24 * 60 * 60;
  const DAYS_293 = 293 * 24 * 60 * 60;

  beforeEach(async function () {
    [owner, agent, beneficiary1, beneficiary2, beneficiary3] = await ethers.getSigners();
    const DeadDrop = await ethers.getContractFactory("DeadDrop");
    contract = await DeadDrop.deploy(agent.address);
    await contract.waitForDeployment();
  });

  it("deploys with the correct agent", async function () {
    expect(await contract.authorizedAgent()).to.equal(agent.address);
  });

  it("creates a vault with valid parameters", async function () {
    const depositAmount = ethers.parseEther("0.1");

    await expect(
      contract.connect(owner).createVault(
        "test@example.com",
        [beneficiary1.address, beneficiary2.address],
        [7000, 3000],
        ["wife", "charity"],
        "Send 70% to wife and 30% to charity",
        0,
        { value: depositAmount }
      )
    ).to.emit(contract, "VaultConfigured");

    const status = await contract.getVaultStatus(owner.address);
    expect(status.active).to.equal(true);
    expect(status.executed).to.equal(false);
    expect(status.vaultBalance).to.equal(depositAmount);
  });

  it("updates an existing vault instead of reverting", async function () {
    await contract.connect(owner).createVault(
      "test@example.com",
      [beneficiary1.address],
      [10000],
      ["wife"],
      "Send all to wife",
      0,
      { value: ethers.parseEther("0.1") }
    );

    await expect(
      contract.connect(owner).updateVault(
        "new@example.com",
        [beneficiary2.address, beneficiary3.address],
        [6000, 4000],
        ["sister", "dao"],
        "Send 60% to sister and 40% to DAO",
        300,
        { value: ethers.parseEther("0.2") }
      )
    )
      .to.emit(contract, "VaultConfigured")
      .withArgs(owner.address, 300, 2, 2, true, anyValue);

    const status = await contract.getVaultStatus(owner.address);
    expect(status.active).to.equal(true);
    expect(status.executed).to.equal(false);
    expect(status.vaultBalance).to.equal(ethers.parseEther("0.3"));

    const beneficiaries = await contract.getBeneficiaries(owner.address);
    expect(beneficiaries.wallets[0]).to.equal(beneficiary2.address);
    expect(beneficiaries.wallets[1]).to.equal(beneficiary3.address);
    expect(beneficiaries.percentages[0]).to.equal(6000n);
    expect(beneficiaries.percentages[1]).to.equal(4000n);
  });

  it("rejects invalid percentages", async function () {
    await expect(
      contract.connect(owner).createVault(
        "test@example.com",
        [beneficiary1.address],
        [5000],
        ["wife"],
        "Send 50% to wife",
        0
      )
    ).to.be.revertedWith("DeadDrop: Percentages must sum to 100%");
  });

  it("pings activity and resets the timer", async function () {
    await contract.connect(owner).createVault(
      "test@example.com",
      [beneficiary1.address],
      [10000],
      ["wife"],
      "Send all to wife",
      0
    );

    await time.increase(100 * 24 * 60 * 60);

    await expect(contract.connect(owner).pingActivity()).to.emit(contract, "ActivityPinged");

    const status = await contract.getVaultStatus(owner.address);
    expect(status.daysInactive).to.be.lessThan(2n);

    const activity = await contract.getActivityStatus(owner.address);
    expect(activity.lastManualCheckInTimestamp).to.be.greaterThan(0n);
    expect(activity.lastResetMethod).to.equal(2n);
  });

  it("records detected onchain activity without resetting when not qualified", async function () {
    await contract.connect(owner).createVault(
      "test@example.com",
      [beneficiary1.address],
      [10000],
      ["wife"],
      "Send all to wife",
      0
    );

    const before = await contract.getVaultStatus(owner.address);
    await time.increase(10 * 24 * 60 * 60);
    const latest = await time.latest();

    await expect(
      contract.connect(agent).recordDetectedActivity(owner.address, 1, latest, false)
    ).to.emit(contract, "OnchainActivityDetected");

    const afterStatus = await contract.getVaultStatus(owner.address);
    const activity = await contract.getActivityStatus(owner.address);

    expect(afterStatus.lastActivityTimestamp).to.equal(before.lastActivityTimestamp);
    expect(activity.lastDetectedActivityTimestamp).to.equal(latest);
    expect(activity.lastQualifiedActivityTimestamp).to.equal(0n);
    expect(activity.lastDetectedActivityKind).to.equal(1n);
  });

  it("auto-resets the timer when qualified activity is detected", async function () {
    await contract.connect(owner).createVault(
      "test@example.com",
      [beneficiary1.address],
      [10000],
      ["wife"],
      "Send all to wife",
      0
    );

    await time.increase(120 * 24 * 60 * 60);
    const detectedAt = await time.latest();

    await expect(
      contract.connect(agent).recordDetectedActivity(owner.address, 1, detectedAt, true)
    )
      .to.emit(contract, "ActivityAutoReset")
      .withArgs(owner.address, 1, detectedAt, anyValue);

    const status = await contract.getVaultStatus(owner.address);
    const activity = await contract.getActivityStatus(owner.address);

    expect(status.daysInactive).to.be.lessThan(2n);
    expect(activity.lastDetectedActivityTimestamp).to.equal(detectedAt);
    expect(activity.lastQualifiedActivityTimestamp).to.equal(detectedAt);
    expect(activity.lastResetMethod).to.equal(3n);
  });

  it("lets the agent issue warning after 293 days", async function () {
    await contract.connect(owner).createVault(
      "test@example.com",
      [beneficiary1.address],
      [10000],
      ["wife"],
      "Send all to wife",
      0
    );

    await time.increase(DAYS_293 + 1);

    await expect(contract.connect(agent).markWarningIssued(owner.address)).to.emit(contract, "WarningSent");
  });

  it("executes inheritance after 300 days", async function () {
    const depositAmount = ethers.parseEther("1.0");

    await contract.connect(owner).createVault(
      "test@example.com",
      [beneficiary1.address, beneficiary2.address],
      [7000, 3000],
      ["wife", "charity"],
      "Send 70% to wife and 30% to charity",
      0,
      { value: depositAmount }
    );

    const b1BalanceBefore = await ethers.provider.getBalance(beneficiary1.address);
    const b2BalanceBefore = await ethers.provider.getBalance(beneficiary2.address);

    await time.increase(DAYS_300 + 1);

    await expect(contract.connect(agent).executeInheritance(owner.address)).to.emit(contract, "InheritanceExecuted");

    const b1BalanceAfter = await ethers.provider.getBalance(beneficiary1.address);
    const b2BalanceAfter = await ethers.provider.getBalance(beneficiary2.address);

    expect(b1BalanceAfter - b1BalanceBefore).to.equal(ethers.parseEther("0.7"));
    expect(b2BalanceAfter - b2BalanceBefore).to.equal(ethers.parseEther("0.3"));

    const status = await contract.getVaultStatus(owner.address);
    expect(status.executed).to.equal(true);
  });

  it("blocks non-agent execution", async function () {
    await contract.connect(owner).createVault(
      "test@example.com",
      [beneficiary1.address],
      [10000],
      ["wife"],
      "Send all to wife",
      0,
      { value: ethers.parseEther("0.1") }
    );

    await time.increase(DAYS_300 + 1);

    await expect(contract.connect(owner).executeInheritance(owner.address)).to.be.revertedWith(
      "DeadDrop: Only AI agent"
    );
  });
});
