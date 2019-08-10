var obj = {
    "ID_TRANSACTION": 3,
    "GUID_TRANSACTION": "c360e8e6-05cf-403f-85e9-509034c90b17",
    "ID_USER_DOWNLOADER": null,
    "ADDRESS": "3GLwNAoPq2GLiZKCwfgk4Yrp4jLJnsmeRz",
    "DEST_TAG": null,
    "CURRENCY_ITEM": "LTC",
    "CURRENCY_USED": "BTC",
    "EXPECTING_AMOUNT": 20.00000000,
    "GOT_AMOUNT": 0.00000000,
    "UNCONFIRMED_BALANCE": null,
    "PAYPROCESSOR_ID": "CPDH5IISHVOYEKZBCJ1MKBH3DW",
    "CONFIRMATIONS_NEEDED": 2,
    "CREATED": "2019-08-07T02:18:01.407",
    "LAST_CHECKED": null,
    "STATE": "N",
    "PAY_BEFORE_UTC": "2019-08-07T05:18:01.41",
    "CART_JSON": {
        "items": [
            {
                "Qty": 1,
                "ID_PRODUCT": 1080,
                "Name": "Bon Vivant Collection 15",
                "Price": 20.0,
                "Currency": "LTC",
                "Hash": 1664635291
            }]
    },
    "CurrencyPayingWith": "BTC",
    "total": 20.0,
    "Currency": "LTC",
    "Hash": 1664635291
}
show_qr_code = function () {
    var el = kjua({ text: obj.ADDRESS });
    document.querySelector('body').appendChild(el);
    setTimeout(payment_detected, 1000);
}

payment_expired = function () {
    var date = new Date(obj.PAY_BEFORE_UTC);
    var dateNow = new Date('2019-08-07T05:03:01.41'); // hardcoded UTC_NOW
    console.log(date);
    console.log(dateNow);
    var timeDiff = date.getTime() - dateNow.getTime();
    var minutesDiff = timeDiff / (1000 * 60);
    if (minutesDiff <= 0) {
        alert('expired');
    }
    // if PAY_BEFORE_UTC < UTC.NOW payment expired
}

payment_detected = function () {
    //  hide qr code and show the squirell
    document.querySelector('body').innerHTML =
        '<svg width="113" height="100" viewBox="0 0 113 100" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path fill-rule="evenodd" clip-rule="evenodd" d="M19.1624 20.9062C19.3928 21.33 19.7242 21.6913 20.1279 21.9585C20.5315 22.2257 20.9949 22.3905 21.4776 22.4387C21.9603 22.4868 22.4475 22.4167 22.8966 22.2346C23.3457 22.0525 23.7429 21.7638 24.0536 21.3939C25.6356 19.9307 25.9501 17.3311 23.9307 16.7166C22.781 16.3508 16.8286 16.2971 19.1624 20.9062ZM34.0839 3.82331C39.7784 -0.4346 41.4809 -0.0785547 42.8394 0.0848361C44.2962 0.267736 44.3404 1.72118 43.4658 4.37933C42.4831 7.34231 40.0634 12.2148 38.3757 16.7702C33.7523 29.2489 41.5422 37.5477 51.7127 42.9542C58.5912 46.6122 67.1599 50.7092 74.2448 57.5862C79.6863 62.8732 79.8779 67.6043 81.3372 68.8968C82.0742 69.5527 85.4151 71.8232 83.6267 60.654C83.0517 56.6524 81.4663 52.8602 79.018 49.6304C76.5697 46.4005 73.3381 43.8379 69.624 42.1811C64.1432 39.4596 59.2349 39.3011 55.3755 37.9378C35.0322 30.734 56.9969 -2.33676 89.1664 11.2832C119.847 24.2715 123.198 77.0419 85.6977 81.2998C83.4291 86.9349 79.1418 91.5384 73.6602 94.2248C66.1233 97.8706 60.4264 96.6317 52.123 96.9073C45.0897 97.1268 39.2945 96.1464 39.7686 92.6957C40.4147 88.0159 51.8061 90.896 51.8478 80.8365C51.8749 75.1153 45.6104 71.6939 42.2866 77.7491C40.809 80.8871 38.8891 83.8004 36.5848 86.4015C30.4432 93.4005 22.3831 102.443 14.7208 99.3899C12.8661 98.6582 12.1193 96.6025 15.1974 93.9248C16.5289 92.7664 17.8432 91.8593 19.1649 90.5375C21.452 88.25 22.953 82.7776 23.7317 78.8051L23.7759 78.5612C22.1585 83.0023 18.9593 86.702 14.7822 88.9621C10.9548 91.4398 8.35573 89.545 10.4635 86.8185C14.981 80.7986 18.4502 74.0699 20.7273 66.9117C21.3758 64.9973 21.9973 63.8511 22.6164 63.878C22.496 63.3073 22.3708 62.7269 22.2406 62.1416C18.6244 45.5953 16.0818 40.7131 13.0896 37.7208C10.9106 35.5406 -2.92757 23.657 0.560839 18.9991C5.44707 12.4513 13.775 9.38836 21.3439 8.04465C22.2037 7.89101 24.3041 7.69592 26.3087 7.44718L26.3554 7.35207C27.9211 5.24999 29.651 3.27345 31.5291 1.44074C32.6739 0.101906 35.1329 0.284807 34.7227 1.63095C34.4623 2.45034 34.2731 3.13561 34.0839 3.82331Z" fill="#2BB7BD"/>' +
        '</svg>';
}

payment_completed = function () {
    // redirect to "/PaymentCompleted?ID_TRANSACTION=3" page
    window.location.href = "/PaymentCompleted?ID_TRANSACTION=" + obj.ID_TRANSACTION;
}

myFunction = function () {
    /* Get the text field */
    var copyText = document.getElementById("myInput");

    /* Select the text field */
    copyText.select();

    /* Copy the text inside the text field */
    document.execCommand("copy");

    /* Alert the copied text */
    alert("Copied the text: " + copyText.value);
}
