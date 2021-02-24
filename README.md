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

bot.on(Telegram.MatchType.Message, ({ message, from, chat }) => {
    bot.request('sendMessage', {
        chat_id: chat.id,
        text: `Hello, ${from.first_name}!`,
    });
});

bot.startPolling();
```

### Using keyboard builder
List of available keyboards:
* ReplyKeyboard;
* InlineKeyboard;
* ForceReply;
* RemoveKeyboard.

#### Example:
```typescript
import { Telegram } from '@apidog/multibot-sdk-ts';

const kb = new Telegram.ReplyKeyboardBuilder();
const row = kb.addRow(); // add row
row.addButton(new Telegram.ReplyButton('Click me!'));

bot.request('sendMessage', {
    // ...
    reply_markup: kb.build(),
});
```
