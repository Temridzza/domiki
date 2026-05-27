<?php
namespace App\Mail;
/*
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;


class ContactMail extends Mailable
{
    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        return $this->subject('Новая заявка с сайта')
                    ->view('emails.contact');
    }
}*/


use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;
    public $pageName;

    public function __construct(array $data)
    {
        $this->data = $data;
        $this->pageName = $this->getPageName($data['where'] ?? '/');
    }

    protected function getPageName(string $url): string
{
    // Точные совпадения
    $map = [
        '/'                       => 'Главная страница',
        '/service'                => 'Страница «Услуги»',   // ← добавлено
        '/new-building/1'         => 'Новостройка (id=1)',
        // можно добавить другие статические страницы
    ];

    if (isset($map[$url])) {
        return $map[$url];
    }

    // Динамические маршруты: /new-building/{id}
    if (preg_match('#^/new-building/(\d+)$#', $url, $matches)) {
        return "Новостройка №{$matches[1]}";
    }

    // Динамические маршруты: /choice/{slug}
    if (preg_match('#^/choice/([a-z-]+)$#', $url, $matches)) {
        $slug = $matches[1];
        $names = [
            'kirovskiy'         => 'Кировский район',
            'leninskiy'         => 'Ленинский район',
            'zavolzhinskiy'     => 'Заволжский район',
            'dzerzhinskiy'      => 'Дзержинский район',
            'frunzenskiy'       => 'Фрунзенский район',
            'krasnoperekopskiy' => 'Красноперекопский район',
            'municipalni'       => 'Муниципальный район',
        ];
        return $names[$slug] ?? 'Район (' . $slug . ')';
    }

    // Если ничего не подошло
    return 'Страница сайта';
}

    public function build()
    {
        return $this->from(config('mail.from.address'), config('mail.from.name'))
                    ->subject('Новая заявка с сайта')
                    ->view('emails.contact')  // ваш шаблон
                    ->with([
                        'data'     => $this->data,
                        'pageName' => $this->pageName,
                    ]);
    }
}
