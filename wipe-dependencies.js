/* kommt in der package.json unter script dann kann es als task npm ausgeführt werden
"scripts": {
    "update:packages": "node wipe-dependencies.js && rm -rf node_modules && npm update --save-dev && npm update --save",
}
 */
const fs = require('fs')
const wipeDependencies = () => {
    const file = fs.readFileSync('package.json')
    const content = JSON.parse(file)
    for (var devDep in content.devDependencies) {
        if (content.devDependencies[devDep].match(/\W+\d+.\d+.\d+-?((alpha|beta|rc)?.\d+)?/g)) {
            content.devDependencies[devDep] = '*';
        }
    }
    for (var dep in content.dependencies) {
        if (content.dependencies[dep].match(/\W+\d+.\d+.\d+-?((alpha|beta|rc)?.\d+)?/g)) {
            content.dependencies[dep] = '*';
        }
    }
    fs.writeFileSync('package.json', JSON.stringify(content))
}
if (require.main === module) {
    wipeDependencies()
} else {
    module.exports = wipeDependencies
}
