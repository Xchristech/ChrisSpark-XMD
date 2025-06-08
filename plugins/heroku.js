const { ezra } = require('../fredi/ezra');
const s = require('../set');

ezra(
  {
    nomCom: "setvar",
    categorie: "Chris-Heroku",
    reaction: "⚙️",
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, arg } = commandeOptions;

    try {
      console.log('DEBUG - setvar triggered:', { arg, superUser });

      if (!superUser) {
        return repondre(`CHRISSPARK-XMD says only owner or Chris can use this command 🚫`);
      }

      if (!arg[0] || !arg.join(' ').includes('=')) {
        return repondre(`CHRISSPARK-XMD\n\n╭┈┈┈┈┈┈┈┈┈┈┈┈\n│❒ Use this Format it right, like: .setvar OWNER_NUMBER=2348069675806\n╰┈┈┈┈┈┈┈┈┈┈┈┈`);
      }

      const text = arg.join(' ').trim();
      const [key, value] = text.split('=').map(str => str.trim());

      if (!key || !value) {
        return repondre(`CHRISSPARK-XMD says STOP WASTING MY TIME! Provide a valid KEY=VALUE pair!🙂‍↔️`);
      }

      if (!s.HEROKU_API_KEY || !s.HEROKU_APP_NAME) {
        return repondre(`CHRISSPARK-XMD says CONFIG ERROR! HEROKU_API_KEY or HEROKU_APP_NAME missing in set.js! Fix it now!`);
      }

      const Heroku = require("heroku-client");
      const heroku = new Heroku({ token: s.HEROKU_API_KEY });
      const baseURI = `/apps/${s.HEROKU_APP_NAME}`;

      await heroku.patch(`${baseURI}/config-vars`, {
        body: { [key]: value },
      });

      await repondre(`CHRISSPARK-XMD\n\n╭┈┈┈┈┈┈┈┈┈┈┈┈\n│❒ BOOM! Heroku var ${key} set to ${value}! bot is rebooting...🛒\n╰┈┈┈┈┈┈┈┈┈┈┈┈`);

    } catch (error) {
      console.error('setvar error:', error);
      await repondre(`CHRISSPARK-XMD FAIL! Something broke: ${error.message} 😴 Fix it or suffer!`);
    }
  }
);

ezra(
  {
    nomCom: "allvar",
    categorie: "Chris-Heroku",
    reaction: "📋",
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser } = commandeOptions;

    try {
      console.log('DEBUG - allvar triggered:', { superUser });

      if (!superUser) {
        return repondre(`CHRISSPARK-XMD says only owner or Fredie can use this command 🚫`);
      }

      if (!s.HEROKU_API_KEY || !s.HEROKU_APP_NAME) {
        return repondre(`CHRISSPARK-XMD CONFIG DISASTER! HEROKU_API_KEY or HEROKU_APP_NAME missing in set.js! Sort it out! 🙂‍↕️`);
      }

      const Heroku = require("heroku-client");
      const heroku = new Heroku({ token: s.HEROKU_API_KEY });
      const baseURI = `/apps/${s.HEROKU_APP_NAME}`;

      const vars = await heroku.get(`${baseURI}/config-vars`);
      let str = `CHRISSPARK-XMD VARS\n\n╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n`;
      for (const vr in vars) {
        str += `🛒 *${vr}* = ${vars[vr]}\n`;
      }
      str += `╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`;

      await repondre(str);

    } catch (error) {
      console.error('allvar error:', error);
      await repondre(`CHRISSPARK-XMD\nCRASH AND BURN! Error: ${error.message} 😡 Get it together!`);
    }
  }
);

ezra(
  {
    nomCom: "getvar",
    categorie: "Chris-Heroku",
    reaction: "🔍",
  },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, arg } = commandeOptions;

    try {
      console.log('DEBUG - getvar triggered:', { arg, superUser });

      if (!superUser) {
        return repondre(`CHRISSPARK-XMD says only owner or Chris can use this command 🚫`);
      }

      if (!arg[0]) {
        return repondre(`CHRISSPARK-XMD\n Give me a variable name in CAPS! 😮‍💨`);
      }

      const varName = arg.join(' ').trim().toUpperCase();

      if (!s.HEROKU_API_KEY || !s.HEROKU_APP_NAME) {
        return repondre(`CHRISSPARK-XMD\nCONFIG FAILURE! HEROKU_API_KEY or HEROKU_APP_NAME missing in set.js! Fix it! 😵`);
      }

      const Heroku = require("heroku-client");
      const heroku = new Heroku({ token: s.HEROKU_API_KEY });
      const baseURI = `/apps/${s.HEROKU_APP_NAME}`;

      const vars = await heroku.get(`${baseURI}/config-vars`);
      if (vars[varName]) {
        await repondre(`CHRISSPARK-XMD\n\n╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n│❒ GOT IT! ${varName} = ${vars[varName]} 🚀\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈`);
      } else {
        await repondre(`NOPE! Variable ${varName} doesn't exist, try again!`);
      }

    } catch (error) {
      console.error('getvar error:', error);
      await repondre(`CHRISSPARK-XMD\nTOTAL FAILURE! Error: ${error.message} 😡 Fix this mess!`);
    }
  }
);