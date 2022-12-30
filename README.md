оригинал игры находится тут:
https://www.mykanjo.com/members/kids/drawing-game

Оригинальный css
https://mykanjo-webapp-ornvt.mongodbstitch.com/kanjo-production-domain-files/drawing-game-production-domain/styles.css

Измененный в корне styles.css

Оригинальный js
https://mykanjo-webapp-ornvt.mongodbstitch.com/kanjo-production-domain-files/drawing-game-production-domain/script.js

Измененный в корне script.js

Для того чтобы игра заработала локально нужно дописать свой id

Регистрируемся (авторизируемся)
https://www.mykanjo.com

Копируем id на странице 
https://www.mykanjo.com/members/kids/drawing-game

drawingData.userInfo.memberstackID

Вставляем его в js 
script.js (5 строчка)
var userId = "ID";

Можно открыть просто в браузере index.html, можно через LiveServer в VSCode или что-то подобное


Для прода необходимо залить новые картинки из папки images на сервер (судя по коду заливают в webflow) и переписать url

Сейчас я юзаю для cdn:
https://raw.githack.com/

Вставить (изменить) разметку в webflow на странице Kids/drawing-game

js и css автоматом подтягиваются из репозитория через githack (при обновлении файлов нужно подождать минут 5-10 из-за кеша)