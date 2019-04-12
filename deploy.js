const fs = require('fs')
const MWBot = require('mwbot')

const { devMwHost, depolyTable, botAccount } = require('./config')
const apiUrl = devMwHost + '/api.php'

async function main () {
  const bot = new MWBot({ apiUrl })
  await bot.loginGetEditToken(botAccount)
  Object.entries(depolyTable).map(async ([distFile, pageName]) => {
    const fileContent = fs.readFileSync('./dist/' + distFile, 'utf8')
    console.log(distFile)
    await bot.edit(pageName, fileContent)
  })
}
// In the root scope of a script, you must use the promise notation, as await is not allowed there.
main().catch(console.error)
