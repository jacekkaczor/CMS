const {
    override,
    fixBabelImports,
    addLessLoader,
} = require("customize-cra");


module.exports = override(
    fixBabelImports("import", {
        libraryName: "antd", libraryDirectory: "es", style: true
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: { 
            "@primary-color": "#EE7600", 
            "@layout-body-background": "#FFFFFF",
            "@layout-footer-background": "#FFFFFF" 
        }
    })
);