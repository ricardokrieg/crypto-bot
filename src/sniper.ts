require('dotenv').config({ path: '.env' })

(async () => {
  // const logStore = new LogStore()
  //
  // const sniper = new Sniper(web3LogSubscriber)
  await sniper.start()
})()

export {}
