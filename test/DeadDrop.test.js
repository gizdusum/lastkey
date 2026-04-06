const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("DeadDrop", function () {
  let contract;
  let owner;
  let agent;
  let beneficiary1;
  let beneficiary2;

  const DAYS_300 = 300 * 24 * 60 * 60;
  const DAYS_293 = 293 * 24 * 60 * 60;

  beforeEach(async function () {
    [owner, agent, beneficiary1, beneficiary2] = await ethers.getSigners();
    const DeadDrop = await ethers.getContractFactory("DeadDrop");
    contract = await DeadDrop.deploy(agent.address);
    await contract.waitForDeployment();
  });

  it("Should deploy with correct agent address", async function () {
    expect(await contract.authorizedAgent()).to.equal(agent.address);
  });

  it("Should create a vault with valid parameters", async function () {
    const depositAmount = ethers.parseEther("0.1");

    await expect(
      contract
        .connect(owner)
        .createVault(
          "test@example.com",
          [beneficiary1.address, beneficiary2.address],
          [7000, 3000],
          ["wife", "charity"],
          "Send 70% to wife and 30% to charity",
          0,
          { value: depositAmount }
        )
    ).to.emit(contract, "VaultCreated");

    const status = await contract.getVaultStatus(owner.address);
    expect(status.active).to.equal(true);
    expect(status.executed).to.equal(false);
    expect(status.vaultBalance).to.equal(depositAmount);
  });

  it("Should reject invalid percentages", async function () {
    await expect(
      contract
        .connect(owner)
        .createVault(
          "test@example.com",
          [beneficiary1.address],
          [5000],
          ["wife"],
          "Send 50% to wife",
          0
        )
    ).to.be.revertedWith("DeadDrop: Percentages must sum to 100%");
  });

  it("Should ping activity and reset timer", async function () {
    await contract
      .connect(owner)
      .createVault(
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
  });

  it("Should allow agent to issue warning after 293 days", async function () {
    await contract
      .connect(owner)
      .createVault(
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

  it("Should execute inheritance after 300 days", async function () {
    const depositAmount = ethers.parseEther("1.0");

    await contract
      .connect(owner)
      .createVault(
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

  it("Should block non-agent from executing", async function () {
    await contract
      .connect(owner)
      .createVault(
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
