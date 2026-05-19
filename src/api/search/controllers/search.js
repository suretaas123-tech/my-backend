export default {
  async globalSearch(ctx) {
    const { q } = ctx.query;

    if (!q) {
      ctx.body = { data: [] };
      return;
    }

    const contentTypes = Object.values(strapi.contentTypes).filter(
      (ct) =>
        ct.kind === "collectionType" &&
        ct.uid.startsWith("api::")
    );

    let results = [];

    for (const ct of contentTypes) {
      try {
        const entries = await strapi.documents(ct.uid).findMany({
          filters: {
            $or: [
              { title: { $containsi: q } },
              { name: { $containsi: q } },
              { slug: { $containsi: q } },
              { description: { $containsi: q } },
              { content: { $containsi: q } },
            ],
          },
          limit: 5,
        });

        if (!entries || !Array.isArray(entries)) continue;

        const formatted = entries.map((item) => ({
          id: item.id,
          title: item.title || item.name || "No Title",
          slug: item.slug || "",
          type: ct.info.displayName,
        }));

        results.push(...formatted);
      } catch (err) {
        continue;
      }
    }

    ctx.body = { data: results };
  },
};