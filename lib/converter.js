const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const os = require("os");

// List of 30 colors
const colorSequence = [
  "black", "red", "blue", "green", "yellow", "purple", "orange", "pink", "teal", "brown",
  "gray", "white", "cyan", "magenta", "lime", "navy", "maroon", "olive", "silver", "aqua",
  "indigo", "gold", "coral", "turquoise", "lavender", "chocolate", "crimson", "plum", "beige", "salmon"
];

let currentColorIndex = 0;

function audioToVideo(buffer, format = "mp3") {
  return new Promise((resolve, reject) => {
    const inputFile = path.join(os.tmpdir(), `input_${Date.now()}.${format}`);
    const outputFile = path.join(os.tmpdir(), `output_${Date.now()}.mp4`);

    // Get the next color from the sequence
    const color = colorSequence[currentColorIndex];
    currentColorIndex = (currentColorIndex + 1) % colorSequence.length;

    fs.writeFileSync(inputFile, buffer);

    ffmpeg()
      .input(`color=${color}:s=512x512:d=30`)
      .inputFormat("lavfi")
      .input(inputFile)
      .complexFilter([
        "[0:v]scale=512:512,setsar=1[v]",
        "[1:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo[a]"
      ])
      .map("[v]")
      .map("[a]")
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions("-shortest")
      .save(outputFile)
      .on("end", () => {
        const data = fs.readFileSync(outputFile);
        fs.unlinkSync(inputFile);
        fs.unlinkSync(outputFile);
        resolve({
          data,
          delete: () => {
            try {
              fs.unlinkSync(inputFile);
              fs.unlinkSync(outputFile);
            } catch {}
          }
        });
      })
      .on("error", (err) => {
        console.error("FFmpeg error:", err);
        fs.unlinkSync(inputFile);
        reject(err);
      });
  });
}

function toMp3(buffer, format = "mp4") {
  return new Promise((resolve, reject) => {
    const inputFile = path.join(os.tmpdir(), `input_${Date.now()}.${format}`);
    const outputFile = path.join(os.tmpdir(), `output_${Date.now()}.mp3`);

    fs.writeFileSync(inputFile, buffer);

    ffmpeg()
      .input(inputFile)
      .audioCodec("libmp3lame")
      .audioBitrate("128k")
      .outputOptions("-vn")
      .save(outputFile)
      .on("end", () => {
        const data = fs.readFileSync(outputFile);
        fs.unlinkSync(inputFile);
        fs.unlinkSync(outputFile);
        resolve({
          data,
          delete: () => {
            try {
              fs.unlinkSync(inputFile);
              fs.unlinkSync(outputFile);
            } catch {}
          }
        });
      })
      .on("error", (err) => {
        console.error("FFmpeg error:", err);
        fs.unlinkSync(inputFile);
        reject(err);
      });
  });
}

module.exports = { audioToVideo, toMp3 };
