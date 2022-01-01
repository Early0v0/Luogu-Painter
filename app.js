'use strict';

const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const querystring = require('querystring');
const process = require('process');

const luoguPaintBoardUrl = 'https://www.luogu.com.cn/paintboard';

let config;
let pic = [];
let board = [], lastGetBoardTime, reqPaintPos = [];

main();

async function main() {
  console.log('app.js Being loaded...');
  getConfig();
  getPic();
  await getBoard();

  while (true) {
    if (Date.now() - lastGetBoardTime >= config.fetchTime) {
      await getBoard();
    }
    for (let user of config.users) {
      if (Date.now() - user.lastPaintTime < config.paintTime) {
        continue;
      }
      if (reqPaintPos.length) {
        user.lastPaintTime = Date.now();
        let data = reqPaintPos.shift();
        if (!await paintBoard(user, data)) {
          reqPaintPos.push(data);
        }
        break;
      }
    }
  }
}

function getConfig() {
  try {
    config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8'));
    for (let user of config.users) {
      user.lastPaintTime = Date.now() - config.lastPaintTime;
    }
  } catch (err) {
    console.error('Get config.json Failed.');
    process.exit(1);
  }
}

function getPic() {
  try {
    for (let p of config.picFile) {
      pic.push({
        x: p.x,
        y: p.y,
        map: JSON.parse(fs.readFileSync(path.join(__dirname, 'pictures', p.name), 'utf-8'))
      });
    }
  } catch (err) {
    console.error('Get Pictures Failed.');
    process.exit(1);
  }
}

async function getBoard() {
  lastGetBoardTime = Date.now();
  try {
    let str = await fetch(luoguPaintBoardUrl + '/board');
    board = (await str.text()).split('\n');
    if (!board[board.length - 1]) {
      board.pop();
    }
    console.log(new Date().toLocaleString(), 'Get PaintBoard Succeeded.');
    getReqPaintPos();
  } catch (err) {
    console.warn(new Date().toLocaleString(), 'Get PaintBoard Failed:', err);
  }
}

function getReqPaintPos() {
  try {
    reqPaintPos = [];
    for (let p of pic) {
      for (let pix of p.map) {
        if (parseInt(board[pix.x + p.x][pix.y + p.y], 36) != pix.color) {
          reqPaintPos.push({
            x: pix.x + p.x,
            y: pix.y + p.y,
            color: pix.color
          });
        }
      }
    }
    if (config.random) {
      reqPaintPos.sort((a, b) => { return Math.random() - 0.5; });
    }
    console.log(new Date().toLocaleString(), `Load reqPaintPos Succeeded: Size = ${reqPaintPos.length}.`);
  } catch (err) {
    console.warn(new Date().toLocaleString(), 'Load reqPaintPos Failed:', err);
  }
}

async function paintBoard(user, data) {
  try {
    let res = await fetch(`${luoguPaintBoardUrl}/paint?token=${user.token}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'referer': luoguPaintBoardUrl
      },
      body: querystring.stringify(data)
    });
    if (res.status == 200) {
      console.log(new Date().toLocaleString(), 'Paint PaintBoard Succeeded:', user.token, data);
    } else {
      throw new Error(JSON.stringify(await res.json()));
    }
  } catch (err) {
    console.warn(new Date().toLocaleString(), 'Paint PaintBoard Failed:', user.token, err.message);
    return false;
  }
  return true;
}
