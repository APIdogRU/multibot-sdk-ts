# Multibot SDK
## Install

## Telegram
Constructor config fields:
* `secret` - token from BotFather;
* `apiUrl` - (for debug purposes only) forward traffic through proxies in countries with government blocking;

### Usage
Example:
```typescript
import { Telegram } from '@apidog/multibot-sdk-ts';

// Create instance
const bot = new Telegram.Bot({
    secret: '...', // secret key
});

bot.on('message', ({ message, sender, chat }) => {
    bot.request('sendMessage', {
        chat_id: chat.id,
        text: `Hello, ${sender.first_name}!`,
    });
});

bot.startPolling();
```

### Using keyboard builder
List of available keyboards:
* ReplyKeyboard;
* InlineKeyboard;
* ForceReply;

#### Example:
```typescript
const kb = new Telegram.ReplyKeyboardBuilder();
const row = kb.addRow(); // add row
row.addButton(new Telegram.ReplyKeyboardButton('Click me!'));

bot.request('sendMessage', {
    // ...
    reply_markup: kb.build(),
});
```
