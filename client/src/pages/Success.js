import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import Jumbotron from '../components/Jumbotron';
import { ADD_ORDER } from '../utils/mutations';
import { idbPromise } from '../utils/helpers';

function Success() {
    const [addOrder] = useMutation(ADD_ORDER);

    // // params for the addOrder function that gets called here
    // let seller = window.localStorage.getItem("storeObjectId");

    useEffect(() => {
        async function saveOrder() {
            const cart = await idbPromise('cart', 'get');
            const sellerName = JSON.parse(localStorage.getItem("storeObjectId"));
            // const products = cart.map((item) => item._id); //same as cart
            var products = [];
            var quantity = [];
            for (var i = 0; i < cart.length; i++) {
                console.log(cart[i]._id, cart[i].purchaseQuantity)
                products.push(cart[i]._id)
                quantity.push(cart[i].purchaseQuantity)

            }
            // const products1 = cart.map((item) => item.purchaseQuantity);
            // const productsId = products.map((object) => object);
            // const productsQuant = products.map((object) => object[1]);

            // for (const [key, value] of item)

            console.log(cart);
            console.log(products)
            console.log(quantity)
            // purchaseQuantity
            if (cart.length) {
                // const { data } = { variables: { products, quantity, sellerName } }
                const { data } = await addOrder({ variables: { products, quantity, sellerName } });
                // const { data } = await addOrder({ variables: { products, sellerName } });
                const productData = data.addOrder.products;
                const sellerData = data.addOrder.sellerName;
                console.log(data)
                console.log(productData)
                productData.forEach((item) => {
                    idbPromise('cart', 'delete', item);
                });
                sellerData.forEach((item) => {
                    idbPromise('cart', 'delete', item);
                });
            }

            // setTimeout(() => {
            //     window.location.assign('/');
            //     localStorage.clear();
            //     console.log("Delayed by example 1000 = 1 second")
            // }, 10000000);
        }

        saveOrder();
    }, [addOrder]);

    return (
        <div>

            <Jumbotron>
                <h1>Success!</h1>
                <h2>Thank you for your purchase!</h2>
                <h2>You will now be redirected to the home page</h2>
            </Jumbotron>
        </div>
    );
}

export default Success;

// TO DO: Clear local storage when it redirects in case a user wants to buy from multiple stores