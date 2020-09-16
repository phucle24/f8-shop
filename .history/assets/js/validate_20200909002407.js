
// Đối tượng `Validator`
function Validator(options) {

    function getParent(element, selector) {
        while (element.parentElement){
            if (element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement
        }
    }
    var selectorRules = {};
    // Hàm thực hiện Validate
    function validate(inputElement, rule){
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector('.form-message');           
        
        // Lấy tất cả các rules của Selector
        var rules =  selectorRules[rule.selector];
        var errorMessage;
        // Lọc qua tất cả cá rules
        for (let i = 0; i < rules.length; i++) {
            switch (inputElement.type){
                case 'checkbox':
                case 'radio':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            // Nếu có lỗi thì dừng việc kiểm tra (lấy rules đầu tiên)
            if(errorMessage) break;
            
        }
            if(errorMessage){
                errorElement.innerText = errorMessage;
                getParent(inputElement, options.formGroupSelector).classList.add('invalid');
            }
            else {
                errorElement.innerText = "";
                getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
            }
            
            return !errorMessage;
    }

    // Lấy Element của form
    var formElement = document.querySelector(options.form);
    if(formElement){
        // Khi sumbit form
            formElement.onsubmit = function (e) {
                e.preventDefault();

                var isFormValid = true;

                options.rules.forEach(function (rule) {
                    var inputElement = formElement.querySelector(rule.selector);
                    var isValid = validate(inputElement, rule)
                    if(!isValid){
                        isFormValid = false;
                    }
                });
                if (isFormValid){
                   if (typeof options.onSubmit === 'function'){              
                        var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
                        // Lấy value từ form
                        var formValues = Array.from(enableInputs).reduce(function (values, input) {
                            switch(input.type){
                                case 'radio':
                                    // C1. Chekc trường hợp checked
                                    // if(input.matches(':checked')){
                                    //     values[input.name] = input.value;
                                    // }  

                                    // C2. 
                                    values[input.name] = formElement.querySelector('input[name="'+input.name+'"]:checked').value;
                                    break;
                                case 'checkbox':
                                    if(!input.matches(':checked')){
                                        values[input.name] = '';
                                        return values;
                                    } 
                                    if(!Array.isArray(values[input.name]))
                                    {
                                        values[input.name] = [];
                                    }
                                    values[input.name].push(input.value);
                                    break;
                                case 'file':
                                    values[input.name] = input.files;
                                    break;
                                default:
                                    values[input.name] = input.value;
                            }
                          return values;
                        }, {});
                    options.onSubmit(formValues)
                   }
                }
            }
        // Lặp qua mỗi rule và xử lý
        options.rules.forEach(function (rule) {
            // Lưu lại cái rules
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }
            else{
                selectorRules[rule.selector] = [rule.test];
            }

           var inputElements  = formElement.querySelectorAll(rule.selector);
           Array.from(inputElements).forEach(function (inputElement) {
                // Blur vào inputElment
                inputElement.onblur = function(){
                    validate(inputElement, rule)
                }

                // Xử lý mỗi khi người dùng nhập
                inputElement.oniput = function(){
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerText = "";
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                }
           })
        });
    }
}
// Định nghĩa các rules
// Nguyễn tắc của các rules
// 1. Khi có lỗi => Trả ra mesg lỗi
// 2. Khi có k lỗi => Không trả gì cả
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : message || "Vui lòng nhập trường này";
        }
    };
}

Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : "Trường này phải là email";
        }
    };
}
Validator.minLength = function (selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    };
}
Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || "Giá trị nhập vào không chính xác"
        }
    };
}
Validator({
    form : '#form-1',
    formGroupSelector: '.form-group',
    errorSelector: '.form-message',
    rules: [
        Validator.isRequired('#email'),
        Validator.isEmail('#email'),
        Validator.minLength('#password', 6),
        Validator.isRequired('#password_confirmation'),
        Validator.isConfirmed('#password_confirmation', function (){
            return document.querySelector("#form-1 #password").value;
        }, "Mật khẩu nhập lại không chính xác."),
    ],
    onSubmit: function (data) {
        console.log(data);
    }
  });