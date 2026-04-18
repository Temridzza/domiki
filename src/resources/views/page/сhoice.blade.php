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

        <!-- ======= Анкеты ЖК ======= -->
        <div class="complexes-container" data-slug="{{ $districtSlug }}">
        </div>
        <!-- ====== КОНЕЦ АНКЕТЫ ЖК ====== -->
    </div>

    <script src="{{ asset('js/new-buildings.js') }}"> </script>
@endsection
