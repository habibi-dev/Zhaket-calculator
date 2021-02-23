window.start_calculator_f = async (i_date) => {
    let total = {}, res = {}, stopDate = false, stopDateLevel = 0, month = i_date.split('/')[1], ordersNum = {},
        years = i_date.split('/')[0], is_break = false;
    const sleep = (ms) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        cal = () => {
            document.querySelectorAll("div.record__title > div.record__code > div.record__code-text > span.record__refer").forEach(item => {
                let parent = item.parentNode.parentNode.parentNode.parentNode,
                    date = parent.querySelector("div.record__title > div.record__date > span.fa-num").textContent.split(' '),
                    price = parseInt(parent.querySelector('span.record__price.record__price--spent.fa-num').textContent.replaceAll(',', ''));

                // check date for start
                if (!stopDate && !stopDateLevel && date[0].includes(i_date)) {
                    stopDate = true;
                    stopDateLevel = 1;
                }

                // check date for stop
                if (!date[0].includes(i_date)) {
                    stopDate = false;
                    if (stopDateLevel === 1) {
                        is_break = true;
                    }

                    stopDateLevel = 0;
                    return null;
                }

                // Create res
                if (!res.hasOwnProperty(item.textContent))
                    res[item.textContent] = [];

                // Create total
                if (!total.hasOwnProperty(item.textContent))
                    total[item.textContent] = 0;

                // Create order
                if (!ordersNum.hasOwnProperty(item.textContent))
                    ordersNum[item.textContent] = {};

                let orderNum = parent.querySelector('.record__table .record__col--title > span').textContent.replace(/\D/g, "");

                // Checked add record
                if (parent.classList.value === 'record added' && parent.querySelector('div.record__title > div.record__date > span.record__smal-title').textContent !== 'پشتیبانی مسدود شده') {

                    if (ordersNum[item.textContent].hasOwnProperty(`added-${orderNum}`))
                        return null;

                    res[item.textContent].push({
                        num: orderNum,
                        res: parent.querySelector('.record__table .record__col--title > span').textContent,
                        price: price.toLocaleString("en-US"),
                        date: date[0],
                        hour: date[1],
                        type: 'added'
                    });

                    ordersNum[`added-${orderNum}`] = 1;

                    // Calculator price
                    total[item.textContent] = price + total[item.textContent];
                }

                // Checked remove record
                if (parent.classList.value === 'record removed' && parent.querySelector('div.record__title > div.record__date > span.record__smal-title').textContent !== 'اعتبار') {

                    if (ordersNum[item.textContent].hasOwnProperty(`removed-${orderNum}`))
                        return null;

                    res[item.textContent].push({
                        num: orderNum,
                        res: parent.querySelector('.record__table .record__col--title > span').textContent,
                        price: price.toLocaleString("en-US"),
                        date: date[0],
                        hour: date[1],
                        type: 'removed'
                    });

                    ordersNum[`removed-${orderNum}`] = 1;

                    // Calculator price
                    total[item.textContent] = total[item.textContent] - price;
                }

            });
        };

    while (true) {
        await sleep(1000);

        if (is_break)
            break;

        if (document.querySelector("a.pagination__number.pagination__number--last") === null) {
            break;
        }

        if (document.querySelector("#__next > div > div > div.panel-layout-spinner") === null && document.querySelector("a.pagination__number.pagination__number--last") !== null) {
            await cal();
            document.querySelector("a.pagination__number.pagination__number--last").click();
        }

    }

    let win = window.open("", "نتیجه خروجی"),
        style = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
<link rel="stylesheet" href="${chrome.extension.getURL('/css/template.css')}">
                <style>
                    body {
                        direction: rtl;
                        font-family: Vazir,serif;
                    }
                    h1 {
                        margin: 50px auto;
                        text-align: center;
                    }
                    tr.removed {
                        background-color: #FFEBEE;
                    }

                </style>`,
        html = `<div class="container"><h1 class="mb-5 font-weight-bolder">گزارش فروش ژاکت در ${window.jMonth(month)} ماه ${years}</h1>`;

    Object.keys(total).map(key => {

        if (total[key] !== 0) {

            html += `<table class="table table-bordered mt-5 mb-5"><thead class="thead-dark">
                <tr>
                    <th colspan="5" class="text-center">${key}</th>
                </tr>
                <tr>
                  <th scope="col" class="text-center">شماره سفارش</th>
                  <th class="text-center">عنوان عملیات</th>
                  <th class="text-center">نوع عملیات</th>
                  <th class="text-center">تاریخ سفارش</th>
                  <th class="text-center">مبلغ</th>
                </tr>
              </thead>
              <tbody>`;

            res[key].map(item => {
                let type = item.type === 'added' ? 'فروش' : 'کسر';
                html += `<tr class="${item.type}">
                        <th scope="row" class="text-center">${item.num}</th>
                        <td>${item.res}</td>
                        <td class="text-center">${type}</td>
                        <td class="text-center">${item.date} - ${item.hour}</td>
                        <td class="text-center">${item.price}</td>
                    </tr>`;
            });
            html += `
                    <tr>
                        <th colspan="4">مجموع فروش</th>
                        <td class="text-center">${total[key].toLocaleString("en-US")} تومان</td>
                    </tr>
                    </tbody></table>`;
        }
    });

    html += `</div>`;

    win.document.body.innerHTML = `${style} ${html}`;

};

window.jMonth = (month) => {
    month = parseInt(month);

    switch (month) {
        case 1:
            return 'فروردین';
        case 2:
            return 'اردیبهشت';
        case 3:
            return 'خرداد';
        case 4:
            return 'تیر';
        case 5:
            return 'مرداد';
        case 6:
            return 'شهریور';
        case 7:
            return 'مهر';
        case 8:
            return 'آبان';
        case 9:
            return 'آذر';
        case 10:
            return 'دی';
        case 11:
            return 'بهمن';
        case 12:
            return 'اسفند';
        default:
            return month;

    }
};
