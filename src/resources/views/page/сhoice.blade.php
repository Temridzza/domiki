{{-- resources/views/about.blade.php --}}
@extends('layouts.app')

@section('title', 'Выбор Новостройки ')
@section('description', 'О компании застройщике')

@section('content')
    <!-- ОСНОВНОЙ КОНТЕНТ С ЦЕНТРИРОВАНИЕМ -->
    <div class="main-content">
        
        <!-- Шапка района -->
        <div class="district-header">
            <h1 class="district-title">{{ $districtSlug }} РАЙОН</h1>
        </div>

        <div class="stats-row">
            <div class="section-headline">НОВОСТРОЙКИ</div>
            <div class="counters">
                <div class="counter-item"><span>Всего:</span><span class="green-count" id="totalApartmentsCount">0</span></div>
            </div>
        </div>

        <!-- ======= Анкета ЖК ======= -->
        <div class="complex-card">

            <div class="complex-header">
                <div class="complex-image"><div class="img-placeholder">☀️🏙️<span>ЖК Солнечный</span></div></div>
                <div class="complex-info">
                    <div class="info-row-1">
                        <span class="complex-name">ЖК Солнечный</span>
                        <div class="price-deadline">
                            <span class="price">от 4.85 млн ₽</span>
                            <span class="deadline">сдача 2025</span>
                        </div>
                    </div>
                    <div class="info-row-2">
                        <button class="btn-primary request-complex" data-complex="Солнечный">ЗАЯВКА НА ЖК</button>
                    </div>
                </div>
            </div>

            <!-- Список квартир -->
            <div class="apartments-wrapper">
                <div class="apartments-header">
                    <div class="apartments-title">
                        <span>КВАРТИРЫ</span>
                        <span class="apartment-badge" id="solarCountBadge">0</span>
                    </div>
                    <button class="toggle-details-btn-header" data-target="solar">ПОДРОБНЕЕ</button>
                </div>
                <div class="apartments-list" id="solarApartmentsList">
                    <div class="apartments-grid" id="solarApartmentsGrid"></div>
                </div>
            </div>
        </div>
    </div>

@endsection
