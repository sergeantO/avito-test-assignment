// vue.config.js
module.exports = {
  css: {
   loaderOptions: {
    sass: {
     data: `
      @import "./node_modules/bootstrap/scss/_functions.scss";
      @import "@/scss/_variables.scss";
     `
    }
   }
  }
};