export type Reply = { label: string; next: string; intent?: string };
export type Node = {
  id: string;
  bot: string | string[];          // одно или несколько сообщений бота
  replies?: Reply[];               // быстрые кнопки
  intent?: string;                 // какой слот контента показать справа
};

export const flow: Record<string, Node> = {
  // Фрейм 1. Приветствие и мотива
  start: {
    id: 'start',
    bot: [
      'Привет! Я виртуальный ассистент РГС. Хочешь, помогу разобраться со страхованием квартиры? Вместе найдём подходящий вариант.',
    ],
    replies: [
      { label: '✅ Да, давай', next: 'why_insurance', intent: 'stats_overall' },
      { label: '🤔 Пока хочу понять, что это такое', next: 'what_is', intent: 'faq_common' },
    ],
  },

  // Мини-гайд: что даёт страховка
  what_is: {
    id: 'what_is',
    bot: [
      'Это финансовая подушка безопасности: оформляешь полис заранее — получаешь помощь, если случится ЧП.',
      'Покрываем ремонт/вещи и ответственность перед соседями. Чаще всего обращаются из-за залива и пожаров.',
    ],
    replies: [
      { label: 'Окей. Дальше', next: 'ownership_question', intent: 'stats_overall' },
    ],
  },

  why_insurance: {
    id: 'why_insurance',
    bot: [
      'Вот примеры, когда страховка спасает: залив, пожар, кража, ответственность перед соседями.',
      'Хотите понять, какой вариант подойдёт именно вам без переплат?',
    ],
    replies: [
      { label: 'Да', next: 'ownership_question', intent: 'stats_overall' },
    ],
  },

  // Ветка выбора ситуации
  ownership_question: {
    id: 'ownership_question',
    bot: 'Квартира в собственности или съёмная? И какие риски волнуют больше всего?',
    replies: [
      { label: '🏠 Своя квартира', next: 'owner_intro', intent: 'owner' },
      { label: '🧳 Снимаю жильё', next: 'renter_intro', intent: 'renter' },
    ],
  },

  owner_intro: {
    id: 'owner_intro',
    bot: [
      'Своя квартира — это вложения и ответственность. Даже новая отделка не гарантирует безопасность.',
      'Каждый 10-й собственник обращается за выплатой в первый год. Чаще всего — из-за воды.',
    ],
    replies: [
      { label: 'Покажите риски', next: 'risks_menu', intent: 'stats_overall' },
      { label: 'Сколько стоит?', next: 'pricing', intent: 'steps' },
    ],
  },

  renter_intro: {
    id: 'renter_intro',
    bot: [
      'Арендованное жильё тоже можно страховать: личные вещи и ответственность перед соседями.',
      '41% арендаторов не знали, что это можно. Покажу варианты?',
    ],
    replies: [
      { label: 'Да, риски', next: 'risks_menu', intent: 'renter' },
      { label: 'Сколько стоит?', next: 'pricing', intent: 'steps' },
    ],
  },

  // Меню рисков → мини-гайды
  risks_menu: {
    id: 'risks_menu',
    bot: 'Выберите, что волнует больше:',
    replies: [
      { label: '💧 Залив', next: 'risk_flood', intent: 'fear_flood' },
      { label: '🔥 Пожар', next: 'risk_fire', intent: 'fear_fire' },
      { label: '🔓 Кража', next: 'risk_theft', intent: 'fear_theft' },
      { label: '⚖ ГО (соседи)', next: 'risk_liab', intent: 'liability' },
      { label: 'Продолжить оформление', next: 'handoff', intent: 'steps' },
    ],
  },

  risk_flood: {
    id: 'risk_flood',
    bot: [
      '60% всех случаев — залив. Даже «капли» дают ущерб на 100 000 ₽. Средняя выплата по РГС — 210 000 ₽.',
    ],
    replies: [
      { label: 'Ещё риски', next: 'risks_menu', intent: 'stats_overall' },
      { label: 'Оформить', next: 'handoff', intent: 'steps' },
    ],
  },

  risk_fire: {
    id: 'risk_fire',
    bot: [
      'Пожар может уничтожить всё за 15 минут. Средний убыток без страховки 100–300 тыс. ₽.',
    ],
    replies: [
      { label: 'Ещё риски', next: 'risks_menu', intent: 'fear_fire' },
      { label: 'Оформить', next: 'handoff', intent: 'steps' },
    ],
  },

  risk_theft: {
    id: 'risk_theft',
    bot: [
      'Кража со взломом: покрываем похищенные вещи и повреждения двери/замков.',
    ],
    replies: [
      { label: 'Ещё риски', next: 'risks_menu', intent: 'fear_theft' },
      { label: 'Оформить', next: 'handoff', intent: 'steps' },
    ],
  },

  risk_liab: {
    id: 'risk_liab',
    bot: [
      'ГО — компенсации соседям при заливе/пожаре. Часто самая дорогая часть после ЧП.',
    ],
    replies: [
      { label: 'Ещё риски', next: 'risks_menu', intent: 'liability' },
      { label: 'Оформить', next: 'handoff', intent: 'steps' },
    ],
  },

  // Цена и сомнения
  pricing: {
    id: 'pricing',
    bot: [
      'Подписка от 390 ₽/мес (за год выгоднее). Хочешь продолжить оформление или есть вопросы?',
    ],
    replies: [
      { label: 'Есть сомнения', next: 'proof', intent: 'cases' },
      { label: 'Оформить за 2 минуты', next: 'handoff', intent: 'steps' },
    ],
  },

  proof: {
    id: 'proof',
    bot: [
      'Пример: полис 12 900 ₽/год → через 3 месяца залив → выплата 115 000 ₽.',
      'Готов вести в оформление?',
    ],
    replies: [
      { label: 'Да, вперёд', next: 'handoff', intent: 'steps' },
      { label: 'Вопросы', next: 'faq', intent: 'faq_common' },
    ],
  },

  faq: {
    id: 'faq',
    bot: [
      'Часто спрашивают: «Можно ли отменить?», «Как быстро платите?», «Как менять суммы покрытия?».',
    ],
    replies: [
      { label: 'Оформить сейчас', next: 'handoff', intent: 'steps' },
      { label: 'Назад', next: 'pricing', intent: 'steps' },
    ],
  },

  // Передача в анкету/оформление
  handoff: {
    id: 'handoff',
    bot: [
      'Отлично! Сейчас покажу формы. Понадобится адрес, контакты, риски и суммы покрытия. Это займёт 2–5 минут.',
    ],
    replies: [
      { label: 'Начать оформление', next: 'end', intent: 'start_purchase' },
    ],
  },

  end: {
    id: 'end',
    bot: 'Переключаюсь в режим оформления…',
    intent: 'start_purchase',
  },
};
