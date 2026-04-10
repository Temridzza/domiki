// Данные для карточек районов
const districtsData = [
    {
        id: 1,
        name: 'Центр',
        description: 'Исторический центр, набережные, лучшие видовые квартиры',
        imageUrl: 'https://placehold.co/400x200/2b7a6e/ffffff?text=Центр'
    },
    {
        id: 2,
        name: 'Север',
        description: 'Современные ЖК, парковые зоны, близость к деловым кластерам',
        imageUrl: 'https://placehold.co/400x200/398a7c/ffffff?text=Север'
    },
    {
        id: 3,
        name: 'Юг',
        description: 'Экология, новые школы, выгодные цены за кв. метр',
        imageUrl: 'https://placehold.co/400x200/529e8e/ffffff?text=Юг'
    },
    {
        id: 4,
        name: 'Запад',
        description: 'Престижные новостройки бизнес-класса и транспортная доступность',
        imageUrl: 'https://placehold.co/400x200/6bb2a2/ffffff?text=Запад'
    },
    {
        id: 5,
        name: 'Восток',
        description: 'Жилые комплексы с собственной инфраструктурой, метро рядом',
        imageUrl: 'https://placehold.co/400x200/86c5b5/ffffff?text=Восток'
    },
    {
        id: 6,
        name: 'Пригород',
        description: 'Коттеджные поселки и таунхаусы, тишина и природа',
        imageUrl: 'https://placehold.co/400x200/a0d8c8/ffffff?text=Пригород'
    }
];

// Данные для раздела АКЦИИ И СТАТИСТИКА
const statsData = {
    // Первая карточка - количество квартир
    apartments: {
        count: 60,
        label: 'ОСТАЛОСЬ ВСЕГО КВАРТИР',
        subtitle: 'в активных корпусах',
        clickMessage: '🏢 Всего {count} квартир в продаже! Успейте забронировать лучшие варианты.'
    },
    // Вторая карточка - скидки
    discounts: {
        percent: 30,
        label: 'СКИДКИ ДО',
        subtitle: 'на отделку и паркинг',
        clickMessage: '🎁 Скидки до {percent}% на отдельные корпуса. Уточняйте условия.'
    },
    // Третья карточка - ипотека
    mortgage: {
        rate: 25,
        label: 'ИПОТЕКА ОТ',
        subtitle: 'спецпредложение для семей',
        clickMessage: '🏦 Ипотека от {rate}% на весь период акции. Господдержка и семейная ипотека.'
    },
    // Четвертая карточка - последние предложения
    offers: {
        icon: '🔥',
        label: 'ПОСЛЕДНИЕ ПРЕДЛОЖЕНИЯ',
        subtitle: 'Рассрочка 0% + ключи за 3 дня',
        clickMessage: '✨ Последние предложения: готовые квартиры с ремонтом, быстрый заезд.'
    }
};

// Конфигурация приложения
const appConfig = {
    phoneMinLength: 10,
    toastDuration: 2800
};
