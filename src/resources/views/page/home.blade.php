@extends('layouts.app')

@section('title', 'Новостройки в Ярославле')
@section('description', 'Новостройки в Ярославле — поиск и покупка квартир')
@section('keywords', 'застройщик, ипотека, скидки')

@section('content')
    {{-- ПРИВЕТСТВЕННЫЙ БЛОК НА ВЕСЬ ЭКРАН --}}
    <section class="hero-fullscreen">
        <div class="hero-container">
            
            <div class="hero-text">
                <h1>Новостройки в <span>Ярославле</span></h1>
                <div class="hero-sub-line">
                    <p>
                        <span>🏗️ Напрямую от застройщика</span>
                        <span>🔥 Скидки до конца месяца</span>
                    </p>
                </div>
                <a href="#" class="btn-primary" @click.prevent="showFormAndScroll">ПОДОБРАТЬ КВАРТИРУ</a>
            </div>
        </div>
    </section>
@endsection
