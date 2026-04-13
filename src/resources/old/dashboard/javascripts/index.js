function app() {
    return {
        // Состояние
        burgerActive: false,
        showForm: false,
        toastVisible: false,
        toastMessage: '',
        toastTimeout: null,
        
        // Данные районов
        districts: [],
        
        // Данные акций
        stats: {
            apartments: {
                count: statsData.apartments.count,
                label: statsData.apartments.label,
                subtitle: statsData.apartments.subtitle,
                clickMessage: statsData.apartments.clickMessage
            },
            discounts: {
                percent: statsData.discounts.percent,
                label: statsData.discounts.label,
                subtitle: statsData.discounts.subtitle,
                clickMessage: statsData.discounts.clickMessage
            },
            mortgage: {
                rate: statsData.mortgage.rate,
                label: statsData.mortgage.label,
                subtitle: statsData.mortgage.subtitle,
                clickMessage: statsData.mortgage.clickMessage
            },
            offers: {
                icon: statsData.offers.icon,
                label: statsData.offers.label,
                subtitle: statsData.offers.subtitle,
                clickMessage: statsData.offers.clickMessage
            }
        },
        
        // Данные формы
        formData: {
            name: '',
            phone: '',
            wishes: ''
        },
        
        // Инициализация данных
        initData() {
            this.districts = districtsData;
            
            // Можно динамически обновить данные через API или таймер
            // Пример: обновить количество квартир через 5 секунд
            // setTimeout(() => {
            //     this.updateApartmentsCount(45);
            // }, 5000);
        },
        
        // Методы для динамического обновления данных акций
        updateApartmentsCount(newCount) {
            this.stats.apartments.count = newCount;
            this.showToastMessage(`📊 Количество доступных квартир обновлено: ${newCount}`);
        },
        
        updateDiscountPercent(newPercent) {
            this.stats.discounts.percent = newPercent;
            this.showToastMessage(`💰 Максимальная скидка обновлена: ${newPercent}%`);
        },
        
        updateMortgageRate(newRate) {
            this.stats.mortgage.rate = newRate;
            this.showToastMessage(`🏦 Ставка по ипотеке обновлена: ${newRate}%`);
        },
        
        updateOffersText(newLabel, newSubtitle) {
            if (newLabel) this.stats.offers.label = newLabel;
            if (newSubtitle) this.stats.offers.subtitle = newSubtitle;
            this.showToastMessage(`✨ Актуальные предложения обновлены`);
        },
        
        // Бургер (только анимация)
        toggleBurger() {
            this.burgerActive = !this.burgerActive;
            this.showToastMessage('🍔 Меню в разработке');
            setTimeout(() => { this.burgerActive = false; }, 500);
        },
        
        // Показать форму и плавно прокрутить
        showFormAndScroll() {
            this.showForm = true;
            this.showToastMessage('📝 Форма заявки открыта, заполните поля');
            setTimeout(() => {
                const formElement = document.getElementById('applicationForm');
                if (formElement) {
                    formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    formElement.style.transition = 'background 0.3s';
                    formElement.style.backgroundColor = '#fff8e8';
                    setTimeout(() => { formElement.style.backgroundColor = ''; }, 1200);
                }
            }, 100);
        },
        
        // Выбор района
        selectDistrict(districtName) {
            this.showToastMessage(`🏙️ Район «${districtName}» выбран. Специалист по новостройкам скоро свяжется с вами.`);
        },
        
        // Статистика: информационные сообщения
        showStatInfo(index) {
            let message = '';
            switch(index) {
                case 0:
                    message = this.stats.apartments.clickMessage.replace('{count}', this.stats.apartments.count);
                    break;
                case 1:
                    message = this.stats.discounts.clickMessage.replace('{percent}', this.stats.discounts.percent);
                    break;
                case 2:
                    message = this.stats.mortgage.clickMessage.replace('{rate}', this.stats.mortgage.rate);
                    break;
                case 3:
                    message = this.stats.offers.clickMessage;
                    break;
            }
            this.showToastMessage(message);
        },
        
        // Валидация телефона
        validatePhone(phone) {
            const phoneClean = phone.replace(/[\s\-\(\)\+]/g, '');
            return phoneClean.length >= 10;
        },
        
        // Отправка формы
        submitForm() {
            // Валидация имени
            if (!this.formData.name.trim()) {
                this.showToastMessage('⚠️ Пожалуйста, укажите ваше имя');
                return;
            }
            
            // Валидация телефона
            if (!this.formData.phone.trim()) {
                this.showToastMessage('⚠️ Введите номер телефона для связи');
                return;
            }
            
            if (!this.validatePhone(this.formData.phone)) {
                this.showToastMessage('📞 Укажите корректный телефон (минимум 10 цифр)');
                return;
            }
            
            // Успешная отправка
            let wishesText = this.formData.wishes ? 
                ` Пожелания: "${this.formData.wishes.substring(0, 70)}${this.formData.wishes.length > 70 ? '…' : ''}"` : '';
            
            this.showToastMessage(`✅ Спасибо, Наш менеджер свяжется с вами в ближайшее время.`);
            
            // Логирование в консоль
            console.log(`Заявка: Имя=${this.formData.name}, Телефон=${this.formData.phone}, Пожелания=${this.formData.wishes}`);
            
            // Очистка формы
            this.formData = { name: '', phone: '', wishes: '' };
            
            // Опционально: скрыть форму после отправки
            // this.showForm = false;
        },
        
        // Показ toast-уведомления (исправленная версия)
        showToastMessage(message) {
            // Очищаем предыдущий таймаут
            if (this.toastTimeout) {
                clearTimeout(this.toastTimeout);
            }
            
            // Устанавливаем сообщение и показываем toast
            this.toastMessage = message;
            this.toastVisible = true;
            
            // Автоматически скрываем через 3 секунды
            this.toastTimeout = setTimeout(() => {
                this.toastVisible = false;
            }, 3000);
            
            // Для отладки
            //console.log('Toast уведомление:', message);
        }
    }
}
