# Multibot SDK
## Install

## Telegram
Constructor config fields:
* `secret` - token from BotFather;
* `apiUrl` - (for debug purposes only) forward traffic through proxies in countries with government blocking;

### Usage example
Firstly, create instance of `Telegram.Bot`:
```typescript
import { Telegram } from '@apidog/multibot-sdk-ts';

// Create instance
const bot = new Telegram.Bot({
    secret: '...', // secret key
});
```

#### Handle new messages
```typescript
bot.on(Telegram.MatchType.Message, ({ message, from, chat }) => {
    bot.sendMessage({
        chat_id: chat.id,
        text: `Hello, ${from.first_name}!`,
    });
});

bot.startPolling();
```

#### Build and using keyboards
List of available keyboards:
* `ReplyKeyboard`;
* `InlineKeyboard`;
* `ForceReply`;
* `RemoveKeyboard`.

```typescript
// create keyboard
const kb = new Telegram.ReplyKeyboardBuilder();

// add row
const row = kb.addRow();

// add button to row
row.addButton(new Telegram.ReplyButton('Click me!'));

bot.sendMessage({
    // ... rest parameters ...

    // build keyboard
    reply_markup: kb.build(),
});
```

#### Upload photo/video/audio/file
Using the example of sending a photo:
```typescript
// 1. URL
const photo: string = 'https://telegram.org/img/t_logo.png';

// 2. File id
const photo: string = '123456789abcdefghi';

// 3. Local path
import * as fs from 'fs';
const photo: string = path.resolve('photo.jpg');

// 4. Buffer (for example, page = puppeteer.Page)
const photo: Buffer = await page.screenshot();

// 5. fs.ReadStream
import * as fs from 'fs';
import * as path from 'path';
const photo: fs.ReadStream = fs.createReadStream(path.resolve('photo.jpg'));

bot.sendPhoto({
    // ... rest parameters ...

    // passing one variable of the above
    photo,

    // you can specify the filename if you are passing Buffer
    __filename: '',
});
```