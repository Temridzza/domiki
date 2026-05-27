<!--<h2>Новая заявка</h2>

<p><strong>Имя:</strong> {{ $data['name'] }}</p>
<p><strong>Телефон:</strong> {{ $data['phone'] }}</p>

@if(!empty($data['message']))
<p><strong>Сообщение:</strong></p>
<p>{{ $data['message'] }}</p>
@endif-->
<!DOCTYPE html>
<html>
<head>
    <title>Новая заявка</title>
</head>
<body>
    <h2>Заявка с сайта</h2>
    <p><strong>Со Страницы:</strong> {{ $pageName }}</p>
    <p><strong>Имя:</strong> {{ $data['name'] ?? '' }}</p>
    <p><strong>Телефон:</strong> {{ $data['phone'] ?? '' }}</p>
    <p><strong>Сообщение:</strong> {{ $data['message'] ?? '—' }}</p>
</body>
</html>
