module.exports = {
  mongoURI: process.env.MONGO_URI || "mongodb://localhost/os",
  secretOrKey: process.env.SecretOrKeys || "Secret"
};
