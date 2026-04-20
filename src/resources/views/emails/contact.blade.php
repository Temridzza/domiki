<h2>Новая заявка</h2>

<p><strong>Имя:</strong> {{ $data['name'] }}</p>
<p><strong>Телефон:</strong> {{ $data['phone'] }}</p>

@if(!empty($data['message']))
<p><strong>Сообщение:</strong></p>
<p>{{ $data['message'] }}</p>
@endif