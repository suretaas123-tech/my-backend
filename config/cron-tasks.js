'use strict';

const axios = require('axios');

module.exports = {
  '0 19 * * *': async ({ strapi }) => {
    try {
      console.log('Running Daily Newsletter...');


     const articles = await strapi.entityService.findMany(
  'api::article.article',
  {
    filters: {
      newsletterSent: false,
      publishedAt: {
        $notNull: true,
      },
    },
    populate: {
      featuredImage: true,
      category: true,
      authors: true,
      tags: true,
    },
    sort: { publishedAt: 'desc' },
  }
);

      if (!articles.length) {
        console.log('No new articles found');
        return;
      }

      const subscribers = await strapi.entityService.findMany(
        'api::subscriber.subscriber',
        {}
      );

      if (!subscribers.length) {
        console.log('No subscribers found');
        return;
      }

      // CREATE ARTICLE CARDS
      const articleList = articles
  .map((article) => {
    const imageUrl = article.featuredImage?.url
  ? article.featuredImage.url.startsWith("http")
    ? article.featuredImage.url
    : `https://api.theabm.info${article.featuredImage.url}`
  : "https://theabm.info/logo.png";

console.log("EMAIL IMAGE:", imageUrl);



    const description =
      article.excerpt ||
      article.description ||
      (article.body
        ? article.body.substring(0, 180) + "..."
        : "");

    return `
      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        style="
          border:1px solid #e5e7eb;
          border-radius:10px;
          margin-bottom:25px;
          background:#ffffff;
        "
      >
        <tr>

          <!-- LEFT IMAGE -->
          <td
            width="40%"
            style="
              padding:20px;
              vertical-align:top;
            "
          >
            <img
              src="${imageUrl}"
              width="350"
              style="
                width:100%;
                max-width:350px;
                height:220px;
                object-fit:cover;
                border-radius:8px;
                display:block;
              "
            />
          </td>

          <!-- RIGHT CONTENT -->
          <td
            width="60%"
            style="
              padding:25px;
              vertical-align:top;
            "
          >

            <div
              style="
                display:inline-block;
                background:#0B5E94;
                color:#ffffff;
                padding:6px 12px;
                border-radius:4px;
                font-size:12px;
                font-weight:bold;
                margin-bottom:15px;
              "
            >
              ${article.category?.name || "ABM News"}
            </div>

            <h2
              style="
                margin:0 0 15px;
                color:#13294B;
                font-size:30px;
                line-height:38px;
              "
            >
              ${article.title}
            </h2>

            <p
              style="
                color:#5b6472;
                font-size:16px;
                line-height:28px;
                margin-bottom:25px;
              "
            >
              ${description}
            </p>

            <a
              href="https://theabm.info/articles/${article.slug}"
              style="
                background:#0B5E94;
                color:#ffffff;
                text-decoration:none;
                padding:12px 24px;
                border-radius:6px;
                display:inline-block;
                font-weight:bold;
              "
            >
              Read More
            </a>

          </td>

        </tr>
      </table>
    `;
  })
  .join("");

      // NEWSLETTER WRAPPER
     const html = `
<!DOCTYPE html>
<html>
<body
  style="
    margin:0;
    padding:30px;
    background:#f4f6f9;
    font-family:Arial,sans-serif;
  "
>

<table width="100%">
<tr>
<td align="center">

<table
  width="1000"
  cellpadding="0"
  cellspacing="0"
  style="
    background:#ffffff;
    border-radius:12px;
    overflow:hidden;
  "
>

<tr>
<td
  align="center"
  style="
    background:#004B9A;
    padding:50px 20px;
  "
>
<h1
  style="
    color:#ffffff;
    margin:0;
    font-size:48px;
  "
>
Today's ABM News Digest
</h1>

<p
  style="
    color:#ffffff;
    margin-top:15px;
    font-size:20px;
  "
>
All the latest articles from ABM, in one place.
</p>
</td>
</tr>

<tr>
<td style="padding:30px;">
${articleList}
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
      // SEND EMAILS
      for (const subscriber of subscribers) {
        await axios.post(
          'https://api.brevo.com/v3/smtp/email',
          {
            sender: {
              name: 'The ABM',
              email: 'newsletter@theabm.info',
            },
            to: [
              {
                email: subscriber.email,
              },
            ],
            subject: "Today's ABM News Digest",
            htmlContent: html,
          },
          {
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              'api-key': process.env.BREVO_API_KEY,
            },
          }
        );
      }

    // MARK AS SENT
for (const article of articles) {
  await strapi.entityService.update(
    'api::article.article',
    article.id,
    {
      data: {
        newsletterSent: true,
        newsletterSentAt: new Date(),
      },
    }
  );
}

      console.log(
        `Newsletter sent with ${articles.length} articles to ${subscribers.length} subscribers`
      );
    } catch (err) {
      console.error('Newsletter Error:', err.response?.data || err);
    }
  },
};