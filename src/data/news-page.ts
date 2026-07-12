export const newsTabs = [
  {
    label: "Новости",
    key: "news",
    active: true,
  },
  {
    label: "Девблог",
    key: "devblog",
    active: false,
  },
];


// Новости
export const newsList = [

  {
    title: "Нас спонсируют, читать продолжение...",
    excerpt:
      `Шел мужик по улице, и тут подходит к нему другой мужик и говорит:

— вот тебе записка, только ты её не читай, дай другому почитать.

Мужик берет записку и приходит домой.
Продолжение истории внутри статьи.`,

    image: "/images/news/news-main.png",

    date: "12.05.2026",
  },


  {
    title: "StoryGames получили поддержку",
    excerpt:
      `Мы рады сообщить, что наша команда получила поддержку для дальнейшей разработки проектов.`,

    image: "/images/news/support.png",

    date: "01.06.2026",
  },

];



// Девблог
export const devblogList = [

  {
    title: "Devblog #1 — Как создавался FRACTURED RED",

    excerpt:
      `Рассказываем о создании визуальной новеллы:

• разработка персонажей;
• создание атмосферы Марса;
• работа со сценарием.`,

    image: "/images/news/devblog-fr.png",

    date: "20.06.2026",
  },


  {
    title: "Devblog #2 — Новый этап разработки",

    excerpt:
      `Показываем новые материалы, арты и изменения проекта.`,

    image: "/images/news/devblog-2.png",

    date: "30.06.2026",
  },

];



// Первый экран новости
export const featuredNews = newsList[0];


// Первый экран девблога
export const featuredDevblog = devblogList[0];