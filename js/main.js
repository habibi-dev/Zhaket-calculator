window.addEventListener("load", function () {

    // insert html template

    document.body.insertAdjacentHTML('beforeend', htmlToolBox());

    // open box
    document.querySelector('.robot-zhaket-popup').addEventListener('click', async () => {

        let date = prompt('لطفا سال و ماه دریافتی را به صورت زیر وارد کنید: \n 1399/11 \n 1399/11/28');

        if (date === null)
            return null;

        if (!window.location.href.includes('https://www.zhaket.com/dashboard/transactions'))
            return alert('این قابلیت فقط در بخش مالی > تراکنش ها در دسترس می باشد.');

        if (document.querySelector('.robot-zhaket-popup').classList.value === 'robot-zhaket-popup loading')
            return null;

        document.querySelector('.robot-zhaket-popup').classList.add('loading');

        await window.start_calculator_f(date);

        document.querySelector('.robot-zhaket-popup').classList.remove('loading');

    });


});
