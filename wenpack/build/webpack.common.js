let path = require("path");
let htmlWebpackPlugin = require("html-webpack-plugin");
let {CleanWebpackPlugin} = require("clean-webpack-plugin");
module.exports={
    entry:{
        shenjie:'./src/js/index.js'
    },
    output:{
        path:path.resolve(__dirname,"../bundle")
    },
    module:{
        rules:[
            {
                test:/\.(jpg|jpeg|png|gif)$/,
                use:{
                    loader:'url-loader',
                    options:{
                        outputPath:'/images',
                        name:'air.jpg',
                        limit:2048
                    }
                }
               
            },
            {
                test:/\.(css|scss)$/,
                use:[
                    "style-loader",
                    {
                        loader:"css-loader",
                        options:{
                            importLoaders:2
                        }
                    },
                    "sass-loader",
                    "postcss-loader"
                ]
            },
            {
                test:/\.(eot|svg|ttf|woff|woff2)$/,
                use:{
                    loader:"file-loader",
                    options:{
                        outputPath:"./font",
                        name:"[name].[ext]"
                    }
                }
                
            },
            {
                test:/\.js$/,
                exclude:/node_modules/,
                loader:"babel-loader",
                options:{
                    presets:[["@babel/preset-env",{
                        useBuiltIns:"usage",
                        targets:{
                            edge:"17",
                            chrome:"67",
                            safari:"11.1"
                        }
                    }]],
                    "plugins":["@babel/plugin-transform-runtime"]
                }
                        
            } 
        ]
    },
    plugins:[
        new htmlWebpackPlugin({
            template:"./src/html/template.html"
        }),
        new CleanWebpackPlugin(),
    ]
}