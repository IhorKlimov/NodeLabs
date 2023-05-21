# Основи розроблення програмного забезпечення на платформі Node.js

## Лабораторна робота 1

Як предметної область я обрав  Веб-застосунок для бронювання апартаментів. В мене є 4 основні сутності: 
- Апартамент
- Бронювання
- Орендар
- Відгук


### Апартамент
Апартамент має такі параметри:
- id
- Назва

За допомогою API можна отримати список усіх апартаментів, додати апартаменти чи отримати деталі апартаментів по id.

### Бронювання
Бронювання має такі параметри:
- id апартамента
- id орендара
- Початкова дата
- Кінечна дата

За допомого API можна отримати усі бронювання по id апартамента чи id орендара та додати нове бронювання. При доданні нового бронювання робиться перевірка на доступність апартамента по ціх датах.


### Орендар
Орендар має такі параметри:
- id
- Ім’я

За допомогою API можна отримати список усіх орендарів чи деталі орендара по його id та створити нового орендаря.

### Відгук
Відгук має такі параметри:
- id
- id орендаря
- id апартамента
- Текст
- Зірки

За допомогою  API можна отримати усі відгуки по id орендаря чи id апартамента. Також, можна отримати деталі відгука по його id, отримати список усіх відгуків та додати новий.

## Лабораторна робота 2

Розробив клієнт використуючи EJS шаблони.

## Лабораторна робота 3

- Додав MongoDB для зберігання даних на диску
- Додав Redis для кешування запитив на читання який працює разом з MongoDB

## Лабораторна робота 4

- Написав сервер на Express.js з використанням ws Websocket JavaScript бібліотеки
- Написав клієнт на React.js з використанням MUI Meterial для UI елементів та JavaScript WebSocket для отримання та надсилання повідомлень
