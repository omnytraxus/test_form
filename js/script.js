"use strict"
//предотвращаем работу скрипта, пока не загрузится вся страница
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('form');
    form.addEventListener('submit', sendForm);

    async function sendForm(e) {
        e.preventDefault(); //не даем HTML работать по-умолчанию

        let error = formValidate(form);
        //это то, что мы будем передавать в запросе
        const body = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value
        }

        const headers = {
            'Content-Type': 'application/json'
        }

        const trueURL = 'https://60376bfd5435040017722533.mockapi.io/form' //рабочий URL
        const falseURL = 'https://60376bfd5435040017722533.mockapi.io/formRej' //не рабочий URL

        //если все поля заполнены и ошибок нет, отправляет форму методом fetch
        if (error === 0){
            let response = await fetch(trueURL, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: headers
            })
            //проверка успешности отправки формы
            if (!response.ok) {
                alert("Ошибка отправки формы");
                return response.json();
            }
            //если форма отправилась успешно, очищаем все поля в форме
            else {
                form.reset();
                alert("Форма успешно отправлена!");
                return response.json()
            }
        } else{
            alert('Заполните обязательные поля');
        }
    }
    //проверяет наличие незаполненных полей и ошибки
    function formValidate(_form) {
        let error = 0;
        let formReq = document.querySelectorAll('._req');

        for (let index = 0; index < formReq.length; index++) {
            const input = formReq[index];
            formRemoveError(input);

            if (input.value === '') {
                formAddError(input);
                error++;
            }

            if (input.classList.contains('_name')){
                if (nameTest(input)){
                    formAddError(input);
                    error++;
                }
            }
            if (input.classList.contains('_phone')){
                if (phoneTest(input)){
                    formAddError(input);
                    error++;
                }
            }
            if (input.classList.contains('_email')){
                if (emailTest(input)){
                    formAddError(input);
                    error++;
                }
            }
        }
        return error;
    }
    //добавляет значение ошибки классу
    function formAddError(input) {
        input.classList.add('_error');
    }
    //убирает значение ошибки у класса
    function formRemoveError(input) {
        input.classList.remove('_error');
    }
    //валидация имени: только русские буквы, пробелы, тире
    function nameTest(input) {
        return !/^(?!\s*$)[-\/ а-яА-Я]+$/.test(input.value);
    }
    //валидация телефона: только цифры, “-”, пробелы, “+”
    function phoneTest(input) {
        return !/^(\+)?(\(\d{2,3}\) ?\d|\d)(([ \-]?\d)|( ?\(\d{2,3}\) ?)){5,12}\d$/.test(input.value);
    }
    //валидация почты: только строки соответствующие формату email
    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?w+)*(\.\w{2,8})+$/.test(input.value);
    }
});
