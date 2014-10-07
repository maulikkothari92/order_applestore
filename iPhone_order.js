
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
            

            spooky.start(IPHONE_ORDER);

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



            spooky.thenEvaluate(function(){
                console.log("Entering email")
                document.getElementById("payment-credit-user-address-emailAddress").value = "mkothari9090@indiana.edu"
            });

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

    
            





        




            

            

        

            // spooky.thenEvaluate(function(email, password){   
            //         $('input[type = email]')[0].value = email;
            //         $('input[type = password]')[0].value = password;
            // }, {    email: email,
            //         password: password });

            // spooky.then(function(){
            //     this.evaluate(function(){
            //         $('.btnLogin').click();
            //     }); 
            // });

            // spooky.then(function(){
            //     this.wait(3000);
            // });

            // spooky.then(function(){
            //     this.capture('captures/[Login] After login .png');
            // });
            // //  If Login failed, the login button still shows up.
            // //  Using this method because "Invalid Credentials" pops up only for a second 
            // //  and it is difficult to detect. 
            // spooky.then(function(){
            //     var invalid_credentials = this.evaluate(function(){
            //         if($('.btnLogin').length)
            //         {
            //             return true
            //         }
            //     });

            //     if(invalid_credentials)
            //     {
            //         this.emit('error', 'invalid_credentials');
            //     }
            //     else
            //     {
            //         this.emit('message', "Logged in.")
            //     }
            // });
            // //  Checking if there are items already in the shopping bag.
            // //  If yes then, calling the clear cart function 
            // spooky.then(function(){
            //     var shopping_bag_count = this.evaluate(function(){
            //         return  parseInt($('.miniBagCount').text().charAt(1));
            //     });

            //     shopping_bag_count = parseInt(shopping_bag_count);

            //     this.emit('message', "Checking if Shopping Cart has items...");
            //     this.emit('message', 'Shopping Bag has '+shopping_bag_count+' items');

            //     if(shopping_bag_count > 0)
            //     {
            //         this.emit('message', 'Calling clear cart function.');
            //         clear_cart(shopping_bag_count); 
            //     }
            // });


            // function clear_cart (shopping_bag_count)
            // {
            //     spooky.thenOpen(CART_URL);

            //     spooky.then(function(){
            //             this.capture('captures/[Clear Cart] Before_cart_clear.png');   
            //         });

            //     //  Extra iteration of loop because of faulty JS sometimes
            //     for(i=0; i<=shopping_bag_count; i++)
            //     {
            //         spooky.then(function(){
            //             this.emit('message', "Clearing one product from cart..")
            //             this.evaluate(function(){
            //                 $('.fa-small-close').click()
            //             });
            //         }); 

            //         spooky.then(function(){
            //             this.wait(2000);
            //         }); 

            //         spooky.then(function(){
            //             this.capture('captures/[Clear Cart] After_cart_clear.png');   
            //         });
            //     }
            // }

            // // Adding the products to the shopping bag. 
            // // Supports multiple products and multiple quantities of each product. 

            // for(i=0; i<products.length;i++)
            // {
            //     product = products[i];
            //     var quantity = product["quantity"];
            //     if (typeof product["size"] !== 'undefined')
            //     {
            //         var size = product["size"];
            //     }
            //     else
            //     {
            //         var size = 0;
            //     } 

            //     if(size != 0)
            //     {
            //         size = size + "_";
            //     }  
            //     var product_id = product["product_id"];
            //     var category = product["category"];
            //     for(j=0;j<quantity;j++)
            //     {
            //         add_single_product_cart(size, category, product_id);
            //     }
            // }

            // //  Add a single product to the cart.
            // function add_single_product_cart( size, category, product_id )
            // {
            //     spooky.thenOpen('http://ssense.com/'+category+'/product/rs/rs/'+product_id);

            //     spooky.then(function(){
            //         var page_not_found = this.evaluate(function(){
            //             if($('.content-404-inner').length)
            //             {
            //                 return true;
            //             }
            //             else
            //             {
            //                 return false;
            //             }         
            //         });

            //         if (page_not_found)
            //         {
            //             this.emit('error', 'invalid_product');
            //         }
            //     });

            //     spooky.then(function(){
            //         this.capture('captures/[Add to Cart] Before adding products.png');
            //     });


            //     spooky.then(function(){
            //         this.waitForSelector('.btnAddToBag');      
            //     });

            //     if(size != 0)
            //     {
            //         spooky.then([{
            //               size: size
            //             }, function(){
            //             var new_size = this.evaluate(function(size){
            //                 var size_on_page = $('option[value*='+ size +']').val();
            //                 return size_on_page;
            //             }, { size: size});

            //             if(new_size === null)
            //             {
            //                 this.emit('error', 'invalid_size');
            //             }

            //             this.evaluate(function(new_size){   
            //               jQuery('select[id="size"]').val(new_size);     
            //             }, { new_size: new_size});     
            //         }]);
            //     }

            //     spooky.then(function(){
            //         this.emit('message',"Adding one product to cart.");  
            //         this.evaluate(function() {      
            //             $('.btnAddToBag').click();
            //         });
            //     });

            //     spooky.then(function(){
            //         this.wait(2000);
            //     });

            //     spooky.then(function(){
            //         this.waitForSelector('.productAdded');
            //         this.waitForSelector(".btn-checkout");
            //     }); 

            //     spooky.then(function(){
            //         this.capture('captures/[Add to Cart] After adding products.png');
            //     });
            // }

            // spooky.then(function(){
            //     this.waitForSelector(".btn-checkout")
            // });

            // spooky.then(function(){
            //     this.emit('message','Clicking the checkout button on the products display page.');
        
            //     this.evaluate(function() {
            //         $('.btn-checkout').click();
            //     });
            // });

            // spooky.then(function(){
            //     this.wait(2000);
            // });

            // spooky.then(function(){
            //     this.capture('captures/[Add to Cart] Final product page.png');
            // });

            // spooky.then(function(){
            //     this.waitForSelector('.checkout-button');
            // });

            // spooky.thenOpen(CHECKOUT_URL);

            // spooky.then(function(){
            //     this.wait(1000);
            // });

            // spooky.then(function(){
            //   this.waitForSelector('#confirm');
            // });

            // spooky.then(function(){
            //     this.capture('captures/[Checkout] Before filling the details.png');
            // });

            // spooky.then(function(){
            //     this.waitForSelector('input[name="shipping_lastname"]');
            //     this.waitForSelector('input[name="shipping_firstname"]');
            //     this.waitForSelector('input[name="shipping_address"]');
            // });

            // spooky.then(function(){
            //     this.emit('message', "Checkout page loaded");
            //     this.emit('message', "Entering shipping details.");
            // });

            // spooky.thenEvaluate(function( shipping_firstname, shipping_lastname, shipping_address){
            //     $('input[name="shipping_lastname"]').val(shipping_lastname);
            //     $('input[name="shipping_firstname"]').val(shipping_firstname);
            //     $('input[name="shipping_address"]').val(shipping_address);
            // }, { shipping_firstname: shipping_firstname,
            //    shipping_lastname: shipping_lastname,
            //    shipping_address: shipping_address });

            // spooky.then(function(){
            //     this.waitForSelector('select[name="shipping_country"]');
            //     this.waitForSelector('input[name="shipping_postalcode"]');
            // });

            // spooky.thenEvaluate(function( shipping_country, shipping_state, shipping_postalcode){
         
            //     $('select[name="shipping_country"]').val(shipping_country);
            //     $('select[name="shipping_country"]').trigger('change');
            //     $('select[name="shipping_state"]').val(shipping_state);
            //     $('select[name="shipping_state"]').trigger('change');
            //     $('input[name="shipping_postalcode"]').val(shipping_postalcode);

            // }, { shipping_country: shipping_country, shipping_state: shipping_state, shipping_postalcode: shipping_postalcode });

            // spooky.thenEvaluate(function( shipping_city, shipping_phone){
         
            //     $('input[name="shipping_city"]').val(shipping_city);
            //     $('input[name="shipping_phone"]').val(shipping_phone);
            //     $('select[name="shipping_state"]').trigger('change');
            //     $('select[name="shipping_method"]').trigger('change');

            // }, { shipping_city: shipping_city, shipping_phone: shipping_phone }); 

            // spooky.then(function(){
            //    this.wait(2000);
            // });

            // spooky.then(function(){
            //     this.emit('message', "Selecting shipping method");
            // });

            // spooky.thenEvaluate(function(){
            //     $('select[name="shipping_method"]').val($('select[name="shipping_method"] option:eq(1)').val());
            //     $('select[name="shipping_method"]').trigger('change');
            // });

            // spooky.then(function(){
            //     this.emit('message', "Entering credit card details.");
            // });

            // spooky.thenEvaluate(function( credit_card_name, credit_card_number, credit_card_month, credit_card_year, credit_card_cvv){
            //       // Inserting credit card information.
            //     //console.log("Entering credit card details.");  
            //     $('input[name="creditcardHolderName"]').val(credit_card_name);
            //     $('input[name="creditcardNumber"]').val(credit_card_number);
            //     $('select[name="creditCardMonth"]').val(credit_card_month);
            //     $('select[name="creditCardYear"]').val(credit_card_year);
            //     $('input[name="creditcardCVV"]').val(credit_card_cvv);
            // }, { credit_card_name: credit_card_name,
            //      credit_card_number: credit_card_number, 
            //      credit_card_month: credit_card_month, 
            //      credit_card_year: credit_card_year, 
            //      credit_card_cvv: credit_card_cvv});

            // spooky.then(function(){
            //     this.emit('message', "Entering billing details.");
            // });

            // spooky.thenEvaluate(function(billing_firstname, billing_lastname, billing_address){
            //     // Inserting credit card information.
            //     //console.log("Entering billing details.");
            //     $('input[name="billing_firstname"]').val(billing_firstname);
            //     $('input[name="billing_lastname"]').val(billing_lastname);
            //     $('input[name="billing_address"]').val(billing_address);
            //     $('input[name="billing_postalcode"]').val('47408');
            //     $('select[name="billing_country"]').val('US');
            //     $('select[name="billing_country"]').trigger('change')
            //     $('select[name="billing_state"]').val('IN');
            //     $('input[name="billing_city"]').val('Bloomington');
            //     $('input[name="billing_phone"]').val('8123251316');
            // }, {billing_firstname:billing_firstname, 
            //     billing_lastname: billing_lastname, 
            //     billing_address: billing_address});

            // spooky.thenEvaluate(function(){
            //       // Inserting shipping method information.       
            //     $('select[name="shipping_method"]').val($('select[name="shipping_method"] option:eq(1)').val());
            //     $('select[name="shipping_method"]').trigger('change');
            // });


            // spooky.thenEvaluate(function(billing_postalcode, billing_country, billing_state, billing_city, billing_phone){
            //     // Inserting credit card information.
            //     $('input[name="billing_postalcode"]').val(billing_postalcode);
            //     $('select[name="billing_country"]').val(billing_country);
            //     $('select[name="billing_country"]').trigger('change')
            //     $('select[name="billing_state"]').val(billing_state);
            //     $('input[name="billing_city"]').val(billing_city);
            //     $('input[name="billing_phone"]').val(billing_phone);
            // }, {billing_postalcode: billing_postalcode, 
            //     billing_country: billing_country, 
            //     billing_state: billing_state,
            //     billing_city: billing_city,
            //     billing_phone: billing_phone});

            // spooky.then(function(){
            //     this.wait(2000);
            // });

            // spooky.then(function(){
            //     this.capture('captures/[Checkout] After filling in the details.png');
            // });

            // spooky.then([{
            //       max_price: max_price
            //     },function(){
            //     var price_on_page = this.evaluate(function() {      
            //       return $('span[id="totalPrice"]').text();
            //     });
            //     price_on_page = parseInt(price_on_page);
            //     max_price = parseInt(max_price);

            //     if(price_on_page > max_price)
            //     {
            //         this.emit('error', 'max_price_exceeded');
            //     }

            //     this.emit('message', "Trying to click the CONFIRM button");   

            //     this.evaluate(function() {      
            //         $('#confirm').click();
            //         console.log('Clicking the CONFIRM button');
            //     });
                
            // }]);

            // spooky.then(function(){
            //     this.wait(2000);
            // });

            // spooky.then(function(){
            //     var invalid_details = this.evaluate(function(){
            //         return $('#confirm').length;
            //     });

            //     if (invalid_details === 1)
            //     {
            //         this.emit('error', 'invalid_details');
            //     }    
            // });


            // spooky.then(function(){
            //     this.capture('captures/[Checkout] After clicking the confirm button.png');
            // });

            // spooky.then(function(){
            //     var order_placed = this.evaluate(function(){
            //         if($('.order-invoice').length)
            //         {
            //             return true;
            //         }
            //         else
            //         {
            //             return false; 
            //         }
            //     });        

            //      if(order_placed)
            //      {
            //         var order_id = this.evaluate(function(){

            //             var order_id = $('.order-invoice').text()
            //             return order_id
            //         });

            //         var order_total = this.evaluate(function(){

            //             var order_total = $('.order-total').text().replace("$", "").trim();
            //             order_total = parseFloat(order_total);
            //             order_total *= 100;
            //             return order_total
            //         });

            //         this.emit('success', order_id, order_total, {});
            //      }
            //      else   
            //      {
            //         this.emit('error', 'unknown_error')
            //      }

            // });

                
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