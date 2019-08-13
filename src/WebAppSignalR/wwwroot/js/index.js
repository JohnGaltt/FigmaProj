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
            CURRENT_STATUS_TYPE: "",
            AWAITING: "awaiting",
            EXPIRED: "expired",
            PAYMENT_DETECTED: 'payment_detected'
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
            currency_paying_with: null,
            currency: null,
            total: null,
            total_paying_with: null,
            stats_container: null,
            payment_body: null
        },
        loadTransactionHeader: function (value) {
            this.setStatus(this.state.AWAITING);
            var end = new Date(value.PAY_BEFORE_UTC).getTime();
            
            var x = setInterval(function () {
                var now = new Date().getTime();
                var diff = end - now;

                if (this.state.CURRENT_STATUS_TYPE === "payment_detected") {
                    clearInterval(x);
                    var sec = 0;
                    var min = 0;
                    this.html.payment_time_stamp.innerHTML = '00:00';
                    setInterval(function () {
                        sec++;
                        min = parseInt(min);
                        if (sec < 10) {
                            sec = '0' + sec;
                        }
                        if (sec >= 60) {
                            sec = '00';
                            min++;
                        }
                        if (min < 10) {
                            min = parseInt(min);
                            min = '0' + min;
                        }
                        this.html.payment_time_stamp.innerHTML = min + ':' + sec;
                    }.bind(this), 1000);
                }

                if (diff <= 0) {
                    clearInterval(x);
                    this.html.payment_time_stamp.innerHTML = '00:00';
                    this.setStatus(this.state.EXPIRED);
                } else {
                    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((diff % (1000 * 60)) / 1000);
                    if (seconds < 10) {
                        seconds = '0' + seconds;
                    }
                    this.html.payment_time_stamp.innerHTML = minutes + ':' + seconds;
                }
            }.bind(this), 1000);
        },
        statusSettings: function (statusKey, transactionId) {
            var statusCollection = {
                [this.state.AWAITING]: {
                    text: "Awaiting Payment...",
                    className: "payment-container__waiting-status--awaiting",
                    spinner: true
                },
                [this.state.PAYMENT_DETECTED]: {
                    text: "Waiting for " + transactionId + " confirmations...",
                    className: "payment-container__waiting-status--awaiting",
                    spinner: true
                },
                [this.state.EXPIRED]: {
                    text: "Invoice Expired",
                    className: "payment-container__waiting-status--expired",
                    spinner: false
                }
            };

            return statusCollection[statusKey]
        },
        setStatus: function (status, transactionId) {
            this.state.CURRENT_STATUS_TYPE = status;
            var statusResult = this.statusSettings(status, transactionId);
            var defaultClassName = 'payment-container__waiting-status ';
            this.html.status_label.innerHTML = statusResult.text;
            this.html.status_wrapper.classList.value = defaultClassName.concat(statusResult.className);
            if (statusResult.spinner) {
                this.html.status_spinner_wrapper.innerHTML = renderSpinner()
            } else {
                this.html.status_spinner_wrapper.innerHTML = ''
            }
            this.renderBodyPaymentContainer(status)
        },
        renderBodyPaymentContainer: function(status) {
            switch (status) {
                case this.state.AWAITING: {
                    this.html.stats_container.style.display = 'block';
                    this.html.payment_body.style.display = 'block';
                    this.html.footer.style.display = 'block';
                    break;
                }
                case this.state.EXPIRED: {
                    this.html.stats_container.style.display = 'block';
                    this.html.payment_body.style.display = 'none';
                    this.html.footer.style.display = 'none';
                    break;
                }
                case this.state.PAYMENT_DETECTED: {
                    this.html.payment_body.style.display = 'block';
                    this.html.stats_container.style.display = 'block';
                    document.getElementById('js-box-is-loading').style.display = 'flex';
                    document.getElementById('js-box-is-ready').style.display = 'none';
                    this.html.footer.style.display = 'none';
                    break;
                }
                default : {
                    this.html.stats_container.style.display = 'none';
                    this.html.payment_body.style.display = 'none';
                    this.html.footer.style.display = 'none';
                }
            }
        },
        loadCardsHeader: function (value) {
            value.CART_JSON.items.forEach(element => this.renderListItem(element));
        },
        renderListItem: function (element) {
            var node = document.createElement('li');
            node.className = "payment-container__card-item";
            var item = this.html.card_list.appendChild(node);
            var quantity = document.createElement('p');
            var price = document.createElement('p');
            var name = document.createElement('p');
            var symbol = document.createElement('p');

            quantity.className = "payment-container__quantity";
            price.className = "payment-container__price";
            name.className = "payment-container__card-name";
            symbol.className = "payment-container__concat-symbol";

            quantity.innerHTML = element.Qty;
            price.innerHTML = element.Price;
            name.innerHTML = element.Name;
            symbol.innerHTML = 'x';

            item.appendChild(quantity);
            item.appendChild(symbol);
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
        loadPayingValues: function (value) {
            this.html.total.innerHTML = value.total;
            this.html.total_paying_with.innerHTML = value.TotalPayingWith;
            this.html.currency.innerHTML = value.Currency;
            this.html.currency_paying_with.innerHTML = value.CurrencyPayingWith;
        },
        payment_detected: function (response) {
            this.setStatus(this.state.PAYMENT_DETECTED, response.CONFIRMATIONS_NEEDED);
        },
        payment_completed: function (value) {
            window.location.href = "/PaymentCompleted?ID_TRANSACTION=" + value.ID_TRANSACTION;
        },
        bindEvents: function () {
            
        },
        bindNodes: function () {
            this.html.status_label = document.getElementById('js-waiting-text');
            this.html.payment_time_stamp = document.getElementById('js-payment-time');
            this.html.card_list = document.getElementById('js-payment-card-list');
            this.html.qr_code_div = document.getElementById('js-qr-code-placeholder');
            this.html.stats_value = document.getElementById('js-stats-value');
            this.html.wallet_address = document.getElementById('js-wallet-address');
            this.html.footer = document.getElementById('js-footer');
            this.html.status_wrapper = document.getElementById('js-waiting-status-wrapper')
            this.html.status_spinner_wrapper = document.getElementById('js-payment-container');
            //Currency paying with
            this.html.total = document.getElementById('total-value');
            this.html.currency = document.getElementById('currency-type');
            this.html.total_paying_with = document.getElementById('paying-result');
            this.html.currency_paying_with = document.getElementById('currency-result');
            //payment_body
            this.html.stats_container = document.getElementById('js-stats-container');
            this.html.payment_body = document.getElementById('js-payment-body');

            return this;
        },
        initialize: function () {
            this.bindNodes().bindEvents();

            return this;
        },
    };

    //For testing purposes
    var now = new Date(); 
    var minutes = 15 * 60 * 1000; // 15 minutes in milliseconds
    now.setTime(now.getTime() + minutes);

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
                "PAY_BEFORE_UTC": now,
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
                "TotalPayingWith": 0.1111,
                "total": 20.0,
                "Currency": "LTC",
                "Hash": 1664635291
            })
        }
    }

    function connectToSignalR(completedCallBack, detectedCallBack){
        var connection = new signalR.HubConnectionBuilder().withUrl("/transactionHub").build();
    
        start();
    
        connection.on("payment_completed", function () {
            completedCallBack();
        });
        
        connection.on("payment_detected", function () {
            detectedCallBack();
        });

        function start() {
            connection.start().then(function () {

            }).catch(function (err) {
                console.log(err);
                setTimeout(() => start(), 5000);
            });
        }
    }

    var ButtonWallet = {
        html: {
            btn: null,
            input: null,
        },
        bindNode: function () {
            this.html.button = document.getElementById('js-wallet-copy-address');
            this.html.input = document.getElementById('js-wallet-address');
        },
        initialize: function () {
            this.bindNode();

            var clipboard = new ClipboardJS(this.html.button);

            clipboard.on('success', this.handleSuccess.bind(this));
            clipboard.on('error', this.handleError.bind(this));
        },
        handleSuccess: function (e) {
            // TODO: handle success tooltip ?
        },
        handleError: function (e) {
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
        payment.loadPayingValues(response);
        connectToSignalR(
            function()
            {
                payment.payment_completed(response);
            },
            function()
            {
                payment.payment_detected(response);
            });
    });

    try {
        $(payment.html.footer).click(function (event) {
            window.infobox = showInfo('In order to pay this invoice you need to have a cryptocurrency wallet on your phone or computer. The easiest way to get Litecoin is with <a target="_blank" href="http://Coinbase.com">Coinbase.com</a> via their <a target="_blank" href="https://itunes.apple.com/us/app/coinbase-bitcoin-wallet/id886427730?mt=8">wallet app</a>. <br><br>Once you have the wallet loaded with some Litecoin, you need to send the amount on this invoice to the address shown here. You can do that by using the camera on your phone to scan the QRC code on this page.<br>');
            event.preventDefault();
            event.stopPropagation();
        });
    } catch (e) {
        console.warn('Define showInfo method please', { e })
    }
})

