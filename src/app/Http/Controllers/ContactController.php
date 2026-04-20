<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\ContactMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;


class ContactController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/contact",
     *     summary="Отправка заявки (обратная связь)",
     *     tags={"Contact"},
     *
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","phone"},
     *
     *             @OA\Property(
     *                 property="name",
     *                 type="string",
     *                 maxLength=255,
     *                 example="Иван Иванов"
     *             ),
     *             @OA\Property(
     *                 property="phone",
     *                 type="string",
     *                 maxLength=20,
     *                 example="+79999999999"
     *             ),
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 maxLength=2000,
     *                 example="Хочу узнать подробнее о квартире"
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Заявка успешно отправлена",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="message",
     *                 type="string",
     *                 example="Заявка успешно отправлена"
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Ошибка валидации"
     *     )
     * )
     */
    public function send(Request $request): JsonResponse
    {
        // Валидация
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'message' => 'nullable|string|max:2000',
        ]);

        // Отправка письма
        Mail::to('krykikry@gmail.com')->send(
            new ContactMail($data)
        );

        return response()->json([
            'message' => 'Заявка успешно отправлена'
        ]);
    }
}
