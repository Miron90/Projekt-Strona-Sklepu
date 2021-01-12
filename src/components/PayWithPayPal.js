import React, { useState, useEffect, useRef } from 'react'
import { ListGroup, ListGroupItem } from 'reactstrap'
import { Button } from "semantic-ui-react";
import deletePayment from "../paid/deleteAfterPayment"

function PayWithPayPal(props) {
    const { items, productName, total, e, quantity } = props
    const [paidFor, setPaidFor] = useState(false);
    const [error, setError] = useState(null);
    const paypalRef = useRef();
    useEffect(() => {
        window.paypal
            .Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            description: 'Laptop store checkout',
                            amount: {
                                currency_code: 'PLN',
                                value: total,
                            }
                        }]
                    });
                },
                onApprove: async (data, actions) => {
                    const order = await actions.order.capture();
                    setPaidFor(true);
                    deletePayment(productName, quantity)
                    console.log('ORDER', order);
                },
                onError: err => {
                    setError(err);
                    console.error('ERROR', err);
                },
            })
            .render(paypalRef.current);
    }, [items]);

    if (paidFor) {

        setTimeout(() => {
            e.rerenderParentCallback()
        }, 2000);
        return (
            <div>
                Thanks for making the purchase.
            </div>

        )
        paidFor = false;
    }
    if (error) {

        setTimeout(() => {
            e.rerenderParentCallback()
        }, 2000);
        return (
            <div>
                Error in processing order. Please Retry again
            </div>
        )
    }

    return (
        <div>
            {/* <ListGroup>
                {items.map((item, index) =>
                    <ListGroupItem key={item.name + item.value}>
                        {item.name} - Rs. {item.value}
                    </ListGroupItem>)}
            </ListGroup> */}
            <div>Total - PLN. {total}</div>
            <div ref={paypalRef} />
            <Button onClick={e.rerenderParentCallback}>Cancel</Button>
        </div>
    )
}

export default PayWithPayPal