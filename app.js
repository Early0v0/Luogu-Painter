'use strict';

const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const querystring = require('querystring');
const process = require('process');

const luoguPaintBoardUrl = 'https://www.luogu.com.cn/paintBoard';

let config;
let pic;
let board = [];
let lastGetBoardTime;

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
      for (let p of pic) {
        if (parseInt(board[config.x + p.x][config.y + p.y], 36) != p.color) {
          await paintBoard(user, p);
          user.lastPaintTime = Date.now();
          await getBoard();
          break;
        }
      }
    }
  }
}

function getConfig() {
  try {
    config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8'));
    for (let user of config.users) {
      user.lastPaintTime = Date.now();
    }
  } catch (err) {
    console.error('Get config.json Failed.');
    process.exit(1);
  }
}

function getPic() {
  try {
    pic = JSON.parse(fs.readFileSync(path.join(__dirname, config.picName), 'utf-8'));
  } catch (err) {
    console.error('Get pic.json Failed.');
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
  } catch (err) {
    console.warn(new Date().toLocaleString(), 'Get PaintBoard Failed:', err);
  }
}

async function paintBoard(user, data) {
  try {
    let res = await fetch(luoguPaintBoardUrl + '/paint', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'referer': luoguPaintBoardUrl,
        'cookie': `_uid=${user.uid};__client_id=${user.client_id}`
      },
      body: querystring.stringify({
        x: config.x + data.x,
        y: config.y + data.y,
        color: data.color
      })
    });
    res = JSON.parse(await res.text());
    if (res.status == 200) {
      console.log(new Date().toLocaleString(), 'Paint PaintBoard Succeeded:', res.data);
    } else {
      throw new Error(res.data);
    }
  } catch (err) {
    console.warn(new Date().toLocaleString(), 'Paint PaintBoard Failed:', err);
  }
}
