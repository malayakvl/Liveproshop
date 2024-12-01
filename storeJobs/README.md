## !!! Worked FB Task queries !!!

How to start cron task at server

Пример сообщение которие распарсится для создания заказа

```
I want to buy 48 white m 1
```

Запускаем джобу которая получает лив видео, витягивает под ним комментарии и парсит их

```
pm2 start jobStoreEvent.js
```


Запускаем джобу которая занимается рассилкой сообщений пользователю если его месседж бил распарсен

```
pm2 start _jobStoreSender.js
```

Curl рабочий пример

```
curl -i -X POST \
 "https://graph.facebook.com/v18.0/159422623910969/messages?recipient=%7B'id'%3A%20'6179485072153047'%7D&message=%7B'text'%3A'hello1'%7D&access_token=EAArS9KI0vagBOylYdy83in6t0DYuztSRVes1kcOfvsnTT1IC6IWUfjqRzN7as55P2sFfZBj5c4eDxv5VnDDktnmxZBzKkOwf7eCTjr7ptfcCNtVa5v5A71bEMwcnlCN61R7UvS3wQZA5tQMD2LOZAgpdkHZAHifvRMghZALI1rrU0BfZB2RqM3i2m5NwphpDKdVyF2kogQyjPKnCSqtpK4zKTgh1js9c7MZD"
```
