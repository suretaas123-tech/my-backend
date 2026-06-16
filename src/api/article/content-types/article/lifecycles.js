const sendNewsletter = require("../../../../utils/sendNewsletter");

module.exports = {
  beforeCreate(event) {
  const { data } = event.params;

  console.log("TITLE:", data.title);

  if (data.title) {
    data.slug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }
},

  beforeUpdate(event) {
    const { data } = event.params;

    if (data.title) {
      data.slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
    }
  },

  async afterCreate(event) {
    try {
      const article = event.result;

      console.log("PUBLISH DETECTED:", article.title);

      const imageUrl =
  article.image?.url
    ? `https://api.theabm.info${article.image.url}`
    : "https://theabm.info/wp-content/uploads/2021/01/Welcome.jpg";
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f5f7fa">
<tr>
<td align="center">

<table width="650" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="max-width:650px;margin:20px auto;">

<tr>
<td style="padding:35px;text-align:center;border-bottom:1px solid #e5e7eb;">
<h1 style="margin:0;font-size:38px;color:#111827;">
TheABM
</h1>

<p style="margin-top:10px;color:#6b7280;">
Account-Based Marketing News & Insights
</p>
</td>
</tr>

<tr>
<td
background="${imageUrl}"
style="
background-image:url('${imageUrl}');
background-size:cover;
background-position:center;
padding:100px 40px;
text-align:center;">

<div style="background:rgba(0,0,0,0.6);padding:30px;">

<span style="
background:#0573AA;
color:#ffffff;
padding:8px 14px;
border-radius:20px;
font-size:12px;
font-weight:bold;">
NEW ARTICLE
</span>

<h1 style="
margin:20px 0 0;
font-size:40px;
line-height:1.3;
color:#ffffff;">
${article.title}
</h1>

</div>

</td>
</tr>

<tr>
<td style="padding:50px;">

<p style="
font-size:18px;
line-height:1.9;
color:#4b5563;">
${article.description || article.excerpt || ""}
</p>

<p style="margin-top:40px;">
<a
href="https://theabm.info/article/${article.slug}"
style="
background:#2563eb;
color:#ffffff;
padding:16px 32px;
text-decoration:none;
border-radius:6px;
font-weight:bold;
display:inline-block;">
Read Full Article →
</a>
</p>

</td>
</tr>
<a
href="https://theabm.info/article/${article.slug}"
style="
background:#2563eb;
color:#ffffff;
padding:16px 32px;
text-decoration:none;
border-radius:6px;
font-weight:bold;
display:inline-block;">
Read Full Article →
</a>
</p>

</td>
</tr>

<tr>
<td style="padding:0 50px;">
<hr style="border:none;border-top:1px solid #e5e7eb;">
</td>
</tr>

<tr>
<td style="padding:40px 50px;">

<h3 style="margin-top:0;color:#111827;">
Why you're receiving this email
</h3>

<p style="
color:#6b7280;
line-height:1.8;">
You subscribed to TheABM newsletter to receive the latest
Account-Based Marketing news, industry analysis, product launches,
and B2B growth insights.
</p>

</td>
</tr>

<tr>
<td style="
background:#111827;
padding:35px;
text-align:center;">

<h2 style="color:#ffffff;margin:0;">
TheABM
</h2>

<p style="
margin-top:15px;
color:#cbd5e1;
line-height:1.8;">
Trusted source for Account-Based Marketing news,
strategy, technology, and demand generation insights.
</p>

<p>
<a
href="https://theabm.info"
style="
color:#60a5fa;
text-decoration:none;
font-weight:bold;">
Visit TheABM
</a>
</p>

<p style="
font-size:12px;
color:#94a3b8;
margin-top:25px;">
© 2026 TheABM. All Rights Reserved.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;

      await sendNewsletter(article.title, htmlContent);

      console.log("NEWSLETTER SENT FOR:", article.title);
    } catch (error) {
      console.error("NEWSLETTER ERROR:", error);
    }
  },
};