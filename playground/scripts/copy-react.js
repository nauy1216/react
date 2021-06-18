const path = require('path')
const fs = require('fs')
const { copy } = require('fs-extra')

function resolveSourcePath(file) {
    return path.resolve(__dirname, `../../build/node_modules/${file}`)
}

function resolveTargetPath(file) {
    return path.resolve(__dirname, `../src/react-lib/${file}`)
}

function copyDir(srource, target) {
    copy()
}

function copyFile(srource, target) {
    fs.readFile(srource, (err, data) => {
        if (err) {
            console.error(err)
            process.exit(1)
            return
        }
        if (data) {
            fs.writeFileSync(target, data)
        }
    })  
}

// const reactFileSrc = resolveSourcePath('react.development.js')
// const reactDomFileSrc = resolveSourcePath('react-dom.development.js')
// const reactFileTarget = resolveTargetPath('react.js')
// const reactDomFileTarget = resolveTargetPath('react-dom.js')

module.exports.copyReact = function copyReact() {
    copyFile(
        resolveSourcePath('react/cjs/react.development.js'),
        resolveTargetPath('react.js')
    )
    copyFile(
        resolveSourcePath('react-dom/cjs/react-dom.development.js'),
        resolveTargetPath('react-dom.js')
    )
}

