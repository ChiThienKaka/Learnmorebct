const {
    override, useBabelRc
  } = require("customize-cra");

  
module.exports = override(
  useBabelRc(),
  (config) => {
    // Tìm quy tắc source-map-loader
    const sourceMapLoader = config.module.rules.find(
      (rule) => rule.loader && rule.loader.includes('source-map-loader')
    );

    // Nếu có source-map-loader, chỉnh sửa quy tắc để bỏ qua docx-preview
    if (sourceMapLoader) {
      sourceMapLoader.exclude = [
        /node_modules[\\/]docx-preview[\\/]/,
      ];
    }

    return config;
  }
);
