const { fetchJson } = require('../../lib/myfunc');
const { ringtone } = require('../../lib/scraper');
const fetch = require('node-fetch'); 
const myTikTokVideos = require("../../Media/tiktokquote.js");
const { toMp3, audioToVideo } = require("../../lib/converter"); 
const FormData = require("form-data");
const { Buffer } = require("buffer");
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const yts = require('yt-search');
const prefixes = [".", ","];

module.exports = [ {
  command: ['apk', 'apkdl'],
  operate: async ({ m, text, ChrisSpark, botname, reply }) => {
    if (!text) return reply("*Which apk do you want to download?*");
    
    try {
      let kyuu = await fetchJson(`https://bk9.fun/search/apk?q=${text}`);
      let hector = await fetchJson(`https://bk9.fun/download/apk?id=${kyuu.BK9[0].id}`);

      await ChrisSpark.sendMessage(
        m.chat,
        {
          document: { url: hector.BK9.dllink },
          fileName: Chris.BK9.name,
          mimetype: "application/vnd.android.package-archive",
          contextInfo: {
            externalAdReply: {
              title: botname,
              body: `${hector.BK9.name}`,
              thumbnailUrl: `${hector.BK9.icon}`,
              sourceUrl: `${Chris.BK9.dllink}`,
              mediaType: 2,
              showAdAttribution: true,
              renderLargerThumbnail: false
            }
          }
        },
        { quoted: m }
      );
    } catch (error) {
      reply(`*Error fetching APK details*\n${error.message}`);
    }
  }
 }, {
  command: ['download'],
  operate: async ({ m, text, ChrisSpark, reply }) => {
    if (!text) return reply('Enter download URL');
    
    try {
      let res = await fetch(text, { method: 'GET', redirect: 'follow' });
      let contentType = res.headers.get('content-type');
      let buffer = await res.buffer();
      let extension = contentType.split('/')[1]; 
      let filename = res.headers.get('content-disposition')?.match(/filename="(.*)"/)?.[1] || `download-${Math.random().toString(36).slice(2, 10)}.${extension}`;

      let mimeType;
      switch (contentType) {
        case 'audio/mpeg':
          mimeType = 'audio/mpeg';
          break;
        case 'image/png':
          mimeType = 'image/png';
          break;
        case 'image/jpeg':
          mimeType = 'image/jpeg';
          break;
        case 'application/pdf':
          mimeType = 'application/pdf';
          break;
        case 'application/zip':
          mimeType = 'application/zip';
          break;
        case 'video/mp4':
          mimeType = 'video/mp4';
          break;
        case 'video/webm':
          mimeType = 'video/webm';
          break;
        case 'application/vnd.android.package-archive':
          mimeType = 'application/vnd.android.package-archive';
          break;
        default:
          mimeType = 'application/octet-stream';
      }

      ChrisSpark.sendMessage(m.chat, { document: buffer, mimetype: mimeType, fileName: filename }, { quoted: m });
    } catch (error) {
      reply(`Error downloading file: ${error.message}`);
    }
  }
}, {
  command: ["fb", "facebook"],
  operate: async ({
    m: _0x152311,
    text: _0x4c920f,
    ChrisSpark: _0x27929e,
    reply: _0x3291fc,
    fetchJson // Assuming fetchJson is available in the context
  }) => {
    // React with download emoji when command is received
    await _0x27929e.sendMessage(_0x152311.chat, {
      react: {
        text: "⌛",
        key: _0x152311.key
      }
    });

    if (!_0x4c920f) {
      await _0x27929e.sendMessage(_0x152311.chat, {
        react: {
          text: "❌",
          key: _0x152311.key
        }
      });
      return _0x3291fc("*Please provide a Facebook video url!*");
    }
    try {
      var _0x1c570a = await fetchJson("https://api-aswin-sparky.koyeb.app/api/downloader/fbdl?url=" + _0x4c920f);
      if (!_0x1c570a || !_0x1c570a.data || !_0x1c570a.data.high) {
        await _0x27929e.sendMessage(_0x152311.chat, {
          react: {
            text: "❌",
            key: _0x152311.key
          }
        });
        return _0x3291fc("*Failed to fetch Facebook video data.*");
      }
      var _0x27ca33 = _0x1c570a.data.high;
      await _0x27929e.sendMessage(_0x152311.chat, {
        video: {
          url: _0x27ca33,
          caption: global.botname
        }
      }, {
        quoted: _0x152311
      });

      // React with success emoji
      await _0x27929e.sendMessage(_0x152311.chat, {
        react: {
          text: "✅",
          key: _0x152311.key
        }
      });

    } catch (_0x53bd40) {
      console.error("facebook command failed:", _0x53bd40);
      await _0x27929e.sendMessage(_0x152311.chat, {
        react: {
          text: "❌",
          key: _0x152311.key
        }
      });
      _0x3291fc("Error fetching video: " + _0x53bd40.message);
    }
  }
}, {
  command: ['gdrive'],
  operate: async ({ ChrisSpark, m, reply, text }) => {
    if (!text) return reply("*Please provide a Google Drive file URL*");

    try {
      let response = await fetch(`https://api.siputzx.my.id/api/d/gdrive?url=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (response.status !== 200 || !data.status || !data.data) {
        return reply("*Please try again later or try another command!*");
      } else {
        const downloadUrl = data.data.download;
        const filePath = path.join(__dirname, `${data.data.name}`);

        const writer = fs.createWriteStream(filePath);
        const fileResponse = await axios({
          url: downloadUrl,
          method: 'GET',
          responseType: 'stream'
        });

        fileResponse.data.pipe(writer);

        writer.on('finish', async () => {
          await Kango.sendMessage(m.chat, {
            document: { url: filePath },
            fileName: data.data.name,
            mimetype: fileResponse.headers['content-type']
          });

          fs.unlinkSync(filePath);
        });

        writer.on('error', (err) => {
          console.error('Error downloading the file:', err);
          reply("An error occurred while downloading the file.");
        });
      }
    } catch (error) {
      console.error('Error fetching Google Drive file details:', error);
      reply("An error occurred while fetching the Google Drive file details.");
    }
  }
}, {
  command: ['gitclone'],
  operate: async ({ m, args, prefix, command, Kango, reply, mess, isUrl }) => {
    if (!args[0])
      return reply(`*GitHub link to clone?*\nExample :\n${prefix}${command} https://github.com/Chimbiko-xd/CHRISSPARK-XMD`);
    
    if (!isUrl(args[0]))
      return reply("*Link invalid! Please provide a valid URL.*");

    const regex1 = /(?:https|git)(?::\/\/|@)(www\.)?github\.com[\/:]([^\/:]+)\/(.+)/i;
    const [, , user, repo] = args[0].match(regex1) || [];
    
    if (!repo) {
      return reply("*Invalid GitHub link format. Please double-check the provided link.*");
    }
    
    const repoName = repo.replace(/.git$/, "");
    const url = `https://api.github.com/repos/${user}/${repoName}/zipball`;
    
    try {
      const response = await fetch(url, { method: "HEAD" });
      const filename = response.headers
        .get("content-disposition")
        .match(/attachment; filename=(.*)/)[1];
      
      await ChrisSpark.sendMessage(
        m.chat,
        {
          document: { url: url },
          fileName: filename + ".zip",
          mimetype: "application/zip",
        },
        { quoted: m }
      );
    } catch (err) {
      console.error(err);
      reply(mess.error);
    }
  }
}, {
  command: ['image', 'img'],
  operate: async ({ ChrisSpark, m, reply, text }) => {
    if (!text) return reply("*Please provide a search query*");

    try {
      let response = await fetch(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (response.status !== 200 || !data.status || !data.data || data.data.length === 0) {
        return reply("*Please try again later or try another command!*");
      } else {
        // Send the first 5 images
        const images = data.data.slice(0, 5);

        for (const image of images) {
          await ChrisSpark.sendMessage(m.chat, {
            image: { url: image.images_url },
          });
        }
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      reply("An error occurred while fetching images.");
    }
  }
}, {
  command: ["img"],
  tags: ["ai", "tools"],
  help: ["img <number> <prompt>"],
  operate: async ({ ChrisSpark, m, text, args, reply }) => {
    try {
      if (!text) return reply(`*Example:* .img 3 anime cat girl`);

      // Parse number of images and prompt
      const count = parseInt(args[0]);
      const numImages = isNaN(count) ? 5 : Math.min(count, 12); // Max 12 images
      const prompt = isNaN(count) ? text : args.slice(1).join(" ");

      if (!prompt) return reply(`*Please provide a prompt to generate images.*\n*Example:* .img 2 sunset over mountains`);

      await ChrisSpark.sendMessage(m.chat, { react: { text: "🎨", key: m.key } });

      const apiUrl = `https://img.hazex.workers.dev/?prompt=${encodeURIComponent(prompt)}`;
      const footer = "\n> *𝙋𝙤𝙬𝙚𝙧𝙚𝙙 𝘽𝙮 CHRIS GAAJU©*";

      for (let i = 0; i < numImages; i++) {
        await ChrisSpark.sendMessage(m.chat, {
          image: { url: apiUrl },
          caption: `${footer}`
        }, { quoted: m });
      }

      await ChrisSpark.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    } catch (err) {
      console.error("Image generation error:", err);
      await ChrisSpark.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      reply("*An error occurred while generating images. Try again later.*");
    }
  }
}, {
  command: ["instagram", "insta"],
  operate: async ({
    Kango: _0x5e1205,
    m: _0x1987c6,
    reply: _0x463896,
    text: _0x207a28
  }) => {
    // React with ⏳ when the command starts
    await _0x5e1205.sendMessage(_0x1987c6.chat, {
      react: {
        text: "⏳",
        key: _0x1987c6.key
      }
    });

    if (!_0x207a28) {
      await _0x5e1205.sendMessage(_0x1987c6.chat, {
        react: {
          text: "❌",
          key: _0x1987c6.key
        }
      });
      return _0x463896("*Please provide an Instagram URL!*");
    }

    const _0x4dc8de = "https://api.nexoracle.com/downloader/insta?apikey=MatrixZatKing&url=" + encodeURIComponent(_0x207a28);

    try {
      const _0x581760 = await fetch(_0x4dc8de);
      const _0x257dc5 = await _0x581760.json();

      if (!_0x257dc5 || !_0x257dc5.result || !_0x257dc5.result.video) {
        await _0x5e1205.sendMessage(_0x1987c6.chat, {
          react: {
            text: "❌",
            key: _0x1987c6.key
          }
        });
        return _0x463896("*Failed to retrieve the video!*");
      }

      const _0x51c63b = _0x257dc5.result.video;
      const _0x281b63 = _0x257dc5.result.title || "Instagram Video";

      await _0x5e1205.sendMessage(_0x1987c6.chat, {
        video: { url: _0x51c63b },
        mimetype: "video/mp4",
        fileName: _0x281b63 + ".mp4"
      }, {
        quoted: _0x1987c6
      });

      // React with ✅ on success
      await _0x5e1205.sendMessage(_0x1987c6.chat, {
        react: {
          text: "✅",
          key: _0x1987c6.key
        }
      });

    } catch (_0x20b62e) {
      console.error("Download command failed:", _0x20b62e);
      await _0x5e1205.sendMessage(_0x1987c6.chat, {
        react: {
          text: "❌",
          key: _0x1987c6.key
        }
      });
      _0x463896("Error: " + _0x20b62e.message);
    }
  }
}, {
  command: ['itunes'],
  operate: async ({ m, text, ChrisSpark, reply }) => {
    if (!text) return reply("*Please provide a song name*");
    
    try {
      let res = await fetch(`https://api.popcat.xyz/itunes?q=${encodeURIComponent(text)}`);
      if (!res.ok) {
        throw new Error(`*API request failed with status ${res.status}*`);
      }
      let json = await res.json();
      let songInfo = `*Song Information:*\n
 • *Name:* ${json.name}\n
 • *Artist:* ${json.artist}\n
 • *Album:* ${json.album}\n
 • *Release Date:* ${json.release_date}\n
 • *Price:* ${json.price}\n
 • *Length:* ${json.length}\n
 • *Genre:* ${json.genre}\n
 • *URL:* ${json.url}`;
     
      if (json.thumbnail) {
        await ChrisSpark.sendMessage(
          m.chat,
          { image: { url: json.thumbnail }, caption: songInfo },
          { quoted: m }
        );
      } else {
        reply(songInfo);
      }
    } catch (error) {
      console.error(error);
      reply(`Error fetching song information: ${error.message}`);
    }
  }
}, {
  command: ['mediafire'],
  operate: async ({ ChrisSpark, m, reply, text }) => {
    if (!text) return reply("*Please provide a MediaFire file URL*");

    try {
      let response = await fetch(`https://api.siputzx.my.id/api/d/mediafire?url=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (response.status !== 200 || !data.status || !data.data) {
        return reply("*Please try again later or try another command!*");
      } else {
        const downloadUrl = data.data.downloadLink;
        const filePath = path.join(__dirname, `${data.data.fileName}.zip`);

        const writer = fs.createWriteStream(filePath);
        const fileResponse = await axios({
          url: downloadUrl,
          method: 'GET',
          responseType: 'stream'
        });

        fileResponse.data.pipe(writer);

        writer.on('finish', async () => {
          
          await Kango.sendMessage(m.chat, {
            document: { url: filePath },
            fileName: data.data.fileName,
            mimetype: 'application/zip'
          });

          fs.unlinkSync(filePath);
        });

        writer.on('error', (err) => {
          console.error('Error downloading the file:', err);
          reply("An error occurred while downloading the file.");
        });
      }
    } catch (error) {
      console.error('Error fetching MediaFire file details:', error);
      reply("An error occurred while fetching the MediaFire file details.");
    }
  }
}, {
  command: ['pinterest'],
  operate: async ({ ChrisSpark, m, reply, text }) => {
    if (!text) return reply("*Please provide a search query*");

    try {
      let response = await fetch(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(text)}`);
      let data = await response.json();

      if (response.status !== 200 || !data.status || !data.data || data.data.length === 0) {
        return reply("*Please try again later or try another command!*");
      } else {
        // Send only the first image
        const image = data.data[0];

        await ChrisSpark.sendMessage(m.chat, {
          image: { url: image.images_url },
          caption: `Title: ${image.grid_title}\nLink: ${image.link}`
        });
      }
    } catch (error) {
      console.error('Error fetching Pinterest images:', error);
      reply("An error occurred while fetching Pinterest images.");
    }
  }
}, {
  command: ["play"],
  operate: async ({
    ChrisSpark: _0x56a354,
    m: _0x4303a2,
    reply: _0x5aafa4,
    text: _0x32bfab,
    fetchMp3DownloadUrl: _0x138024
  }) => {
    // Initial loading reaction
    await _0x56a354.sendMessage(_0x4303a2.chat, {
      react: { text: "⏳", key: _0x4303a2.key }
    });

    // Check if song name is provided
    if (!_0x32bfab) {
      await _0x56a354.sendMessage(_0x4303a2.chat, {
        react: { text: "❌", key: _0x4303a2.key }
      });
      return _0x5aafa4("*Please provide a song name!*");
    }

    let statusMessage;

    try {
      // Step 1: Send "Searching..." message with a magnifying glass emoji
      statusMessage = await _0x56a354.sendMessage(_0x4303a2.chat, {
        text: "*🔍 Searching for song...*"
      });

      // Search for the song on YouTube
      const _0x65ceaf = await yts(_0x32bfab);
      if (!_0x65ceaf || _0x65ceaf.all.length === 0) {
        await _0x56a354.sendMessage(_0x4303a2.chat, {
          react: { text: "❌", key: _0x4303a2.key }
        });
        return _0x5aafa4("*The song you are looking for was not found.*");
      }

      const _0x58b4cc = _0x65ceaf.all[0];

      // Step 2: Update message to "Downloading..." with a download emoji
      await _0x56a354.sendMessage(_0x4303a2.chat, {
        text: "*⬇️ Downloading...*",
        edit: statusMessage.key // if supported
      });

      // Fetch the MP3 download URL
      const _0x6668b4 = await _0x138024(_0x58b4cc.url);

      // Step 3: Send the MP3 file
      await _0x56a354.sendMessage(_0x4303a2.chat, {
        audio: { url: _0x6668b4 },
        mimetype: "audio/mpeg",
        fileName: _0x58b4cc.title + ".mp3"
      }, {
        quoted: _0x4303a2
      });

      // Step 4: Final success reaction with a checkmark emoji
      await _0x56a354.sendMessage(_0x4303a2.chat, {
        react: { text: "✅", key: _0x4303a2.key }
      });

    } catch (_0x377fb4) {
      console.error("play command failed:", _0x377fb4);

      // Handle any errors with an error reaction
      await _0x56a354.sendMessage(_0x4303a2.chat, {
        react: { text: "❌", key: _0x4303a2.key }
      });
      _0x5aafa4("Error: " + _0x377fb4.message);
    }
  }
}, {
  command: ["music"],
  tags: ["media"],
  help: ["music [song name]"],
  operate: async ({ m, reply, args, Kango }) => {
    const prefixes = [".", ","];
    const text = m?.message?.conversation || m?.message?.extendedTextMessage?.text || "";
    const usedPrefix = prefixes.find(p => text.startsWith(p)) || ".";
    const commandName = "music";

    const songName = args.join(" ");
    if (!songName) {
      return reply(`*Example*: ${usedPrefix + commandName} Time no dey - Shatta Wale`);
    }

    try {
      // React: Processing
      await Kango.sendMessage(m.chat, {
        react: { text: "🎵", key: m.key }
      });

      const axios = require("axios");

      // Using the new API
      const apiUrl = `https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(songName)}`;
      const res = await axios.get(apiUrl);

      if (!res.data?.status || !res.data?.result) {
        return reply(`*No results found for:* ${songName}`);
      }

      const { title, video_url, thumbnail, duration, views, published, download_url } = res.data.result;

      // React: Success
      await ChrisSpark.sendMessage(m.chat, {
        react: { text: "👍", key: m.key }
      });

      const caption =
        `🎶 *CHRISSPARK-XMD - PLAYER*\n` +
        `🤖 *Title:* ${title}\n` +
        `👀 *Views:* ${views}\n` +
        `⏳ *Duration:* ${duration}\n` +
        `⏰ *Uploaded:* ${published}\n` +
        `🔗 *Url:* ${video_url}\n` +
        `🥇 *𝙋𝙤𝙬𝙚𝙧𝙚𝙙 𝘽𝙮 𝘾𝙃𝙍𝙄𝙎 𝙂𝘼𝘼𝙅𝙐*`;

      await ChrisSpark.sendMessage(m.chat, {
        image: { url: thumbnail },
        caption
      }, { quoted: m });

      // Sending the audio
      await ChrisSpark.sendMessage(m.chat, {
        audio: { url: download_url },
        mimetype: "audio/mp4",
        fileName: `${title || "song"}.mp3`,
        caption: `🎶 *Here's your song:* ${title || "your requested track"}\n🔊 *Enjoy the vibes !*`
      }, { quoted: m });

      setTimeout(async () => {
        await ChrisSpark.sendMessage(m.chat, { react: { text: "💃", key: m.key } });
        await ChrisSpark.sendMessage(m.chat, { react: { text: "🎉", key: m.key } });
        await ChrisSpark.sendMessage(m.chat, { text: "🚀 *Boom!* Your music just dropped. Time to blast it loud!" });
      }, 5000);

    } catch (error) {
      console.error("Error during song command:", error);
      reply("*An error occurred while processing your song. Try again later.*");
    }
  }
}, {
  command: ["spotify"],
  tags: ["media"],
  help: ["music [spotify track link]"],
  operate: async ({ m, reply, args, Kango }) => {
    const prefixes = [".", ","];
    const text = m?.messag?.conversation || m?.message?.extendedTextMessage?.text || "";
    const usedPrefix = prefixes.find(p => text.startsWith(p)) || ".";
    const commmdNane = "Spotify";

const spotifyUrl = args.join(" ");
    if (!spotifyUrl || !spotifyUrl.includes("spotify.com/track")) {
      return reply(`*Example:* ${usedPrefix + commandName} https://open.spotify.com/track/3lWzVNe1yFZlkeBBzUuZYu`);
    }

    try {
      await Kango.sendMessage(m.chat, {
        react: { text: "🎵", key: m.key }
      });

      const axios = require("axios");
      const apiUrl = `https://api.nexoracle.com/downloader/spotify?apikey=MatrixZatKing&url=${encodeURIComponent(spotifyUrl)}`;
      const res = await axios.get(apiUrl);

      if (res.data.status !== 200 || !res.data.result) {
        return reply("*Unable to fetch song. Make sure the Spotify link is valid.*");
      }

      const { title, artist, album_artist, cover_url, download, url } = res.data.result;

      await ChrisSpark.sendMessage(m.chat, {
        react: { text: "✅", key: m.key }
      });

      const caption =
        `🎶 *CHRISSPARK-XMD - SPOTIFY DOWNLOADER*\n` +
        `🎧 *Title:* ${title}\n` +
        `🧑‍🎤 *Artist:* ${artist}\n` +
        `💽 *Album Artist:* ${album_artist}\n` +
        `🔗 *Spotify URL:* ${url}\n` +
        `𝙋𝙤𝙬𝙚𝙧𝙚𝙙 𝘽𝙮 𝘾𝙃𝙍𝙄𝙎 𝙂𝘼𝘼𝙅𝙐`;

      await ChrisSpark.sendMessage(m.chat, {
        image: { url: cover_url },
        caption
      }, { quoted: m });

      await ChrisSpark.sendMessage(m.chat, {
        audio: { url: download },
        mimetype: "audio/mp4",
        fileName: `${title || "song"}.mp3`,
        caption: `🎶 *Here's your Spotify track:* ${title || "your requested track"}\n🔊 *Enjoy you track!*`
      }, { quoted: m });

    } catch (error) {
      console.error("Spotify Music Error:", error);
      reply("*Failed to process your Spotify link. Please try again later or use a different one.*");
    }
  }
}, {
  command: ["song"],
  tags: ["media"],
  help: ["song [song name]"],
  operate: async ({ m, reply, args, Kango }) => {
    const prefixes = [".", ","];
    const text = m?.message?.conversation || m?.message?.extendedTextMessage?.text || "";
    const usedPrefix = prefixes.find(p => text.startsWith(p)) || ".";
    const commandName = "song";

    const songName = args.join(" ");
    if (!songName) {
      return reply(`*Example*: ${usedPrefix + commandName} laho by SHALLIPOPI`);
    }

    try {
      // React: Processing
      await ChrisSpark.sendMessage(m.chat, {
        react: { text: "🎵", key: m.key }
      });

      const yts = require("yt-search");
      const axios = require("axios");
      const searchResult = await yts(songName);
      const video = searchResult.videos[0];

      if (!video) {
        return reply(`*No results found for:* ${songName}`);
      }

      // React: Success
      await Kango.sendMessage(m.chat, {
        react: { text: "👍", key: m.key }
      });

      const caption =
        `🎶 *CHRISSPARK-XMD - PLAYER*\n` +
        `🎧 *Title:* ${video.title}\n` +
        `👀 *Views:* ${video.views}\n` +
        `⏳ *Duration:* ${video.timestamp}\n` +
        `🕒 *Uploaded:* ${video.ago}\n` +
        `🔗 *Url:* ${video.url}\n` +
        `🔥 𝙋𝙤𝙬𝙚𝙧𝙚𝙙 𝘽𝙮 𝘾𝙃𝙍𝙄𝙎 𝙂𝘼𝘼𝙅𝙐 `;

      await ChrisSpark.sendMessage(m.chat, {
        image: { url: video.thumbnail },
        caption
      }, { quoted: m });

      const apiUrl = `https://api.nexoracle.com/downloader/yt-audio2?apikey=MatrixZatKing&url=${encodeURIComponent(video.url)}`;
      const res = await axios.get(apiUrl);

      if (res.data?.status === 200 && res.data?.result?.audio) {
        const { audio, title } = res.data.result;

        await ChrisSpark.sendMessage(m.chat, {
          audio: { url: audio },
          mimetype: "audio/mp4",
          fileName: `${title || "song"}.mp3`,
          caption: `🎶 *Here's your song:* ${title || "your requested track"}\n🔊 *Enjoy the vibes !*`
        }, { quoted: m });

        setTimeout(async () => {
          await ChrisSpark.sendMessage(m.chat, { react: { text: "💃", key: m.key } });
          await ChrisSpark.sendMessage(m.chat, { react: { text: "🎉", key: m.key } });
          await ChrisSpark.sendMessage(m.chat, { text: "🚀 *Music Alert:* Song delivered safely. Enjoy!" });
        }, 5000);
      } else {
        reply("*Failed to fetch the song audio! Please try again later.*");
      }

    } catch (error) {
      console.error("Error during song command:", error);
      reply("*An error occurred while processing your song. Try again later.*");
    }
  }
}, {
  command: ['playdoc', 'songdoc'],
  operate: async ({ ChrisSpark, m, reply, text, fetchMp3DownloadUrl }) => {
    if (!text) return reply('*Please provide a song name!*');

    try {
      const search = await yts(text);
      if (!search || search.all.length === 0) return reply('*The song you are looking for was not found.*');

      const video = search.all[0];
      const downloadUrl = await fetchMp3DownloadUrl(video.url);

      await ChrisSpark.sendMessage(m.chat, {
        document: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${video.title}.mp3`
      }, { quoted: m });

    } catch (error) {
      console.error('playdoc command failed:', error);
      reply(`Error: ${error.message}`);
    }
  }
},
 {
  command: ['ringtone'],
  operate: async ({ m, text, prefix, command, ChrisSpark, reply }) => {
    if (!text) return reply(`*Example: ${prefix + command} black rover*`);
    
    try {
      let anutone2 = await ringtone.ringtone(text);
      let result = anutone2[Math.floor(Math.random() * anutone2.length)];
      
      await ChrisSpark.sendMessage(
        m.chat,
        {
          audio: { url: result.audio },
          fileName: result.title + ".mp3",
          mimetype: "audio/mpeg",
        },
        { quoted: m }
      );
    } catch (error) {
      reply(`Error fetching ringtone: ${error.message}`);
    }
  }
}, {
  command: ['savestat', 'ss', 'save'],
  operate: async ({ m, saveStatusMessage }) => {
    await saveStatusMessage(m);
  }
}, {
  command: ["tiktok", "tikdl", "tiktokvideo"],
  operate: async ({
    m: _0x541c34,
    args: _0x3b8c4d,
    fetchJson: _0x4ed735,
    Kango: _0x344f61,
    reply: _0x1f0c17
  }) => {
    // React with download emoji when command is received
    await _0x344f61.sendMessage(_0x541c34.chat, {
      react: {
        text: "📥",
        key: _0x541c34.key
      }
    });

    if (!_0x3b8c4d[0]) {
      await _0x344f61.sendMessage(_0x541c34.chat, {
        react: {
          text: "❌",
          key: _0x541c34.key
        }
      });
      return _0x1f0c17("*Please provide a TikTok video url!*");
    }
    try {
      let _0x42b311 = await _0x4ed735("https://api-aswin-sparky.koyeb.app/api/downloader/tiktok?url=" + _0x3b8c4d[0]);
      await _0x344f61.sendMessage(_0x541c34.chat, {
        caption: global.wm,
        video: {
          url: _0x42b311.data.video
        },
        fileName: "video.mp4",
        mimetype: "video/mp4"
      }, {
        quoted: _0x541c34
      });

      // React with success emoji
      await _0x344f61.sendMessage(_0x541c34.chat, {
        react: {
          text: "✅",
          key: _0x541c34.key
        }
      });

    } catch (_0x116dd9) {
      console.error("tiktok command failed:", _0x116dd9);
      await _0x344f61.sendMessage(_0x541c34.chat, {
        react: {
          text: "❌",
          key: _0x541c34.key
        }
      });
      _0x1f0c17("Error fetching video: " + _0x116dd9.message);
    }
  }
}, {
  command: ["tikquote", "tikquotes"],
  operate: async ({ m, fetchJson, ChrisSpark, reply }) => {
    await ChrisSpark.sendMessage(m.chat, {
      react: { text: "⚙️", key: m.key }
    });

    try {
      const randomUrl = myTikTokVideos[Math.floor(Math.random() * myTikTokVideos.length)];
      const res = await fetchJson(`https://api-aswin-sparky.koyeb.app/api/downloader/tiktok?url=${randomUrl}`);

      if (!res?.data?.video) {
        await ChrisSpark.sendMessage(m.chat, {
          react: { text: "❌", key: m.key }
        });
        return reply("Failed to fetch video.");
      }

      await Kango.sendMessage(m.chat, {
        caption: global.wm,
        video: { url: res.data.video },
        fileName: "tikquote_video.mp4",
        mimetype: "video/mp4"
      }, { quoted: m });

      await ChrisSpark.sendMessage(m.chat, {
        react: { text: "✅", key: m.key }
      });

    } catch (err) {
      await Kango.sendMessage(m.chat, {
        react: { text: "❌", key: m.key }
      });
      reply("Error fetching video: " + err.message);
    }
  }
}, {
  command: ['tiktokaudio'],
  operate: async ({ m, args, fetchJson, Kango, reply }) => {
    await Kango.sendMessage(m.chat, {
      react: { text: "⚙️", key: m.key }
    });

    if (!args[0]) {
      await ChrisSpark.sendMessage(m.chat, {
        react: { text: "❌", key: m.key }
      });
      return reply('*Please provide a TikTok audio url!*');
    }

    try {
      const kyuu = await fetchJson(`https://api-aswin-sparky.koyeb.app/api/downloader/tiktok?url=${args[0]}`);

      await ChrisSpark.sendMessage(m.chat, {
        audio: { url: kyuu.data.audio },
        fileName: "tiktok.mp3",
        mimetype: "audio/mpeg",
      }, { quoted: m });

      await ChrisSpark.sendMessage(m.chat, {
        react: { text: "✅", key: m.key }
      });

    } catch (error) {
      await ChrisSpark.sendMessage(m.chat, {
        react: { text: "❌", key: m.key }
      });
      reply(`Error fetching audio: ${error.message}`);
    }
  }
}, {
  command: ["video"],
  operate: async ({
    ChrisSpark: _0x45aa8d,
    m: _0x694674,
    reply: _0x1c3456,
    text: _0xaea5d4,
    fetchVideoDownloadUrl: _0x294844
  }) => {
    // React with download emoji when command is received
    await _0x45aa8d.sendMessage(_0x694674.chat, {
      react: {
        text: "📥",
        key: _0x694674.key
      }
    });

    if (!_0xaea5d4) {
      await _0x45aa8d.sendMessage(_0x694674.chat, {
        react: {
          text: "❌",
          key: _0x694674.key
        }
      });
      return _0x1c3456("*Please provide a video name!*");
    }
    try {
      const _0x5ddf21 = await yts(_0xaea5d4);
      if (!_0x5ddf21 || _0x5ddf21.all.length === 0) {
        await _0x45aa8d.sendMessage(_0x694674.chat, {
          react: {
            text: "❌",
            key: _0x694674.key
          }
        });
        return _0x1c3456("*The video you are looking for was not found.*");
      }
      const _0xed2c9d = _0x5ddf21.all[0];
      const _0x518f0e = await _0x294844(_0xed2c9d.url);
      await _0x45aa8d.sendMessage(_0x694674.chat, {
        video: {
          url: _0x518f0e.data.dl
        },
        mimetype: "video/mp4",
        fileName: _0x518f0e.data.title + ".mp4",
        caption: _0x518f0e.data.title
      }, {
        quoted: _0x694674
      });

      // React with success emoji
      await _0x45aa8d.sendMessage(_0x694674.chat, {
        react: {
          text: "✅",
          key: _0x694674.key
        }
      });

    } catch (_0x5118b0) {
      console.error("video command failed:", _0x5118b0);
      await _0x45aa8d.sendMessage(_0x694674.chat, {
        react: {
          text: "❌",
          key: _0x694674.key
        }
      });
      _0x1c3456("Error: " + _0x5118b0.message);
    }
  }
}, {
  command: ['videodoc'],
  operate: async ({ ChrisSpark, m, reply, text, fetchVideoDownloadUrl }) => {
    if (!text) return reply('*Please provide a song name!*');

    try {
      const search = await yts(text);
      if (!search || search.all.length === 0) return reply('*The song you are looking for was not found.*');

      const video = search.all[0]; 
      const videoData = await fetchVideoDownloadUrl(video.url);

      await ChrisSpark.sendMessage(m.chat, {
        document: { url: videoData.download_url },
        mimetype: 'video/mp4',
        fileName: `${videoData.title}.mp4`,
        caption: videoData.title
      }, { quoted: m });

    } catch (error) {
      console.error('videodoc command failed:', error);
      reply(`Error: ${error.message}`);
    }
  }
}, {
  command: ['xvideos', 'porn', 'xdl'],
  operate: async ({ m, text, isCreator, reply, mess, ChrisSpark, fetchJson }) => {
    await ChrisSpark.sendMessage(m.chat, {
      react: { text: "⏳", key: m.key }
    });

    if (!isCreator) {
      await ChrisSpark.sendMessage(m.chat, {
        react: { text: "❌", key: m.key }
      });
      return reply(mess.owner);
    }

    if (!text) {
      await ChrisSpake.sendMessage(m.chat, {
        react: { text: "❌", key: m.key }
      });
      return reply('*Please provide an xvideo search query!*');
    }

    try {
      const kutu = await fetchJson(`https://api-aswin-sparky.koyeb.app/api/search/xnxx?search=${text}`);
      const vid1 = await fetchJson(`https://api-aswin-sparky.koyeb.app/api/downloader/xnxx?url=${kutu.result.result[0].link}`);

      await ChrisSpark.sendMessage(m.chat, {
        video: { url: vid1.data.files.high },
        caption: global.wm,
        contextInfo: {
          externalAdReply: {
            title: global.botname,
            body: kutu.result.result[0].title,
            sourceUrl: kutu.result.result[0].link,
            mediaType: 2,
            mediaUrl: kutu.result.result[0].link,
          }
        }
      }, { quoted: m });

      const vid2 = await fetchJson(`https://api-aswin-sparky.koyeb.app/api/downloader/xnxx?url=${kutu.result.result[1].link}`);

      await ChrisSpark.sendMessage(m.chat, {
        video: { url: vid2.data.files.high },
        caption: global.wm,
        contextInfo: {
          externalAdReply: {
            title: global.botname,
            body: kutu.result.result[1].title,
            sourceUrl: kutu.result.result[1].link,
            mediaType: 2,
            mediaUrl: kutu.result.result[1].link,
          }
        }
      }, { quoted: m });

      await ChrisSpark.sendMessage(m.chat, {
        react: { text: "✅", key: m.key }
      });

    } catch (error) {
      await ChrisSpark.sendMessage(m.chat, {
        react: { text: "❌", key: m.key }
      });
      reply("Error: " + error.message);
    }
  }
},
  {
  command: ['ytmp3'],
  operate: async ({ ChrisSpark, m, reply, text, fetchMp3DownloadUrl }) => {
    // Show initial processing reaction
    await ChrisSpark.sendMessage(m.chat, {
      react: { text: "⚙️", key: m.key }
    });

    if (!text) {
      await ChrisSpark.sendMessage(m.chat, {
        react: { text: "❌", key: m.key }
      });
      return reply('*Please provide a valid YouTube link!*');
    }

    try {
      const urlMatch = text.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/gi);
      if (!urlMatch) {
        await ChrisSpark.sendMessage(m.chat, {
          react: { text: "❌", key: m.key }
        });
        return reply('*Seems like your message does not contain a valid YouTube link*');
      }

      const link = urlMatch[0];
      const downloadUrl = await fetchMp3DownloadUrl(link);

      await ChrisSpark.sendMessage(m.chat, {
        audio: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: "yt_audio.mp3"
      }, { quoted: m });

      await ChrisSpark.sendMessage(m.chat, {
        react: { text: "✅", key: m.key }
      });

    } catch (error) {
      await ChrisSpark.sendMessage(m.chat, {
        react: { text: "❌", key: m.key }
      });
      console.error('ytmp3 command failed:', error);
      reply(`Error: ${error.message}`);
    }
  }
},
 {
  command: ['ytmp3doc'],
  operate: async ({ ChrisSpark, m, reply, text, fetchMp3DownloadUrl }) => {
    if (!text) return reply('*Please provide a valid YouTube link!*');

    try {
      const urlMatch = text.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/gi);
      if (!urlMatch) return reply('*Seems like your message does not contain a valid YouTube link*');

      const link = urlMatch[0];
      const downloadUrl = await fetchMp3DownloadUrl(link);

      await ChrisSpark.sendMessage(m.chat, {
        document: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${link}.mp3`
      }, { quoted: m });

    } catch (error) {
      console.error('ytmp3doc command failed:', error);
      reply(`Error: ${error.message}`);
    }
  }
},
  {
  command: ['ytmp4'],
  operate: async ({ ChrisSpark, m, reply, text, fetchVideoDownloadUrl }) => {
    await ChrisSpark.sendMessage(m.chat, {
      react: { text: "⚙️", key: m.key }
    });

    if (!text) {
      await ChrisSpark.sendMessage(m.chat, {
        react: { text: "❌", key: m.key }
      });
      return reply('*Please provide a valid YouTube link!*');
    }

    try {
      const urlMatch = text.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/gi);
      if (!urlMatch) {
        await ChrisSpark.sendMessage(m.chat, {
          react: { text: "❌", key: m.key }
        });
        return reply('*Seems like your message does not contain a valid YouTube link*');
      }

      const link = urlMatch[0];
      const videoData = await fetchVideoDownloadUrl(link);

      await ChrisSpark.sendMessage(m.chat, {
        video: { url: videoData.download_url },
        mimetype: 'video/mp4',
        fileName: `${videoData.title}.mp4`,
        caption: videoData.title
      }, { quoted: m });

      await ChrisSpark.sendMessage(m.chat, {
        react: { text: "✅", key: m.key }
      });

    } catch (error) {
      await ChrisSpark.sendMessage(m.chat, {
        react: { text: "❌", key: m.key }
      });
      console.error('ytmp4 command failed:', error);
      reply(`Error: ${error.message}`);
    }
  }
},
{
  command: ['ytmp4doc'],
  operate: async ({ ChrisSpark, m, reply, text, fetchVideoDownloadUrl }) => {
    if (!text) return reply('*Please provide a valid YouTube link!*');

    try {
      const urlMatch = text.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/gi);
      if (!urlMatch) return reply('*Seems like your message does not contain a valid YouTube link*');

      const link = urlMatch[0];
      const videoData = await fetchVideoDownloadUrl(link);

      await Kango.sendMessage(m.chat, {
        document: { url: videoData.download_url },
        mimetype: 'video/mp4',
        fileName: `${videoData.title}.mp4`,
        caption: videoData.title
      }, { quoted: m });

    } catch (error) {
      console.error('ytmp4doc command failed:', error);
      reply(`Error: ${error.message}`);
    }
  }
}, {
  command: ["removebg", "rmbg"],
  tags: ["tools"],
  help: ["removebg"],
  operate: async ({ ChrisSpark, m, reply }) => {
    try {
      const q = m.quoted ? m.quoted : m;
      const mime = (q.msg || q).mimetype || '';

      if (!mime.startsWith("image/") || !/\/(jpe?g|png)/.test(mime)) {
        return reply("❌ Please reply to a valid image (jpg, webp, jpeg, png).");
      }

      await ChrisSpark.sendMessage(m.chat, {
        react: { text: "⏳", key: m.key }
      });

      const img = await ChrisSpark.downloadMediaMessage(q);
      const formData = new FormData();
      formData.append("size", "auto");
      formData.append("image_file", img, "image.jpg");

      const response = await axios.post("https://api.remove.bg/v1.0/removebg", formData, {
        headers: {
          ...formData.getHeaders(),
          "X-Api-Key": "Zp1HW5vtCXNDZe6XLBheY4xP", // Your API key
        },
        responseType: "arraybuffer",
      });

      const buffer = Buffer.from(response.data, "binary");
      await ChrisSpark.sendMessage(m.chat, {
        image: buffer,
        caption: "✅ *Background removed successfully!🚀*",
      }, { quoted: m });

      await ChrisSpark.sendMessage(m.chat, {
      react: { text: "✅", key: m.key }
      });

    } catch (err) {
      console.error(err);
      await ChrisSpark.sendMessage(m.chat, {
        react: { text: "❌", key: m.key }
      });
      reply("❌ Failed to remove background. Make sure your image is valid and try again.");
    }
  }
} ];
