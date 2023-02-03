module.exports = {
  extends: [
    "@commitlint/config-conventional", // scoped packages are not prefixed
  ],
  rules: {
    "body-max-line-length": [1, "always", 120],
  },
};
