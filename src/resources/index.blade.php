{{-- resources/views/welcome.blade.php --}}
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Laravel') }}</title>
</head>
<body class="antialiased">
    <div style="text-align: center; margin-top: 50px;">
        <h1>Сайт находится в разработке</h1>
        <p>Скоро здесь появится что-то интересное...</p>
    </div>
</body>
</html>
