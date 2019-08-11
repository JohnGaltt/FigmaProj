window.addEventListener('DOMContentLoaded', function (event) {
    var ModalApi = {
        html: {
            modal: null,
            openBtn: null,
            closeBtn: null
        },
        showModal: function (event) {
            this.html.modal.style.display = 'block'
        },
        hideModal: function (event) {
            this.html.modal.style.display = 'none'
        },
        bindEvents: function () {
            this.html.openBtn.addEventListener('click', this.showModal.bind(this), false);
            this.html.closeBtn.addEventListener('click', this.hideModal.bind(this), false);
        },
        bindNodes: function () {
            this.html.modal = document.getElementById('js-modal-window');
            this.html.openBtn = document.getElementById('js-modal-btn-open');
            this.html.closeBtn = document.getElementById('js-modal-btn-close');

            return this;
        },
        initialize: function () {
            this.bindNodes().bindEvents();

            return this
        },
    };

    function renderSpinner() {
        return `
            <svg version="1.1" id="L8" xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
              viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
                <path fill="#ffffff"
                    d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                    <animateTransform attributeName="transform" attributeType="XML"
                        type="rotate" dur="1s" from="0 50 50" to="360 50 50"
                        repeatCount="indefinite">
                    </animateTransform>
                 </path>
             </svg>
        `;
    }

    var PaymentContainer = {
        state: {
            isLoading: false,
            AWAITING : "awaiting",
            EXPIRED : "expired",
        },
        html: {
            status_label: null,
            status_wrapper: null,
            status_spinner_wrapper: null,
            payment_time_stamp: null,
            card_list: [],
            qr_code_div: null,
            stats_value: null,
            wallet_address: null,
            footer: null,
            // wallet_button: null,
        },
        loadTransactionHeader: function (value) {
            this.setStatus(this.state.AWAITING);
            // this.html.status_label.innerHTML = "Awaiting Payment...";
            var x = setInterval(function () {
                var end = new Date(value.PAY_BEFORE_UTC).getTime();
                var now = new Date().getTime(); // hardcoded UTC_NOW
                var diff = end - now;

                var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((diff % (1000 * 60)) / 1000);

                this.html.payment_time_stamp.innerHTML = minutes + ':' + seconds;

                if (diff < 0) {
                    clearInterval(x);
                    this.setStatus(this.state.EXPIRED);
                }
            }.bind(this), 1000);
        },
        statusSettings: function(statusKey) {
            var statusCollection =  {
                [this.state.AWAITING] : {
                    text: "Awaiting Payment...",
                    className: "payment-container__waiting-status--awaiting",
                    spinner: true
                },
                [this.state.EXPIRED] : {
                    text: "Expired",
                    className: "payment-container__waiting-status--expired",
                    spinner: false
                }
            };

            return statusCollection[statusKey]
        },
        setStatus: function(status) {
            var statusResult = this.statusSettings(status);
            var defaultClassName = 'payment-container__waiting-status ';
            this.html.status_label.innerHTML = statusResult.text;
            this.html.status_wrapper.classList.value = defaultClassName.concat(statusResult.className);
            if(statusResult.spinner) {
                this.html.status_spinner_wrapper.innerHTML = renderSpinner()
            }
        },
        loadCardsHeader: function (value) {
            value.CART_JSON.items.forEach(element => this.renderListItem(element));
        },
        renderListItem: function (element) {
            // debugger;
            var node = document.createElement('li');
            node.className = "payment-container__card-item";
            var item = this.html.card_list.appendChild(node);
            var quantity = document.createElement('p');
            var price = document.createElement('p');
            var name = document.createElement('p');

            quantity.className = "payment-container__quantity";
            price.className = "payment-container__price";
            name.className = "payment-container__card-name";

            quantity.innerHTML = element.Qty;
            price.innerHTML = element.Price;
            name.innerHTML = element.Name;

            item.appendChild(quantity);
            item.appendChild(price);
            item.appendChild(name);
        },
        loadQrCode: function (value) {
            var element = kjua({
                text: value.ADDRESS,
                size: 160,
            });
            this.html.qr_code_div.appendChild(element);
        },
        loadStatsValue: function (value) {
            this.html.stats_value.innerHTML = value.total
        },
        loadWalletAddress: function (value) {
            this.html.wallet_address.value = value.ADDRESS;
        },
        copyText: function (value) {
            this.html.wallet_address.select();
            document.execCommand("copy");
            alert("Copied the text: " + this.html.wallet_address.value);
        },
        payment_expired: function (value) {
            moment.utc(moment.duration(4500, "seconds").asMilliseconds()).format("HH:mm")
            var end = new moment(value.PAY_BEFORE_UTC);
            var now = new moment('2019-08-07T05:03:01.41'); // hardcoded UTC_NOW
            var duration = moment.duration(end.diff(now));

            var timeDiff = date.getTime() - dateNow.getTime();
            var minutesDiff = timeDiff / (1000 * 60);

            console.log(minutesDiff);
            // if PAY_BEFORE_UTC < UTC.NOW payment expired
        },
        payment_detected: function () {
            this.html.qr_code_div.innerHTML =
                '<svg width="113" height="100" viewBox="0 0 113 100" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                '<path fill-rule="evenodd" clip-rule="evenodd" d="M19.1624 20.9062C19.3928 21.33 19.7242 21.6913 20.1279 21.9585C20.5315 22.2257 20.9949 22.3905 21.4776 22.4387C21.9603 22.4868 22.4475 22.4167 22.8966 22.2346C23.3457 22.0525 23.7429 21.7638 24.0536 21.3939C25.6356 19.9307 25.9501 17.3311 23.9307 16.7166C22.781 16.3508 16.8286 16.2971 19.1624 20.9062ZM34.0839 3.82331C39.7784 -0.4346 41.4809 -0.0785547 42.8394 0.0848361C44.2962 0.267736 44.3404 1.72118 43.4658 4.37933C42.4831 7.34231 40.0634 12.2148 38.3757 16.7702C33.7523 29.2489 41.5422 37.5477 51.7127 42.9542C58.5912 46.6122 67.1599 50.7092 74.2448 57.5862C79.6863 62.8732 79.8779 67.6043 81.3372 68.8968C82.0742 69.5527 85.4151 71.8232 83.6267 60.654C83.0517 56.6524 81.4663 52.8602 79.018 49.6304C76.5697 46.4005 73.3381 43.8379 69.624 42.1811C64.1432 39.4596 59.2349 39.3011 55.3755 37.9378C35.0322 30.734 56.9969 -2.33676 89.1664 11.2832C119.847 24.2715 123.198 77.0419 85.6977 81.2998C83.4291 86.9349 79.1418 91.5384 73.6602 94.2248C66.1233 97.8706 60.4264 96.6317 52.123 96.9073C45.0897 97.1268 39.2945 96.1464 39.7686 92.6957C40.4147 88.0159 51.8061 90.896 51.8478 80.8365C51.8749 75.1153 45.6104 71.6939 42.2866 77.7491C40.809 80.8871 38.8891 83.8004 36.5848 86.4015C30.4432 93.4005 22.3831 102.443 14.7208 99.3899C12.8661 98.6582 12.1193 96.6025 15.1974 93.9248C16.5289 92.7664 17.8432 91.8593 19.1649 90.5375C21.452 88.25 22.953 82.7776 23.7317 78.8051L23.7759 78.5612C22.1585 83.0023 18.9593 86.702 14.7822 88.9621C10.9548 91.4398 8.35573 89.545 10.4635 86.8185C14.981 80.7986 18.4502 74.0699 20.7273 66.9117C21.3758 64.9973 21.9973 63.8511 22.6164 63.878C22.496 63.3073 22.3708 62.7269 22.2406 62.1416C18.6244 45.5953 16.0818 40.7131 13.0896 37.7208C10.9106 35.5406 -2.92757 23.657 0.560839 18.9991C5.44707 12.4513 13.775 9.38836 21.3439 8.04465C22.2037 7.89101 24.3041 7.69592 26.3087 7.44718L26.3554 7.35207C27.9211 5.24999 29.651 3.27345 31.5291 1.44074C32.6739 0.101906 35.1329 0.284807 34.7227 1.63095C34.4623 2.45034 34.2731 3.13561 34.0839 3.82331Z" fill="#2BB7BD"/>' +
                '</svg>';
        },
        payment_completed: function (value) {
            window.location.href = "/PaymentCompleted?ID_TRANSACTION=" + value.ID_TRANSACTION;
        },
        hideFooter: function () {
            this.html.footer.style.display = 'none';
        },
        bindEvents: function () {
            // var clipboard = new ClipboardJS(this.html.wallet_button);
            // this.html.wallet_button.addEventListener('click', this.copyText.bind(this), false);
            var delay = (ms) => new Promise(res => setTimeout(res, ms))
            // delay(3000).then(() => this.hideFooter());
            // delay(3000).then(() => this.payment_detected());
        },
        bindNodes: function () {
            this.html.status_label = document.getElementById('js-waiting-text');
            this.html.payment_time_stamp = document.getElementById('js-payment-time');
            this.html.card_list = document.getElementById('js-payment-card-list');
            this.html.qr_code_div = document.getElementById('js-qr-code-placeholder');
            this.html.stats_value = document.getElementById('js-stats-value');
            this.html.wallet_address = document.getElementById('js-wallet-address');
            this.html.footer = document.getElementById('js-footer');
            // this.html.wallet_button = document.getElementById('js-wallet-copy-address');
            this.html.status_wrapper = document.getElementById('js-waiting-status-wrapper')
            this.html.status_spinner_wrapper = document.getElementById('js-payment-container');

            return this;
        },
        initialize: function () {
            this.bindNodes().bindEvents();

            return this
            // get value from json
            // var obj = ;

            // this.loadTransactionHeader(obj);
            // this.loadCardsHeader(obj);
            // this.loadQrCode(obj);
            // this.loadStatsValue(obj);
            // this.loadWalletAddress(obj);

        },
    };

    var API = {
        getPaymentStats: function (cb) {
            cb({
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
                "PAY_BEFORE_UTC": "2019-11-07T05:18:01.41",
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
            })
        }
    }

    var ButtonWallet = {
        html: {
            btn: null,
            input: null,
        },
        bindNode: function() {
            this.html.button = document.getElementById('js-wallet-copy-address');
            this.html.input = document.getElementById('js-wallet-address');
        },
        initialize: function () {
            this.bindNode();

            var clipboard = new ClipboardJS(this.html.button);

            clipboard.on('success', this.handleSuccess);
            clipboard.on('error', this.handleError);
        },
        handleSuccess: function(e){
             this.html.input.select();
              e.clearSelection();
            // TODO: handle success tooltip ?
        } ,
        handleError: function(e) {
             // TODO: handle error tooltip ?
        }
    }



    var modal = ModalApi.initialize();
    ButtonWallet.initialize();
    var payment = PaymentContainer.initialize();

    API.getPaymentStats(function (response) {
        payment.loadTransactionHeader(response);
        payment.loadCardsHeader(response);
        payment.loadQrCode(response);
        payment.loadStatsValue(response);
        payment.loadWalletAddress(response);

    });

    try {
        $(payment.html.footer).click(function (event) {
            window.infobox = showInfo('In order to pay this invoice you need to have a cryptocurrency wallet on your phone or computer. The easiest way to get Litecoin is with <a target="_blank" href="http://Coinbase.com">Coinbase.com</a> via their <a target="_blank" href="https://itunes.apple.com/us/app/coinbase-bitcoin-wallet/id886427730?mt=8">wallet app</a>. <br><br>Once you have the wallet loaded with some Litecoin, you need to send the amount on this invoice to the address shown here. You can do that by using the camera on your phone to scan the QRC code on this page.<br>');
            event.preventDefault();
            event.stopPropagation();
        });
    } catch (e) {
        console.warn('Define showInfo method please', {e})
    }
})

