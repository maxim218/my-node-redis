"use strict";

// запускаем сервер на порте под номером 5000
const express = require("express");
const app = express();
const port = 5000;
app.listen(port);
console.log("Server port: " + port);

// подключение библиотеки для взаимодействия с СУБД
const redis = require("redis");

// создаем клиента для взаимодействия с СУБД
const client = redis.createClient();

// событие при успешном подключении к СУБД
client.on('connect', function() {
    console.log("Redis Connect");
});

// событие при ошибке взаимодействия с СУБД
client.on('error', function (err) {
    console.log("Redis Error");
    // генерируем ошибку для остановки работы программы
    throw new Error();
});

// вставка
app.get("/api/set", function(request, response) {
    // получаем ключ и значение для вставки
    const key = request.query.key + "";
    const value = request.query.value + "";
    // осуществляем вставку
    client.set(key, value, () => {
        response.end("OK");
    });
});

// выборка
app.get("/api/get", function(request, response) {
    // получаем ключ
    const key = request.query.key + "";
    // осуществляем выборку
    client.get(key, (err, answer) => {
        if(answer === null) {
            response.end("Record not found");
        } else {
            response.end(answer + "");
        }
    });
});

// удаление
app.get("/api/delete", function(request, response) {
    // получаем ключ
    const key = request.query.key + "";
    // осуществляем удаление
    client.del(key, (err, answer) => {
        response.end("Delete");
    });
});
