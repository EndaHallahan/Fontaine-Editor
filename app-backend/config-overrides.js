var path = require ('path');
var fs = require ('fs');
const {
    override,
    addDecoratorsLegacy,
    babelInclude,
    disableEsLint,
} = require("customize-cra");

module.exports = function (config, env) {
    return Object.assign(config, override(
        /*
            Fixes CRA not playing nice with local linked imports for SOME REASON.
            Relevant issue: https://github.com/facebook/create-react-app/issues/5100
        */
        babelInclude([
            path.resolve('src'),
            fs.realpathSync("node_modules/@fontaine/app-frontend/src")
        ])
        )(config, env)
    )
}