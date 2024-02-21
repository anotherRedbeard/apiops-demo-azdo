/**
 * This script automates capturing the content of API Management developer portals into snapshot.
 * In order to run it, you need to:
 * 
 * 1) Clone the api-management-developer-portal repository:
 *    git clone https://github.com/Azure/api-management-developer-portal.git
 * 
 * 2) Install NPM  packages:
 *    npm install
 * 
 * 3) Run this script with a valid combination of arguments:
 *    node ./capture ^
 *   --subscriptionId < your subscription ID > ^
 *   --resourceGroupName < your resource group name > ^
 *   --serviceName < your service name > ^
 *   --folder < your folder path > ^
 *   --timestamp ^
 *   --tenantId < your tenant ID > ^
 *   --servicePrincipal < your service principal ID > ^
 *   --servicePrincipalSecret < your service principal secret >
 */

const path = require("path");
const { ImporterExporter } = require("./utils");

const yargs = require('yargs')
    .example(`node ./capture ^ \r
     --subscriptionId "< your subscription ID >" ^ \r
     --resourceGroupName "< your resource group name >" ^ \r
     --serviceName "< your service name >"\n`)
    .option('subscriptionId', {
        type: 'string',
        description: 'Azure subscription ID.',
        demandOption: true
    })
    .option('resourceGroupName', {
        type: 'string',
        description: 'Azure resource group name.',
        demandOption: true
    })
    .option('serviceName', {
        type: 'string',
        description: 'API Management service name.',
        demandOption: true
    })
    .option('folder', {
        type: 'string',
        default: '../dist/snapshot',
        description: 'The path to the folder which will contain the content of the portal',
        example: '../dist/snapshot',
        demandOption: false
    })
    .option('timestamp', {
        type: 'boolean',
        description: 'Adds a timestamp to the folder where the content is stored',
        demandOption: false
    })
    .option('tenantId', {
        type: 'string',
        description: 'tenant ID.',
        demandOption: false
    })
    .option('servicePrincipal', {
        type: 'string',
        description: 'service principal ID.',
        demandOption: false
    })
    .option('servicePrincipalSecret', {
        type: 'string',
        description: 'service principal secret.',
        demandOption: false
    })
    .help()
    .argv;

async function capture() {

    // make the folder path understandable if running in Windows
    const folder = yargs.folder.split("\\").join("/");

    // get the absolute path
    var absoluteFolder = path.resolve(folder);

    // add the timestamp to the path if requested
    if (yargs.timestamp) {
        const timestamp = new Date();
        const postfix = "-" +
            timestamp.getFullYear() +
            makeTwo(timestamp.getMonth() + 1) +
            makeTwo(timestamp.getDate()) +
            makeTwo(timestamp.getHours()) +
            makeTwo(timestamp.getMinutes()) +
            makeTwo(timestamp.getSeconds());

        absoluteFolder += postfix;
    }

    const importerExporter = new ImporterExporter(
        yargs.subscriptionId,
        yargs.resourceGroupName,
        yargs.serviceName,
        yargs.tenantId, 
        yargs.servicePrincipal, 
        yargs.servicePrincipalSecret,
        absoluteFolder
    );

    await importerExporter.export();

    console.log(`The content was captured in the ${absoluteFolder} folder.`);
}

function makeTwo(digits) {
    const asString = digits.toString();

    if (asString.length == 0) {
        return "00";
    }

    if (asString.length == 1) {
        return "0" + asString;
    }

    return asString.slice(-2);
}

capture()
    .then(() => {
        console.log("DONE");
        process.exit(0);
    })
    .catch(error => {
        console.error(error.message);
        process.exit(1);
    });


module.exports = {
    capture
}
