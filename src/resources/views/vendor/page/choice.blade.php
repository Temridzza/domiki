<div>
    <h1 style="color: #667eea; margin-bottom: 20px;">✨ Сделайте ваш выбор</h1>
    
    <div style="margin-bottom: 30px;">
        <p style="font-size: 18px; line-height: 1.6; color: #555;">
            Выберите подходящий вариант для вашего проекта
        </p>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; margin: 30px 0;">
        <div style="border: 2px solid #e0e0e0; border-radius: 10px; padding: 25px; text-align: center; transition: transform 0.3s, box-shadow 0.3s;" 
             onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 5px 20px rgba(0,0,0,0.1)'"
             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
            <div style="font-size: 48px; margin-bottom: 15px;">💎</div>
            <h3 style="margin-bottom: 15px; color: #333;">Базовый</h3>
            <div style="font-size: 32px; color: #667eea; margin-bottom: 20px;">$99</div>
            <ul style="list-style: none; margin-bottom: 25px; text-align: left;">
                <li style="margin-bottom: 10px;">✓ Базовая функциональность</li>
                <li style="margin-bottom: 10px;">✓ 5 проектов</li>
                <li style="margin-bottom: 10px;">✓ Email поддержка</li>
            </ul>
            <button onclick="selectPlan('Базовый')" style="width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
                Выбрать
            </button>
        </div>
        
        <div style="border: 2px solid #667eea; border-radius: 10px; padding: 25px; text-align: center; position: relative; transition: transform 0.3s, box-shadow 0.3s;" 
             onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 5px 20px rgba(0,0,0,0.1)'"
             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
            <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #667eea; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px;">
                Популярный
            </div>
            <div style="font-size: 48px; margin-bottom: 15px;">🚀</div>
            <h3 style="margin-bottom: 15px; color: #333;">Профессиональный</h3>
            <div style="font-size: 32px; color: #667eea; margin-bottom: 20px;">$199</div>
            <ul style="list-style: none; margin-bottom: 25px; text-align: left;">
                <li style="margin-bottom: 10px;">✓ Расширенная функциональность</li>
                <li style="margin-bottom: 10px;">✓ Неограниченные проекты</li>
                <li style="margin-bottom: 10px;">✓ Приоритетная поддержка</li>
                <li style="margin-bottom: 10px;">✓ API доступ</li>
            </ul>
            <button onclick="selectPlan('Профессиональный')" style="width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
                Выбрать
            </button>
        </div>
        
        <div style="border: 2px solid #e0e0e0; border-radius: 10px; padding: 25px; text-align: center; transition: transform 0.3s, box-shadow 0.3s;" 
             onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 5px 20px rgba(0,0,0,0.1)'"
             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
            <div style="font-size: 48px; margin-bottom: 15px;">🏢</div>
            <h3 style="margin-bottom: 15px; color: #333;">Корпоративный</h3>
            <div style="font-size: 32px; color: #667eea; margin-bottom: 20px;">$499</div>
            <ul style="list-style: none; margin-bottom: 25px; text-align: left;">
                <li style="margin-bottom: 10px;">✓ Все функции Pro</li>
                <li style="margin-bottom: 10px;">✓ Выделенный менеджер</li>
                <li style="margin-bottom: 10px;">✓ SLA соглашение</li>
                <li style="margin-bottom: 10px;">✓ Индивидуальная настройка</li>
            </ul>
            <button onclick="selectPlan('Корпоративный')" style="width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
                Выбрать
            </button>
        </div>
    </div>
    
    <div id="selection-message" style="text-align: center; margin-top: 30px; padding: 15px; border-radius: 10px; display: none;"></div>
</div>

<script>
    
</script>
