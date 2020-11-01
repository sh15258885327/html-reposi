let commonConfig = require("./webpack.common.js");
let mergeF = require("webpack-merge").merge;
let prodConfig = {
    mode:"production",
    devtool:"cheap-module-source-map",
    optimization:{
        usedExports:true,
        splitChunks:{//webpack自动带领我们完成代码分割
            chunks:"all"
        }
    }
}
module.exports = mergeF(prodConfig,commonConfig);