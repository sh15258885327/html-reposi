let webpack = require("webpack");
let commonConfig = require("./webpack.common.js");
let mergeF = require("webpack-merge").merge;
let devConfig = {
    mode:"development",
    devtool:"cheap-module-eval-source-map",
    devServer:{
        contentBase:"./bundle",//这个是我们的路径
        open:true,
        port:6666,
        hot:true,
        hotOnly:true
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin()
    ]
}
module.exports = mergeF(devConfig,commonConfig);