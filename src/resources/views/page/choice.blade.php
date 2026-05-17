@extends('layouts.app')

@section('title', 'Новостройки в Ярославле')

@section('content')
<div class="site-wrapper">
    <div class="header">
        <h1 class="header__title">{{ $districtSlug }} Район</h1>
    </div>

    <div class="district-header-stats">
        <div class="district-header-stats__container">
            <div class="district-header-stats__headline">НОВОСТРОЙКИ</div>
            <div class="district-header-stats__counter">
                <span class="district-header-stats__counter-label">Всего:</span>
                <span class="district-header-stats__counter-value" id="totalApartmentsCount">0</span>
            </div>
        </div>
    </div>

    <div class="complexes-container" data-slug="{{ $districtSlug }}"></div>
    
</div>

<script>
    window.districtSlug = @json($districtSlug);
</script>
@endsection
