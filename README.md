# Liveproshop

### BE&FE app

```bash
install node modules for BE and FE
project correct working for node v19
```


Start project via PM2

Backend:

```bash
pm2 start index.js 
```

```bash
pm2 start "node index.js" --name "process app name"
```

Frontend:

```bash
pm2 start npm -- start
```

```bash
pm2 start "npm run start" --name "process app name"
```

Kill all process:

```bash
pm2 kill
```

Stop all process:

```bash
pm2 delete all
```

Stop some process process:

```bash
pm2 stop []
```

```bash
pm2 delete all
```

List of process:

```bash
pm2 list
```

Monit process

```bash
pm2 monit
```

### Possible error on starting frontend

error - Failed to load SWC binary, see more info here: https://nextjs.org/docs/messages/failed-loading-swc

Desition - add .babelrc


### Starting major task

```bash
pm2 start sessionsStart.js --name="Check started session"
```

```bash
pm2 start sessionsEvents.js --name="Create sessions events"
```

Start project via PM2

Backend:

```bash
pm2 start index.js 
```

```bash
pm2 start "node index.js" --name "process app name"
```

Frontend:

```bash
pm2 start npm -- start
```

```bash
pm2 start "npm run start" --name "process app name"
```

Kill all process:

```bash
pm2 kill
```

Stop all process:

```bash
pm2 delete all
```

Stop some process process:

```bash
pm2 stop []
```

```bash
pm2 delete all
```

List of process:

```bash
pm2 list
```

Monit process

```bash
pm2 monit
```

### Possible error on starting frontend

error - Failed to load SWC binary, see more info here: https://nextjs.org/docs/messages/failed-loading-swc

Desition - add .babelrc


### Starting major task

```bash
pm2 start sessionsStart.js --name="Check started session"
```

Custom starting parse process without FB for test mode only

```bash
pm2 start sessionLaunche.js --name "Launch session [DB:sessionId]" -- sessionId=[DB:sessionId]
```