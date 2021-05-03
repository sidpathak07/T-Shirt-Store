import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { loadCart, cartEmpty } from "./helper/CartHelper";
import { getmeToken, processPayment } from "./helper/paymentB";
import { createOrder } from "./helper/OrderHelper";
import { isAuthenticated } from "../auth/helper";

import DropIn from "braintree-web-drop-in-react";

const PaymentB = ({ products, setReload = (f) => f, reload = undefined }) => {
  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
  });

  const getToken = (userId, token) => {
    getmeToken(userId, token).then((info) => {
      console.log("INFORMATION:", info);
      if (info.error) {
        setInfo({ ...info, error: info.error });
      } else {
        const clientToken = info.clientToken;
        setInfo({ ...info, clientToken: clientToken });
      }
    });
  };

  // const showbtndropIn = () => {
  //   return (
  //     <div>
  //       {info.clientToken !== null && products.length > 0 ? (
  //         <div>
  //           <DropIn
  //             options={{ authorization: info.clientToken }}
  //             onInstance={(instance) => (info.instance = instance)}
  //           />
  //           <button
  //             className="btn btn-outline-success btn-block btn-success text-white"
  //             onClick={onPurchase}
  //           >
  //             Buy
  //           </button>
  //         </div>
  //       ) : (
  //         <h3>Please Login or Add Something To Cart</h3>
  //       )}
  //     </div>
  //   );
  // };

  const showbtdropIn = () => {
    return (
      <div>
        {info.clientToken !== null && products.length > 0 ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={(instance) => (info.instance = instance)}
            />
            <button className="btn btn-block btn-success" onClick={onPurchase}>
              Buy
            </button>
          </div>
        ) : (
          <h3>Please login or add something to cart</h3>
        )}
      </div>
    );
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  // const onPurchase = () => {
  //   setInfo({ loading: true });
  //   let nonce;
  //   console.log(info);
  //   let getNonce = info.instance.requestPaymentMethod().then((data) => {
  //     nonce = data.nonce;
  //     const paymentData = {
  //       paymentMethodNonce: nonce,
  //       amount: getAmount(),
  //     };
  //     processPayment(userId, token, paymentData)
  //       .then((response) => {
  //         setInfo({ ...info, success: response.success, loading: false });
  //         console.log("SUCCESS", response);
  //         //TODO:empty cart
  //         //TODO:order helper
  //         //TODO:force reload
  //       })
  //       .catch((err) => {
  //         setInfo({ success: false, loading: false });
  //       });
  //   });
  // };

  const onPurchase = () => {
    setInfo({ loading: true });
    let nonce;
    let getNonce = info.instance.requestPaymentMethod().then((data) => {
      nonce = data.nonce;
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: getAmount(),
      };
      processPayment(userId, token, paymentData)
        .then((response) => {
          setInfo({ ...info, success: response.success, loading: false });
          // console.log("PAYMENT SUCCESS", response);
          const orderData = {
            products: products,
            transaction_id: response.transaction.id,
            amount: response.transaction.amount,
          };
          createOrder(userId, token, orderData);
          cartEmpty(() => {
            console.log("CART EMPTY");
          });

          setReload(!reload);
        })
        .catch((error) => {
          setInfo({ loading: false, success: false });
          console.log("PAYMENT FAILED");
        });
    });
  };

  const getAmount = () => {
    let amount = 0;
    products.map((p) => {
      amount = amount + p.price;
    });
    return amount;
  };
  return (
    <div>
      <h3 className="text-white">
        Total amount is {getAmount()}
        $
        <br />
        {showbtdropIn()}
      </h3>
    </div>
  );
};

export default PaymentB;
