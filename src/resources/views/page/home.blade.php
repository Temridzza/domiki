@extends('layouts.app')

@section('title', 'Новостройки в Ярославле')
@section('description', 'Новостройки в Ярославле — поиск и покупка квартир')
@section('keywords', 'застройщик, ипотека, скидки')

@section('content')

<section class="hero">
    <div class="hero__container">
        <div class="hero__content">
            <h1 class="hero__title">Новостройки в <span class="hero__title-accent">Ярославле</span></h1>
            <div class="hero__badges">
                <span class="hero__badge hero__badge--building">🏗️ Напрямую от застройщика</span>
                <span class="hero__badge hero__badge--fire">🔥 Скидки до конца месяца</span>
            </div>
            <button class="hero__btn hero__btn--primary" data-action="showForm">ПОДОБРАТЬ КВАРТИРУ</button>
        </div>
    </div>
</section>

@endsection
