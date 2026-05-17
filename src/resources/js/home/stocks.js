export function renderStocks() {
    const statsData = {
        apartments: { count: "147", label: "ОСТАЛОСЬ ВСЕГО КВАРТИР", sublabel: "в активных корпусах" },
        discounts: { percent: "23", label: "СКИДКИ ДО", sublabel: "на отделку и паркинг" },
        mortgage: { rate: "5.7", label: "ИПОТЕКА ОТ", sublabel: "спецпредложение для семей" },
        offers: { icon: "🔥", label: "ПОСЛЕДНИЕ ПРЕДЛОЖЕНИЯ", sublabel: "Рассрочка 0% + ключи за 3 дня" }
    };

    const statsContainer = document.getElementById('statsContainer');
    if (!statsContainer) return;

    statsContainer.innerHTML = '';

    const cardsData = [
        { number: statsData.apartments.count, label: statsData.apartments.label, sublabel: statsData.apartments.sublabel },
        { number: `${statsData.discounts.percent}%`, label: statsData.discounts.label, sublabel: statsData.discounts.sublabel },
        { number: `${statsData.mortgage.rate}%`, label: statsData.mortgage.label, sublabel: statsData.mortgage.sublabel },
        { number: statsData.offers.icon, label: statsData.offers.label, sublabel: statsData.offers.sublabel }
    ];

    cardsData.forEach(data => {
        const card = document.createElement('article');
        card.className = 'stats__card';

        const number = document.createElement('div');
        number.className = 'stats__number';
        number.textContent = data.number;

        const label = document.createElement('div');
        label.className = 'stats__label';
        label.textContent = data.label;

        const sublabel = document.createElement('div');
        sublabel.className = 'stats__sublabel';
        sublabel.textContent = data.sublabel;

        card.appendChild(number);
        card.appendChild(label);
        card.appendChild(sublabel);
        statsContainer.appendChild(card);
    });
}
