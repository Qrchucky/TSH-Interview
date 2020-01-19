const path = require("path"),
  { CleanWebpackPlugin } = require("clean-webpack-plugin"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  context: path.resolve(__dirname, "src"),

  entry: {
    app: "./index.js"
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "./assets/js/[name].bundle.js"
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: /src/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env"]
          }
        }
      },
      {
        test: /\.html$/,
        use: ["html-loader"]
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "./assets/media/"
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ template: "index.html" }),
    new MiniCssExtractPlugin({
      filename: "css/mystyles.css"
    })
  ],

  devServer: {
    contentBase: path.resolve(__dirname, "./dist/assets/media"),
    compress: true,
    port: 2000,
    stats: "errors-only",
    open: true
  },

  devtool: "none"
};
