/**
 * DeadDrop Emailer
 * Nodemailer + Gmail SMTP ile bildirim e-postaları gönderir.
 */

const nodemailer = require("nodemailer");

function isEmailConfigured() {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD);
}

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
}

async function sendWarningEmail({ to, ownerAddress, daysInactive, daysRemaining }) {
  if (!to) {
    console.warn("    ⚠️  No email address for vault, skipping warning email");
    return;
  }

  if (!isEmailConfigured()) {
    console.warn("    ⚠️  Email integration is not configured, skipping warning email");
    return;
  }

  const frontendUrl = process.env.FRONTEND_URL || "https://deaddrop.vercel.app";
  const explorerUrl = `${process.env.ETHERLINK_EXPLORER_URL || "https://shadownet.explorer.etherlink.com"}/address/${ownerAddress}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Courier New', monospace; background: #050510; color: #ffffff; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { border: 1px solid #ff4444; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
        .title { color: #ff4444; font-size: 24px; font-weight: bold; margin: 0 0 8px 0; }
        .subtitle { color: #888; font-size: 14px; margin: 0; }
        .stats { display: flex; gap: 16px; margin: 24px 0; }
        .stat { background: #0a0a1a; border: 1px solid #222; border-radius: 8px; padding: 16px; flex: 1; text-align: center; }
        .stat-value { font-size: 32px; font-weight: bold; color: #ff8800; }
        .stat-label { font-size: 11px; color: #666; margin-top: 4px; }
        .cta { background: #00bfff; color: #000; text-decoration: none; display: block; text-align: center; padding: 16px; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 24px 0; }
        .address { background: #0a0a1a; border: 1px solid #222; border-radius: 8px; padding: 12px; font-size: 12px; color: #888; word-break: break-all; }
        .footer { color: #444; font-size: 11px; margin-top: 32px; border-top: 1px solid #222; padding-top: 16px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <p class="title">⚠️ DeadDrop Warning</p>
            <p class="subtitle">ETHERLINK INHERITANCE PROTOCOL</p>
        </div>

        <p>Your DeadDrop vault has been inactive for <strong style="color: #ff8800">${daysInactive} days</strong>.</p>

        <div class="stats">
            <div class="stat">
                <div class="stat-value">${daysInactive}</div>
                <div class="stat-label">DAYS INACTIVE</div>
            </div>
            <div class="stat">
                <div class="stat-value" style="color: #ff4444">${daysRemaining}</div>
                <div class="stat-label">DAYS UNTIL EXECUTION</div>
            </div>
            <div class="stat">
                <div class="stat-value">300</div>
                <div class="stat-label">DAY THRESHOLD</div>
            </div>
        </div>

        <p style="color: #ff4444; font-weight: bold;">
            If you do not respond within ${daysRemaining} days, your inheritance plan will be automatically executed on Etherlink.
        </p>

        <a href="${frontendUrl}" class="cta">💚 I'm Alive — Reset My Timer</a>

        <p style="color: #888; font-size: 13px;">Your vault address:</p>
        <div class="address">${ownerAddress}</div>

        <p style="margin-top: 16px;">
            <a href="${explorerUrl}" style="color: #00bfff;">View vault on Etherlink Explorer →</a>
        </p>

        <div class="footer">
            <p>This message was sent by the DeadDrop AI Agent monitoring your Etherlink vault.</p>
            <p>This warning has been recorded onchain for full transparency.</p>
        </div>
    </div>
</body>
</html>
    `;

  await createTransporter().sendMail({
    from: `"DeadDrop Protocol" <${process.env.EMAIL_USER}>`,
    to,
    subject: `⚠️ DeadDrop: Your vault has been inactive for ${daysInactive} days — ${daysRemaining} days remaining`,
    html,
  });

  console.log(`    📧 Warning email sent to ${to}`);
}

async function sendExecutionEmail({ to, ownerAddress, txHash, wallets, percentages, labels, totalAmount }) {
  if (!to) {
    console.warn("    ⚠️  No email address for vault, skipping execution email");
    return;
  }

  if (!isEmailConfigured()) {
    console.warn("    ⚠️  Email integration is not configured, skipping execution email");
    return;
  }

  const explorerBase = process.env.ETHERLINK_EXPLORER_URL || "https://shadownet.explorer.etherlink.com";
  const explorerUrl = `${explorerBase}/tx/${txHash}`;

  const beneficiaryRows = wallets
    .map(
      (wallet, i) => `
        <tr>
            <td style="padding: 10px; color: #ccc; text-transform: capitalize;">${labels[i] || "Beneficiary " + (i + 1)}</td>
            <td style="padding: 10px; font-family: monospace; font-size: 11px; color: #888;">${wallet}</td>
            <td style="padding: 10px; color: #00bfff; font-weight: bold; text-align: right;">${Number(percentages[i]) / 100}%</td>
        </tr>
    `
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Courier New', monospace; background: #050510; color: #ffffff; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        table { width: 100%; border-collapse: collapse; background: #0a0a1a; border: 1px solid #222; border-radius: 8px; }
        th { padding: 12px; text-align: left; color: #666; font-size: 11px; border-bottom: 1px solid #222; }
    </style>
</head>
<body>
    <div class="container">
        <h1 style="color: #ff4444;">🔴 Inheritance Executed</h1>
        <p>The DeadDrop inheritance protocol has been executed for vault:</p>
        <p style="font-family: monospace; font-size: 12px; color: #888; background: #0a0a1a; padding: 12px; border-radius: 8px;">${ownerAddress}</p>

        <p>Total distributed: <strong style="color: #00bfff;">${totalAmount} XTZ</strong></p>

        <h3>Beneficiaries:</h3>
        <table>
            <tr>
                <th>Label</th>
                <th>Wallet</th>
                <th style="text-align: right;">Share</th>
            </tr>
            ${beneficiaryRows}
        </table>

        <p style="margin-top: 24px;">
            <a href="${explorerUrl}" style="color: #00bfff; display: block; background: #0a0a1a; padding: 12px; border-radius: 8px; text-decoration: none;">
                View transaction on Etherlink Explorer →<br>
                <span style="font-size: 11px; color: #666;">${txHash}</span>
            </a>
        </p>

        <p style="color: #444; font-size: 11px; margin-top: 32px; border-top: 1px solid #222; padding-top: 16px;">
            This message was sent by the DeadDrop AI Agent. The inheritance has been permanently recorded on Etherlink.
        </p>
    </div>
</body>
</html>
    `;

  await createTransporter().sendMail({
    from: `"DeadDrop Protocol" <${process.env.EMAIL_USER}>`,
    to,
    subject: `🔴 DeadDrop: Inheritance Executed on Etherlink — ${totalAmount} XTZ Distributed`,
    html,
  });

  console.log(`    📧 Execution email sent to ${to}`);
}

module.exports = { sendWarningEmail, sendExecutionEmail };
