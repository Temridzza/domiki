@extends('layouts.app')

@section('title', 'Услуги')
@section('description', 'Полный спектр услуг по недвижимости в Ярославле: покупка, продажа, аренда, юридическое сопровождение')
@section('keywords', 'услуги, недвижимость, аренда, продажа, юрист, консультация')

@section('style')
    @vite('resources/css/app.css')
@endsection

@section('content')
<main class="services-page">
    <div class="services-container">
        <!-- Верхний блок -->
        <div class="services-header">
            <h1>Наши услуги</h1>
            <p>Профессиональное сопровождение сделок с недвижимостью любого уровня сложности</p>
        </div>

        <!-- Сетка карточек услуг -->
        <div class="services-grid">
            <div class="service-card">
                <div class="service-card__icon"><i class="fas fa-home"></i></div>
                <h3>Покупка квартир</h3>
                <p>Подбор лучших вариантов на первичном и вторичном рынке. Сопровождение до получения ключей.</p>
                <ul class="service-features">
                    <li>Бесплатный подбор</li>
                    <li>Проверка юриста</li>
                    <li>Скидки от застройщика</li>
                </ul>
            </div>
            <div class="service-card">
                <div class="service-card__icon"><i class="fas fa-chart-line"></i></div>
                <h3>Продажа недвижимости</h3>
                <p>Экспертная оценка, профессиональная презентация объекта и быстрая продажа по лучшей цене.</p>
                <ul class="service-features">
                    <li>Бесплатная оценка</li>
                    <li>Фото/видео презентация</li>
                    <li>Юридическое сопровождение</li>
                </ul>
            </div>
            <div class="service-card">
                <div class="service-card__icon"><i class="fas fa-handshake"></i></div>
                <h3>Аренда и сдача в аренду</h3>
                <p>Поиск надёжных арендаторов или сдача вашей квартиры/коммерческой недвижимости.</p>
                <ul class="service-features">
                    <li>Проверка платежеспособности</li>
                    <li>Составление договора</li>
                    <li>Сопровождение сделки</li>
                </ul>
            </div>
            <div class="service-card">
                <div class="service-card__icon"><i class="fas fa-gavel"></i></div>
                <h3>Юридические услуги</h3>
                <p>Полное юридическое сопровождение сделок, проверка чистоты, регистрация в Росреестре.</p>
                <ul class="service-features">
                    <li>Проверка истории объекта</li>
                    <li>Составление договоров</li>
                    <li>Представительство в суде</li>
                </ul>
            </div>
            <div class="service-card">
                <div class="service-card__icon"><i class="fas fa-building"></i></div>
                <h3>Коммерческая недвижимость</h3>
                <p>Продажа, аренда и управление коммерческими объектами (офисы, склады, ТЦ).</p>
                <ul class="service-features">
                    <li>Анализ доходности</li>
                    <li>Подбор арендаторов</li>
                    <li>Снижение эксплуатационных расходов</li>
                </ul>
            </div>
            <div class="service-card">
                <div class="service-card__icon"><i class="fas fa-chart-pie"></i></div>
                <h3>Управление недвижимостью</h3>
                <p>Полное администрирование вашей недвижимости: поиск жильцов, ремонт, отчётность.</p>
                <ul class="service-features">
                    <li>Ежемесячная отчётность</li>
                    <li>Контроль оплат</li>
                    <li>Организация ремонта</li>
                </ul>
            </div>
        </div>

        <!-- Расширенные описания (блоки с иконками) -->
        <div class="services-details">
            <div class="detail-block">
                <h2><i class="fas fa-search"></i> Ипотека и кредиты</h2>
                <p>Поможем подобрать лучшие ипотечные программы от ведущих банков. Снижаем ставку, ускоряем одобрение. Работаем с материнским капиталом, военной ипотекой.</p>
                <ul>
                    <li>Бесплатная консультация по ипотеке</li>
                    <li>Сбор документов и подача заявки</li>
                    <li>Сопровождение до регистрации</li>
                </ul>
            </div>
            <div class="detail-block">
                <h2><i class="fas fa-tools"></i> Ремонт и отделка "под ключ"</h2>
                <p>Надёжные бригады строителей, дизайн-проекты, поставка материалов. Гарантия на работы.</p>
                <ul>
                    <li>Косметический, капитальный, евроремонт</li>
                    <li>Дизайн-проект любой сложности</li>
                    <li>Контроль качества на всех этапах</li>
                </ul>
            </div>
            <div class="detail-block">
                <h2><i class="fas fa-chart-simple"></i> Оценка и консалтинг</h2>
                <p>Профессиональная оценка рыночной стоимости, инвестиционная привлекательность объектов.</p>
                <ul>
                    <li>Подготовка отчётов для банков и судов</li>
                    <li>Анализ доходности коммерческой недвижимости</li>
                    <li>Страхование недвижимости</li>
                </ul>
            </div>
        </div>

        <!-- Блок преимуществ -->
        <div class="services-advantages">
            <h2>Почему выбирают нас?</h2>
            <p>Работаем с 1998 года, 70% клиентов приходят по рекомендации</p>
            <div class="advantages-grid">
                <div class="advantage-item">
                    <i class="fas fa-clock"></i>
                    <h3>Быстро</h3>
                    <p>Средний срок продажи — 2 недели</p>
                </div>
                <div class="advantage-item">
                    <i class="fas fa-shield-alt"></i>
                    <h3>Надёжно</h3>
                    <p>Полная юридическая проверка</p>
                </div>
                <div class="advantage-item">
                    <i class="fas fa-hand-holding-usd"></i>
                    <h3>Выгодно</h3>
                    <p>Фиксированная стоимость услуг</p>
                </div>
                <div class="advantage-item">
                    <i class="fas fa-headset"></i>
                    <h3>24/7</h3>
                    <p>Круглосуточная поддержка клиентов</p>
                </div>
            </div>
        </div>

        <!-- Форма заявки -->
        <div class="services-form">
            <h2>Остались вопросы?</h2>
            <p>Оставьте заявку — наш специалист свяжется с вами в течение 15 минут</p>
            <form action="#" method="POST" id="serviceLeadForm">
                @csrf
                <div class="form-row">
                    <div class="form-group">
                        <input type="text" name="name" placeholder="Ваше имя" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" name="phone" placeholder="Номер телефона" required>
                    </div>
                    <div class="form-group">
                        <select name="service_type">
                            <option value="">Выберите услугу</option>
                            <option>Покупка</option>
                            <option>Продажа</option>
                            <option>Аренда</option>
                            <option>Юридические услуги</option>
                            <option>Управление</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <textarea name="comment" rows="2" placeholder="Комментарий"></textarea>
                    </div>
                </div>
                <button type="submit">Отправить заявку <i class="fas fa-arrow-right"></i></button>
            </form>
            <p style="font-size: 0.75rem; margin-top: 24px;">Нажимая кнопку, вы соглашаетесь с обработкой персональных данных</p>
        </div>
    </div>
</main>
@endsection

@section('scripts')
    @vite('resources/js/app.js')
    <script>
        // Простая обработка отправки формы (можно реализовать через AJAX)
        document.getElementById('serviceLeadForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            try {
                // Здесь отправка на ваш эндпоинт
                // await fetch('/api/leads', { method: 'POST', body: formData });
                alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
                form.reset();
            } catch (err) {
                alert('Ошибка отправки. Попробуйте позже.');
            }
        });
    </script>
@endsection
