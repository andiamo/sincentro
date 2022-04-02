const Dotenv = require("dotenv-webpack");

module.exports = {
  type: "web-app",
  webpack: {
    copy: [
      {from: './assets/*.png', to: './'},
      {from: './assets/portadas/*.jpg', to: './'},
      {from: './favicon.ico', to: './'},
      {from: './assets/*.ttf', to: './'}
    ],
    extra: {
      plugins: [
        new Dotenv({
          path:
            process.env.NODE_ENV === "production"
              ? "./variables/prod.env"
              : "./variables/dev.env"
        })
      ]
    },
  }
};
