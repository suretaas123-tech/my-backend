module.exports = {
  beforeCreate(event) {
    const { data } = event.params;

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
};