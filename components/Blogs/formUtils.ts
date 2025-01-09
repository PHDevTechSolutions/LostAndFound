export const generateLink = (title: string) => {
    return `blogs/${title.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "")}`;
  };
  