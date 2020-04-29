const postsValidation = {
  time: (data) => !Number.isNaN(Date.parse(data)),
  title: (data) => data.length <= 50,
  article: (data) => data.length <= 4000,
};

export default postsValidation;
