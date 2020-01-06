module.exports = {
  publicPath: "./",
  outputDir: "dist",
  devServer: {
    proxy: 'http://localhost:3000'
  }
};
