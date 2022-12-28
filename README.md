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

Копируем id 
drawingData.userInfo.memberstackID

Вставляем его в js 
script.js (5 строчка)
var userId = "";

Можно открыть просто в браузере index.html, можно через LiveServer в VSCode или что-то подобное


Для прода необходимо залить картинки из папки images на сервер (судя по коду заливают в webflow) и переписать url

Вставить (изменить) разметку в webflow на странице Kids/drawing-game
Изменить script.js, styles.css (они сейчас на строннем серваке к которому нету доступа, куда залить надо подумать, может внутрь webflow)