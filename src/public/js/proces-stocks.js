const statsData = {
            apartments: { count: "147", label: "ОСТАЛОСЬ ВСЕГО КВАРТИР", subtitle: "в активных корпусах" },
            discounts: { percent: "23", label: "СКИДКИ ДО", subtitle: "на отделку и паркинг" },
            mortgage: { rate: "5.7", label: "ИПОТЕКА ОТ", subtitle: "спецпредложение для семей" },
            offers: { icon: "🔥", label: "ПОСЛЕДНИЕ ПРЕДЛОЖЕНИЯ", subtitle: "Рассрочка 0% + ключи за 3 дня" }
        };

        // ======================= ФУНКЦИЯ ДЛЯ ВСТАВКИ ЗНАЧЕНИЙ =======================
        function insertDataToHTML() {
            // Вставка данных в блок статистики
            const statsContainer = document.getElementById('statsContainer');
            if (statsContainer) {
                statsContainer.innerHTML = `
                    <div class="stat-card">
                        <div class="stat-number">${statsData.apartments.count}</div>
                        <div class="stat-label">${statsData.apartments.label}</div>
                        <div class="stat-small">${statsData.apartments.subtitle}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${statsData.discounts.percent}%</div>
                        <div class="stat-label">${statsData.discounts.label}</div>
                        <div class="stat-small">${statsData.discounts.subtitle}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${statsData.mortgage.rate}%</div>
                        <div class="stat-label">${statsData.mortgage.label}</div>
                        <div class="stat-small">${statsData.mortgage.subtitle}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${statsData.offers.icon}</div>
                        <div class="stat-label">${statsData.offers.label}</div>
                        <div class="stat-small">${statsData.offers.subtitle}</div>
                    </div>
                `;
            }
        }

        // Запуск после полной загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', insertDataToHTML);
        } else {
            insertDataToHTML();
        }
