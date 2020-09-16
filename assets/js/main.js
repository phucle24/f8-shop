function callModalRegister() {
    const elModal =  document.getElementById('modal-show');
    if(elModal){
        elModal.classList.remove("modal__show");
        document.getElementById('modal__form-login').classList.add("login_form");
        const formRegister =  document.getElementById('modal__form-register');
        if(formRegister){
            formRegister.classList.remove("register_form");
        }
         
    }
}

function callModalLogin() { 
    const elModal =  document.getElementById('modal-show');
    if(elModal){
        elModal.classList.remove("modal__show");
        document.getElementById('modal__form-register').classList.add("register_form");
        const formLogin =  document.getElementById('modal__form-login');
        if(formLogin){
            formLogin.classList.remove("login_form");
        }  
    }
}

function closeModal() {
    document.getElementById('modal-show').classList.add('modal__show');
}