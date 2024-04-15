const app = require('whatsapp-web.js')
const qdb = require(`quick.db`)
const cheerio = require(`cheerio`)
const request = require(`request`)
const puppeteer = require(`puppeteer`)

module.exports = {
    name: 'meme', // Command Name
async execute(message, args, client, db, browser){
        //const apiUrl = `https://candaan-api.vercel.app/api/image/random`;
        //const apiUrl = `https://candaan-api.vercel.app/api/image/random`
        //const response = await fetch(apiUrl);
        //const data = await response.json();
        //console.log(data)
        //const media = await app.MessageMedia.fromUrl(data.data.url);
        //await client.sendMessage(message.from, media /*{caption: data.data.title} */);

        const url = `https://lahelu.com/shuffle`
        const page = await browser.newPage()
        let src = ""
        let caption = ""
        let type = ""
        await page.goto(url, {waitUntil: 'load', timeout: 0});
        
        if(await page.$('.Typography_overflow__R5BlX') != null) {
            caption = await page.$eval(".Typography_overflow__R5BlX", n => n.innerHTML).catch(e => console.log(e))
        }
        if(await page.$('.Video_wrapper__r8q2c') != null) {
            src = await page.$eval(".Video_wrapper__r8q2c video", n => n.getAttribute("src")).catch(e => console.log(e));
            type = "video"
        }
        else if(await page.$('.Image_wrapper__jJZVH') != null) {
            src = await page.$eval(".Image_wrapper__jJZVH img", n => n.getAttribute("src")).catch(e => console.log(e));
        }
        if (src == "") {
            await page.reload({waitUntil: 'load', timeout: 0});
        }
        console.log(src, caption)
        const media = await app.MessageMedia.fromUrl(src, {unsafeMime: true}).catch(e => console.log(e).then(() => client.sendMessage(message.from, "Failed to get meme, please try again.")));
        await client.sendMessage(message.from, media, {caption: caption || ""}).catch(e => console.log(e));
    }
}