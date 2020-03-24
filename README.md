# Telegram Bot
## Install

## Usage
```typescript
import TelegramBot from '...';

const bot = new TelegramBot({
    secret: 'NNN:string',
});

bot.on('message', ({ message, user }) => {

});

bot.startPolling();
```

## Snippets
### Extract text entites
```typescript
bot.on('message', ({ message, user }) => {
    const entites = extractEntites(message);
});
```
### Fast reply
```typescript
bot.on('message', ({ message, user }) => {
    reply(bot, message, `Hi, ${user.username}`);
});
```