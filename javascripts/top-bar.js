// JavaScript для бургер-меню
const burgerBtn = document.getElementById('burgerBtn');
        
burgerBtn.addEventListener('click', function() {
    this.classList.toggle('active');
});
