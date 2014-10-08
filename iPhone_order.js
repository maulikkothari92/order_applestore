
start_spooky = function (order, callback){
    try {
        var Spooky = require('spooky');
    } catch (e) {
        var Spooky = require('../lib/spooky');
    }
    
    var spooky = new Spooky({
            child: {
                transport: 'http'
            },
            casper: {
                logLevel: 'debug',
                verbose: true ,
                userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X)",
                viewportSize: {width: 1024, height: 768}
            }
        }, function (err) {
            if (err) {
                e = new Error('Failed to initialize SpookyJS');
                e.details = err;
                throw e;
            }
            // Base URLs
            var IPHONE_ORDER = "http://store.apple.com/us/buy-iphone/iphone6";
            
              
            // Getting input 
            var phone = order["products"]["phone"];
            var color = order["products"]["color"];
            var storage = order["products"]["storage"];
            var max_price = order["max_price"];
            var shipping_firstname = order["shipping_address"]["first_name"];
            var shipping_lastname = order["shipping_address"]["last_name"];
            var shipping_address1 = order["shipping_address"]["address_line1"];
            var shipping_address2 = order["shipping_address"]["address_line2"];
            var shipping_postalcode = order["shipping_address"]["zip_code"];
            var shipping_phone = order["shipping_address"]["phone"];
            var shipping_area = shipping_phone.substr(0,3);
            var shipping_phone = shipping_phone.substr(3,9);

            var billing_firstname = order["billing_address"]["first_name"];
            var billing_lastname = order["billing_address"]["last_name"];
            var billing_address1 = order["billing_address"]["address_line1"];
            var billing_address2 = order["billing_address"]["address_line2"];
            var billing_postalcode = order["billing_address"]["zip_code"];
            var billing_phone = order["billing_address"]["phone"];
            var billing_area = billing_phone.substr(0,3);
            var billing_phone = billing_phone.substr(3,9);

            var credit_card_month = order["payment_method"]["expiration_month"];
            var credit_card_number = order["payment_method"]["number"];
            var credit_card_year = order["payment_method"]["expiration_year"];
            var credit_card_cvv = order["payment_method"]["security_code"];
            var email = order["email"];

            

            color = color.toLowerCase();
            color = color.replace(/\s+/g,'');

            storage = storage.toLowerCase();
            storage = storage.replace(/\s+/g,'');



            spooky.start(IPHONE_ORDER);

            spooky.then([{
                  color: color,
                  storage: storage
                },function(){

                
               
                if(color != 'gold' && color != 'space-gray' && color !='silver')
                {
                    this.emit('message','Color is '+color);    
                    this.emit('error', 'invalid_color');
                }

                if(storage != '16gb' && storage != '64gb' && storage !='128gb')
                {
                    this.emit('error', 'invalid_storage');
                }

                
            }]);

            spooky.then(function(){
                this.waitForSelector("#Item15_5inch");
            });

            // screenshots for debugging
            spooky.then(function(){
                this.capture('captures/[Apple Store Page] On Apple Store Page.png');
            });

            spooky.then(function(){
                this.emit('message', "Trying to select the iphone.");    
            });

            var iPhonevalue = "4_7inch"

            if (phone == "6+")
            {
                iPhonemodel = "5_5inch"
            }

            if(phone == "6")
            {
                iPhonemodel = "4_7inch"
            }
      
            
            spooky.thenEvaluate(function(iPhonemodel){
                jQuery('input[value ='+iPhonemodel+']').click();
            },{
                iPhonevalue: iPhonemodel
            });


            spooky.then(function(){
                this.capture('captures/[Apple Store Page] Selected the iPhone model.png');
            });

            spooky.then(function(){
                this.waitForSelector("#Item2silver");
            });

            spooky.thenEvaluate(function(color){
                jQuery('input[value ='+color+']').click();
                
            },{
                color: color
            });

            spooky.then(function(){
                this.capture('captures/[Apple Store Page] Selected the color.png');
            });

            spooky.then(function(){
                this.waitForSelector("#Item4TMOBILEUS");
            });


            spooky.thenEvaluate(function(){
                jQuery('input[value = "TMOBILE/US"]').click();
            });

            spooky.then(function(){
                this.capture('captures/[Apple Store Page] Selected the carrier.png');
            });

            spooky.thenEvaluate(function(storage){
                jQuery('input[value ='+storage+']').click();
            },{
                storage: storage
            });

            spooky.then(function(){
                this.capture('captures/[Apple Store Page] Selected the storage.png');
            });

            spooky.then(function(){
               this.waitForSelector('button[value = "proceed"]');
             });

            spooky.thenEvaluate(function(){
                jQuery('button[value = "proceed"]').click();
            });

            spooky.then(function(){
               this.waitForSelector('button[value = "add-to-cart"]');
             });

            spooky.then(function(){
                this.capture('captures/[Add to Cart] After selecting the iPhone.png');
            });

            spooky.thenEvaluate(function(){
                jQuery('button[value = "add-to-cart"]').click();
            });

            spooky.then(function(){
               this.waitForSelector('#checkout-now');
             });
            
            spooky.then(function(){
                this.capture('captures/[Add to Cart] After clicking add to cart button.png');
            });

            spooky.then([{
                  max_price: max_price
                },function(){
                var price_on_page = this.evaluate(function() {      
                  return document.getElementById("cart-summary-order-total-value").innerHTML
                });
                price_on_page = price_on_page.replace(/\$/g, '')
                price_on_page = parseInt(price_on_page);
                max_price = parseInt(max_price);

                if(price_on_page > max_price)
                {
                    this.emit('error', 'max_price_exceeded');
                }

                this.emit('message', "Trying to click the Checkout Now button");   

                this.evaluate(function() {      
                    document.getElementById("checkout-now").click()
                    console.log('Clicking the Checkout now button');
                });
                
            }]);

            spooky.then(function(){
               this.wait(1000);
             });

            spooky.then(function(){
                this.capture('captures/[Add to Cart] After clicking checkout-now button.png');
            });


            spooky.thenEvaluate(function(){
                document.getElementById("guest-checkout").click()
            });

            spooky.then(function(){
               this.wait(1000);
             });

            spooky.then(function(){
                this.capture('captures/[Add to Cart] After clicking Continue as Guest.png');
            });

            spooky.thenEvaluate(function(){
                document.getElementById("cart-continue-button").click()
            });

            spooky.then(function(){
               this.waitForSelector("#shipping-user-firstName");
               this.waitForSelector("#shipping-user-lastName");
             });

            spooky.then(function(){
                this.capture('captures/[Add to Cart] After clicking Continue button.png');
            });


            spooky.thenEvaluate(function( shipping_firstname, shipping_lastname){
                console.log("Entering shipping details");
                document.getElementById("shipping-user-firstName").value = shipping_firstname;
                document.getElementById("shipping-user-lastName").value = shipping_lastname;
            }, { shipping_firstname: shipping_firstname,
               shipping_lastname: shipping_lastname
               });

            spooky.then(function(){
               this.wait(1000);
             });

            spooky.thenEvaluate(function(shipping_area, shipping_phone){
                document.getElementById("shipping-user-daytimePhoneAreaCode").value = shipping_area;
                document.getElementById("shipping-user-daytimePhone").value = shipping_phone;
            }, { shipping_area: shipping_area,
                 shipping_phone: shipping_phone
                });

             spooky.thenEvaluate(function(shipping_postalcode){
                document.getElementById("shipping-user-postalCode").value = shipping_postalcode;
            }, {shipping_postalcode: shipping_postalcode
                });

            spooky.thenEvaluate(function( shipping_address1, shipping_address2){
                document.getElementById("shipping-user-street").value = shipping_address1;
                document.getElementById("shipping-user-street2").value = shipping_address2;
            }, { shipping_address1: shipping_address1,
               shipping_address2: shipping_address2
               }); 


            spooky.then(function(){
               this.wait(1000);
             });

            spooky.thenEvaluate(function(){
                document.getElementById("shipping-continue-button").click()
            });

            spooky.then(function(){
               this.wait(2000);
             });

            spooky.thenEvaluate(function(){
                document.getElementById("shipping-continue-button").click()
            });

            spooky.then(function(){
                this.capture('captures/[Add to Cart] After filling address.png');
            });

            spooky.then(function(){
               this.wait(1000);
             });

            spooky.thenEvaluate(function( billing_firstname, billing_lastname){
                console.log("Entering billing details");
                document.getElementById("payment-credit-user-address-firstName").value = billing_firstname;
                document.getElementById("payment-credit-user-address-lastName").value = billing_lastname;
            }, { billiing_firstname: billing_firstname,
               billing_lastname: billing_lastname
               });    


            spooky.then(function(){
               this.wait(1000);
             });


            spooky.thenEvaluate(function(billing_area, billing_phone){
                console.log("Entering the phone details.");
                document.getElementById("payment-credit-user-daytimePhoneAreaCode").value = billing_area;
                document.getElementById("payment-credit-user-daytimePhone").value = billing_phone;

            }, { billing_area: billing_area,
                 billing_phone: billing_phone
                });

            spooky.thenEvaluate(function(credit_card_number){
                console.log("Entering credit_card_number");
                document.getElementById("payment-credit-method-cc0-cardNumber").value = credit_card_number
            },{
                credit_card_number: credit_card_number
            });


            spooky.thenEvaluate(function(credit_card_month){
                console.log("Entering credit_card_month");
                document.getElementById("payment-credit-method-cc0-expirationMonth").value = credit_card_month
            }, {
                credit_card_month: credit_card_month
            });
            
            spooky.thenEvaluate(function(credit_card_year){
                console.log("Entering credit_card_year")
                document.getElementById("payment-credit-method-cc0-expirationYear").value = credit_card_year
            },{
                credit_card_year: credit_card_year
            });

            spooky.then(function(){
               this.wait(1000);
             });


           spooky.thenEvaluate(function(credit_card_cvv){
                console.log("Entering credit card security code");
                document.getElementById("payment-credit-method-cc0-security-code").value = credit_card_cvv;
            }, {
                credit_card_cvv: credit_card_cvv

                });



            spooky.thenEvaluate(function(email){
                console.log("Entering email")
                document.getElementById("payment-credit-user-address-emailAddress").value = email;
            },{ email: email });

            spooky.then(function(){
               this.wait(1000);
             });

             spooky.thenEvaluate(function(billing_postalcode){
                console.log("Entering postal details")
                document.getElementById("payment-credit-user-address-postalCode").value = billing_postalcode;
            }, {billing_postalcode: billing_postalcode
                });

            spooky.thenEvaluate(function( billing_address1, billing_address2){
                console.log("Entering billing details")
                document.getElementById("payment-credit-user-address-street").value = billing_address1;
                document.getElementById("payment-credit-user-address-street2").value = billing_address2;
            }, { billing_address1: billing_address1,
               billing_address2: billing_address2
               });

            spooky.then(function(){
               this.waitForSelector('#payment-credit-user-address-daytimePhoneAreaCode');
               this.waitForSelector('#payment-credit-user-address-daytimePhone');
             });


            spooky.thenEvaluate(function(billing_area, billing_phone){
                console.log("Entering the phone details.");
                console.log(billing_phone);
                console.log(billing_area);
                document.getElementById("payment-credit-user-address-daytimePhoneAreaCode").value = billing_area;
                document.getElementById("payment-credit-user-address-daytimePhone").value = billing_phone;

            }, { billing_area: billing_area,
                 billing_phone: billing_phone
                });    


            spooky.then(function(){
                this.capture('captures/[Add to Cart] Before payment.png');
            });

            spooky.then(function(){
               this.waitForSelector('#payment-continue-button');
             });


            spooky.thenEvaluate(function(){
                document.getElementById("payment-continue-button").click()
            });

            spooky.then(function(){
               this.wait(1000);
             });

            spooky.thenEvaluate(function(credit_card_cvv){
                document.getElementById("payment-credit-method-cc0-security-code").value = credit_card_cvv;
            }, {
                credit_card_cvv: credit_card_cvv
            });

            spooky.then(function(){
               this.waitForSelector('#payment-continue-button');
             });


            spooky.thenEvaluate(function(){
                document.getElementById("payment-continue-button").click()
            });

            spooky.then(function(){
               this.wait(3000);
             });

            spooky.then(function(){
                this.capture('captures/[Add to Cart] After payment.png');
            });

            spooky.then([{
                  max_price: max_price
                },function(){
                var price_on_page = this.evaluate(function() {      
                  return document.getElementById("cart-summary-order-total-value").innerHTML
                });
                price_on_page = price_on_page.replace(/\$/g, '')
                price_on_page = parseInt(price_on_page);
                max_price = parseInt(max_price);

                if(price_on_page > max_price)
                {
                    this.emit('error', 'max_price_exceeded');
                }

                this.emit('message', "Trying to click the Checkout Now button");   

                this.evaluate(function() {      
                    document.getElementById("account-continue-as-guest").click()
                    console.log('Clicking the Continue as Guest button');
                });
                
            }]);

            spooky.then(function(){
               this.wait(2000);
             });


            spooky.then(function(){
                this.capture('captures/[Add to Cart] After the last continue.png');
            });

            spooky.then(function(){
               this.waitForSelector('#place-order-button');
             });


            spooky.then(function(){
               this.wait(2000);
             });


            spooky.thenEvaluate(function(){
                console.log("Clicking the PLACE ORDER BUTTON");
                document.getElementById("place-order-button").click()
            });

            spooky.then(function(){
               this.wait(10000);
             });

            spooky.then(function(){
                this.capture('captures/[Add to Cart] After clicking place order.png');
            });


            spooky.then(function(){
                var invalid_details = this.evaluate(function(){
                    return document.getElementById("payment-error").innerHTML;
                });

                if(typeof invalid_details != 'undefined'){

                    this.emit('error', 'invalid_details');
                } 


            });


            spooky.then(function(){
                this.capture('captures/[Final Page] Payment Error caught????.png');
            });

                
            spooky.run();
        });

    // Uncomment this block to see all of the things Casper has to say.
   // There are a lot.
   // He has opinions.

    spooky.on('console', function (line) {
        console.log(line);
    });


    spooky.on('remote.message', function(message) {
        console.log('[Inside Evaluate] ' + message);
    });

    spooky.on('message', function (greeting) {
        console.log(greeting);
    });

    spooky.on('respond_to_callback', function(response){
        callback(response)
    });

    spooky.on('success', function(order_id, order_total, data){

        var response = {
                'success': 'true',
                'message': 'Order has been placed',
                'order_id': order_id,
                'order_total': order_total,
                'data': data
            }

        console.log('[Success]', JSON.stringify(response));
        spooky.emit('respond_to_callback', response);
        spooky.then(function() {
            this.exit();
        });
    });    



    spooky.on('error', function(code, data){
        var errors = {
            'internal_error': 'The retailer you requested is experiencing outages. Please try again or contact support@zinc.io if this error persists.',
            'invalid_request': 'Validation failed on the request.',
            'invalid_color': 'Color can be gold or space-gray or silver .',
            'invalid_storage': 'Invalid storage size. iPhone 6 comes in 3 storage sizes 16gb or 64gb or 128gb',
            'invalid_quantity' : "The quantity for one of the products does not match the one available on the retailer store." ,
            'invalid_size' : "The size for one of the products does not match the one available on the retailer store. The size may be sold out or invalid.",
            'invalid_product' : "One of the products does not match the one available on the retailer store.",
            'invalid_credentials' : "The username or password is invalid.",
            'max_price_exceeded' : "The price of the product exceeded the maximum price specified in the request.",
            'unknown_error': "Some unknown error occured after clicking the confirm order button. The order may or may not have been placed. Please check your order history.",
            'invalid_details' : "Either shipping or billing or credit card details are invalid"
        }
        var response = errors[code];

        if (typeof data === 'undefined')
        {
            response = {
                'success': 'false',
                'code': code,
                'message': errors[code],
            };
        }
        else 
        {  
            response = {
                'success': 'false',
                'code': code,
                'message': errors[code],
                'data': data
            };
        }
        console.log('[Error Response]', JSON.stringify(response));
        spooky.emit('respond_to_callback', response);
        spooky.then(function() {
            this.exit();
        });
    
    });

    spooky.on('log', function (log) {
        if (log.space === 'remote') {
            console.log(log.message.replace(/ \- .*/, ''));
        }
    });

    return "Spooky Started"
}    

module.exports.start_spooky = start_spooky;