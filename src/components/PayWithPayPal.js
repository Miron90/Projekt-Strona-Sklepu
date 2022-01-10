import React, { useState, useEffect, useRef } from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import { Button } from "semantic-ui-react";
import { deletePayment } from "../paid/deleteBasket";

function PayWithPayPal(props) {
  const { items, products, total, e, token } = props;
  const [paidFor, setPaidFor] = useState(false);
  const [error, setError] = useState(null);
  const paypalRef = useRef();
  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: "Laptop store checkout",
                amount: {
                  currency_code: "PLN",
                  value: total,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          setPaidFor(true);
          deletePayment(products, token);
          console.log("ORDER", order);
        },
        onError: (err) => {
          setError(err);
          console.error("ERROR", err);
        },
      })
      .render(paypalRef.current);
  }, [items]);

  if (paidFor) {
    setTimeout(() => {
      e.rerenderParentCallback();
    }, 2000);
    return <div>Dziękujemy za zakupy</div>;
    paidFor = false;
  }
  if (error) {
    setTimeout(() => {
      e.rerenderParentCallback();
    }, 2000);
    return <div>Wystąpił błąd spróbuj ponownie później</div>;
  }

  return (
    <div>
      <div ref={paypalRef} />
    </div>
  );
}

export default PayWithPayPal;
