// ======================= ДАННЫЕ =======================
let districtsData = [];

// ======================= API ЗАПРОС =======================
async function fetchDistricts() {
    try {
        const response = await fetch('/api/districts');
        if (!response.ok) throw new Error('Ошибка загрузки данных');
            districtsData = await response.json();
            renderDistricts();
    } catch (error) {
        console.error('Ошибка при загрузке районов:', error);
        const container = document.getElementById('districtsContainer');
        if (container) {
            container.innerHTML = '<p style="color: red;">Не удалось загрузить список районов</p>';
        }
    }
}

        // ======================= ОТРИСОВКА КАРТОЧЕК =======================
        function renderDistricts() {
            const container = document.getElementById('districtsContainer');
            if (!container) return;
            
            container.innerHTML = '';
            
            districtsData.forEach(district => {
                const card = document.createElement('div');
                card.className = 'district-card';
                card.setAttribute('data-district', district.slug);
                
                // Добавляем обработчик клика для перехода
                card.addEventListener('click', () => {
                    window.location.href = `сhoice/${district.slug}&${district.name}`;
                });
                
                // Изображение
                const imgDiv = document.createElement('div');
                imgDiv.className = 'card-img';
                
                const imageUrl = `/storage/${district.image}`;

                imgDiv.style.backgroundImage = `url('${imageUrl}')`;
                imgDiv.style.backgroundSize = 'cover';
                imgDiv.style.backgroundPosition = 'center';
                
                // Заголовок
                const title = document.createElement('h3');
                title.textContent = district.name;
                
                // Описание
                const desc = document.createElement('p');
                desc.textContent = district.description;
                
                card.appendChild(imgDiv);
                card.appendChild(title);
                card.appendChild(desc);
                container.appendChild(card);
            });
        }

        // ======================= ЗАПУСК =======================
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fetchDistricts);
        } else {
            fetchDistricts();
        }
