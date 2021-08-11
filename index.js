const fs = require('fs')
const axios = require('axios')
const Cron = require('cron').CronJob;
const { Client, Collection, Intents, Message } = require('discord.js');
require('dotenv').config();

(async () =>{
    function sendSkill() {
        client.guilds.cache.forEach((g) => {
            g.channels.cache.forEach(async (c) => {
                if(c.isText()) {
                    const res = await getSkill();
                    const message = `1 SKILL/$${Number(res.data.data.price).toFixed(2)}`
                    c.send(message);
                }
            })
        })
    }
    
    async function setStatus() {
        const skillRes = await getSkill();
        const skillMessage = `1 SKILL/$${Number(skillRes.data.data.price).toFixed(2)}`
        const bnbRes = await getBNB();
        const bnbMessage = `1 BNB/$${Number(bnbRes.data.data.price).toFixed(2)}`
        client.user.setActivity(`${skillMessage} - ${bnbMessage}`, {
            type: "WATCHING"
        })
    }
    
    const job = new Cron(
        '0 * * * *',
        sendSkill,
        null,
        false,
        'Asia/Manila'
    );
    
    const statusJob = new Cron(
        '*/1 * * * *',
        setStatus,
        null,
        false,
        'Asia/Manila'
    );
    
    
    const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
    
    client.once('ready', () => {
        console.log('Ready!');
        setStatus();
        job.start();
        statusJob.start();
    });
    
    
    client.on('messageCreate', async (msg) => {
        const content = msg.content.toLowerCase();
        if(content === '?skill') {
            const res = await getSkill()
            msg.reply(`1 SKILL/$${Number(res.data.data.price).toFixed(2)}`)
        }
        else if(content === '?bnb') {
            const res = await getBNB()
            msg.reply(`1 BNB/$${Number(res.data.data.price).toFixed(2)}`)
        }
    })
    
    const getSkill = async () => {
            const res = await axios.get('https://api.pancakeswap.info/api/v2/tokens/0x154a9f9cbd3449ad22fdae23044319d6ef2a1fab');
            return res;
    }
    
    const getBNB = async () => {
        const res = await axios.get('https://api.pancakeswap.info/api/v2/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c');
        return res;
    }
    
    try {
        await client.login(process.env.TOKEN);  
    } catch (error) {
        console.log(error);
    }
    
})();

