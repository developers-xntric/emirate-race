import type { ContactInput } from "./validation";

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

function layout(title: string, content: string, includeFooter = true) {
  return `<!doctype html><html lang="en"><body style="margin:0;background:#f5f6f8;font-family:Arial,sans-serif;color:#0b2d4d"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:32px 16px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden"><tr><td style="background:#0b2d4d;padding:28px;color:#fff;font-size:18px;font-weight:bold">EMIRATES VILLAGES RUN SERIES</td></tr><tr><td style="padding:28px;border-top:5px solid #bb0054"><h1 style="font-size:26px;margin:0 0 20px">${title}</h1>${content}</td></tr>${includeFooter ? `<tr><td style="padding:20px 28px;background:#f5f6f8;font-size:13px;color:#566777">Seven races. Seven villages. One journey across the UAE.</td></tr>` : ""}</table></td></tr></table></body></html>`;
}

export function contactEmails(input: ContactInput, config: { from: string; admin: string }, reference: string) {
  const name = escapeHtml(input.name);
  const races = escapeHtml(input.races.join(", "));
  const rows = [["Name", input.name], ["Email", input.email], ["Phone", input.phone], ["Interested in", input.races.join(", ")]];
  const details = rows.map(([label, value]) => `<tr><th align="left" style="vertical-align:top;padding:8px 16px 8px 0;font-size:14px">${label}</th><td style="padding:8px 0;font-size:14px;word-break:break-word">${escapeHtml(value)}</td></tr>`).join("");
  return [
    {
      from: config.from, to: [config.admin], reply_to: input.email,
      subject: "New EVRS contact enquiry",
      html: layout("A new enquiry has arrived", `<table role="presentation" width="100%">${details}</table><h2 style="font-size:18px;margin-top:24px">Message</h2><p style="line-height:1.6;white-space:pre-wrap;word-break:break-word">${escapeHtml(input.message)}</p>`),
      text: "New EVRS enquiry\n\n" + rows.map(([label, value]) => label + ": " + value).join("\n") + "\n\nMessage:\n" + input.message,
    },
    {
      from: config.from, to: [input.email], reply_to: config.admin,
      subject: "Thank you for contacting Emirates Villages Run Series",
      html: layout("Thank you for getting in touch", `<p style="line-height:1.6">Hello ${name},</p><p style="line-height:1.6">Thank you for contacting the Emirates Villages Run Series. We have received your enquiry and our team will get back to you as soon as possible.</p><p style="line-height:1.6"><strong>Your race interests:</strong> ${races}</p><p style="line-height:1.6">We look forward to being part of your journey.</p><p style="line-height:1.6">The EVRS Team</p>`, false),
      text: `Hello ${input.name},\n\nThank you for contacting the Emirates Villages Run Series. We have received your enquiry and our team will get back to you as soon as possible.\n\nYour race interests: ${input.races.join(", ")}\n\nThe EVRS Team`,
    },
  ];
}

export function pressKitEmails(input: { name: string; email: string; channelLink: string }, config: { from: string; admin: string }, reference: string) {
  const rows = [["Name", input.name], ["Email", input.email], ["Channel link", input.channelLink || "Not provided"]];
  const details = rows.map(([label, value]) => `<tr><th align="left" style="vertical-align:top;padding:8px 16px 8px 0;font-size:14px">${label}</th><td style="padding:8px 0;font-size:14px;word-break:break-word">${escapeHtml(value)}</td></tr>`).join("");
  return [
    { from: config.from, to: [config.admin], reply_to: input.email, subject: "New EVRS press kit download", html: layout("A press-kit download has occurred", `<p style="line-height:1.6">A visitor downloaded the official EVRS press kit.</p><table role="presentation" width="100%">${details}</table>`), text: "New EVRS press kit download\n\n" + rows.map(([label, value]) => label + ": " + value).join("\n") },
    { from: config.from, to: [input.email], reply_to: config.admin, subject: "Thank you for downloading the EVRS press kit", html: layout("Thank you for your interest", `<p style="line-height:1.6">Hello ${escapeHtml(input.name)},</p><p style="line-height:1.6">Thank you for downloading the Emirates Villages Run Series press kit.</p><p style="line-height:1.6">The EVRS Team</p>`, false), text: `Hello ${input.name},\n\nThank you for downloading the Emirates Villages Run Series press kit.\n\nThe EVRS Team` },
  ];
}
