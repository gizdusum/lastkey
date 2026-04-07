/**
 * LastKey Emailer
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

function getBrandUrls(ownerAddress, txHash) {
  const frontendUrl = process.env.FRONTEND_URL || "https://lastkey-theta.vercel.app";
  const explorerBase =
    process.env.ETHERLINK_EXPLORER_URL || "https://shadownet.explorer.etherlink.com";

  return {
    frontendUrl,
    ownerExplorerUrl: `${explorerBase}/address/${ownerAddress}`,
    txExplorerUrl: txHash ? `${explorerBase}/tx/${txHash}` : null,
  };
}

function renderShell({ eyebrow, title, subtitle, body, ctaLabel, ctaHref, footer }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 0; background: #050916; color: #eef2ff; font-family: Inter, Arial, sans-serif; }
    .wrap { max-width: 640px; margin: 0 auto; padding: 32px 20px; }
    .card {
      background:
        radial-gradient(circle at top left, rgba(74,143,232,0.16), transparent 38%),
        radial-gradient(circle at top right, rgba(200,169,110,0.12), transparent 32%),
        #0b1020;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 80px rgba(0,0,0,0.35);
    }
    .hero { padding: 28px 28px 10px; }
    .eyebrow {
      display: inline-block;
      padding: 8px 12px;
      border-radius: 999px;
      border: 1px solid rgba(74,143,232,0.24);
      background: rgba(74,143,232,0.08);
      color: #90bfff;
      font-size: 11px;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      font-weight: 700;
    }
    h1 { margin: 18px 0 0; font-size: 34px; line-height: 1.08; }
    .subtitle { margin: 12px 0 0; color: #c8d4f2; font-size: 16px; line-height: 1.7; }
    .body { padding: 0 28px 8px; color: #9eabc8; font-size: 15px; line-height: 1.8; }
    .panel {
      margin: 18px 28px;
      padding: 18px;
      border-radius: 18px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
    }
    .grid { display: grid; gap: 14px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .stat { padding: 16px; border-radius: 18px; background: rgba(3,6,14,0.55); border: 1px solid rgba(255,255,255,0.06); }
    .value { font-size: 28px; font-weight: 800; color: #f0f4ff; }
    .label { margin-top: 6px; color: #7f8baa; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; }
    .cta {
      display: inline-block;
      margin: 14px 28px 28px;
      padding: 14px 18px;
      border-radius: 14px;
      background: linear-gradient(135deg, #4a8fe8 0%, #c8a96e 100%);
      color: #050916 !important;
      font-weight: 800;
      text-decoration: none;
    }
    .footer {
      padding: 0 28px 28px;
      color: #6d7895;
      font-size: 12px;
      line-height: 1.7;
    }
    a { color: #8fb7ff; }
    .mono { font-family: "SFMono-Regular", Menlo, monospace; font-size: 12px; color: #8d9abc; word-break: break-all; }
    .accent-gold { color: #e5c07b; }
    .accent-blue { color: #90bfff; }
    @media (max-width: 640px) {
      .grid { grid-template-columns: 1fr; }
      h1 { font-size: 28px; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="hero">
        <span class="eyebrow">${eyebrow}</span>
        <h1>${title}</h1>
        <p class="subtitle">${subtitle}</p>
      </div>
      ${body}
      ${
        ctaLabel && ctaHref
          ? `<a class="cta" href="${ctaHref}">${ctaLabel}</a>`
          : ""
      }
      <div class="footer">${footer}</div>
    </div>
  </div>
</body>
</html>
`;
}

async function sendWelcomeEmail({ to, ownerAddress }) {
  if (!to) {
    console.warn("    ⚠️  No email address for vault, skipping welcome email");
    return false;
  }

  if (!isEmailConfigured()) {
    console.warn("    ⚠️  Email integration is not configured, skipping welcome email");
    return false;
  }

  const { frontendUrl, ownerExplorerUrl } = getBrandUrls(ownerAddress);
  const html = renderShell({
    eyebrow: "LastKey Welcome",
    title: "Your continuity rail is live.",
    subtitle:
      "LastKey now watches your vault for three signals: manual check-ins, detected onchain wallet activity, and qualified auto-resets.",
    body: `
      <div class="body">
        <div class="panel">
          <div class="grid">
            <div class="stat">
              <div class="value accent-blue">Day 0</div>
              <div class="label">Vault activated</div>
            </div>
            <div class="stat">
              <div class="value accent-gold">Day 293</div>
              <div class="label">Warning email</div>
            </div>
            <div class="stat">
              <div class="value">Day 300</div>
              <div class="label">Execution threshold</div>
            </div>
          </div>
        </div>
        <div class="panel">
          <strong>How it works</strong>
          <p>
            LastKey accepts a direct manual check-in from you, detects qualified onchain activity from your wallet,
            and only allows execution when the full protection window passes without a valid signal.
          </p>
          <p class="mono">${ownerAddress}</p>
          <p><a href="${ownerExplorerUrl}">View your vault on Etherlink Explorer →</a></p>
        </div>
      </div>
    `,
    ctaLabel: "Open LastKey Vault →",
    ctaHref: frontendUrl,
    footer:
      "This onboarding email confirms that your vault is now being watched by the LastKey monitoring agent on Etherlink.",
  });

  await createTransporter().sendMail({
    from: `"LastKey Protocol" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🔑 LastKey: Your continuity vault is now live",
    html,
  });

  console.log(`    📧 Welcome email sent to ${to}`);
  return true;
}

async function sendWarningEmail({ to, ownerAddress, daysInactive, daysRemaining }) {
  if (!to) {
    console.warn("    ⚠️  No email address for vault, skipping warning email");
    return false;
  }

  if (!isEmailConfigured()) {
    console.warn("    ⚠️  Email integration is not configured, skipping warning email");
    return false;
  }

  const { frontendUrl, ownerExplorerUrl } = getBrandUrls(ownerAddress);
  const html = renderShell({
    eyebrow: "LastKey Warning",
    title: "Your vault needs a check-in.",
    subtitle: `LastKey has not seen a valid signal for ${daysInactive} days. A manual check-in or qualified onchain activity is still enough to protect the vault.`,
    body: `
      <div class="body">
        <div class="panel">
          <div class="grid">
            <div class="stat">
              <div class="value accent-gold">${daysInactive}</div>
              <div class="label">Days inactive</div>
            </div>
            <div class="stat">
              <div class="value" style="color:#ff9d8f">${daysRemaining}</div>
              <div class="label">Days remaining</div>
            </div>
            <div class="stat">
              <div class="value">293</div>
              <div class="label">Warning stage</div>
            </div>
          </div>
        </div>
        <div class="panel">
          <strong>What happens next</strong>
          <p>
            If LastKey detects no manual check-in and no qualified signed wallet activity before day 300,
            your continuity plan may execute automatically on Etherlink.
          </p>
          <p class="mono">${ownerAddress}</p>
          <p><a href="${ownerExplorerUrl}">Review this vault on Etherlink Explorer →</a></p>
        </div>
      </div>
    `,
    ctaLabel: "🔑 I'm Still Here — Reset My Timer",
    ctaHref: frontendUrl,
    footer:
      "This warning was generated by the LastKey monitoring agent and recorded in the protocol timeline for transparency.",
  });

  await createTransporter().sendMail({
    from: `"LastKey Protocol" <${process.env.EMAIL_USER}>`,
    to,
    subject: `⚠️ LastKey: Your vault has been inactive for ${daysInactive} days — ${daysRemaining} days remaining`,
    html,
  });

  console.log(`    📧 Warning email sent to ${to}`);
  return true;
}

async function sendExecutionEmail({ to, ownerAddress, txHash, wallets, percentages, labels, totalAmount }) {
  if (!to) {
    console.warn("    ⚠️  No email address for vault, skipping execution email");
    return false;
  }

  if (!isEmailConfigured()) {
    console.warn("    ⚠️  Email integration is not configured, skipping execution email");
    return false;
  }

  const { txExplorerUrl } = getBrandUrls(ownerAddress, txHash);

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

  const html = renderShell({
    eyebrow: "LastKey Execution",
    title: "Your continuity plan has executed.",
    subtitle:
      "The full inactivity window passed without a valid reset, so LastKey executed the final beneficiary instruction on Etherlink.",
    body: `
      <div class="body">
        <div class="panel">
          <div class="grid">
            <div class="stat">
              <div class="value accent-blue">${totalAmount}</div>
              <div class="label">XTZ distributed</div>
            </div>
            <div class="stat">
              <div class="value">${wallets.length}</div>
              <div class="label">Beneficiaries</div>
            </div>
            <div class="stat">
              <div class="value accent-gold">300</div>
              <div class="label">Day threshold</div>
            </div>
          </div>
        </div>
        <div class="panel">
          <strong>Distribution summary</strong>
          <table style="width:100%; margin-top:14px; border-collapse:collapse; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:16px; overflow:hidden;">
            <tr>
              <th style="padding:12px; text-align:left; color:#7f8baa; font-size:11px; border-bottom:1px solid rgba(255,255,255,0.06);">Label</th>
              <th style="padding:12px; text-align:left; color:#7f8baa; font-size:11px; border-bottom:1px solid rgba(255,255,255,0.06);">Wallet</th>
              <th style="padding:12px; text-align:right; color:#7f8baa; font-size:11px; border-bottom:1px solid rgba(255,255,255,0.06);">Share</th>
            </tr>
            ${beneficiaryRows}
          </table>
          <p class="mono" style="margin-top:14px;">${ownerAddress}</p>
        </div>
      </div>
    `,
    ctaLabel: "View execution on Etherlink →",
    ctaHref: txExplorerUrl,
    footer:
      "This execution has been finalized on Etherlink and recorded permanently in the protocol history.",
  });

  await createTransporter().sendMail({
    from: `"LastKey Protocol" <${process.env.EMAIL_USER}>`,
    to,
    subject: `🔴 LastKey: Continuity Plan Executed on Etherlink — ${totalAmount} XTZ Distributed`,
    html,
  });

  console.log(`    📧 Execution email sent to ${to}`);
  return true;
}

module.exports = { sendWelcomeEmail, sendWarningEmail, sendExecutionEmail };
