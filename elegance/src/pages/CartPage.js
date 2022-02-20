import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import { Modal } from "react-bootstrap";
import { addDoc, collection } from "firebase/firestore";
import fireDB from "../fireConfig";
import { toast } from "react-toastify";

function CartPage() {
  const { cartItems } = useSelector((state) => state.cartReducer);
  const [totalAmount, setTotalAmount] = useState(0);
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((cartItems) => {
      temp = temp + cartItems.price;
    });
    setTotalAmount(temp);
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const deleteFromCart = (product) => {
    dispatch({ type: "DELETE-FROM-CART", payload: product });
  };

  const placeOrder = async () => {
    const addressInfo = {
      name,
      phoneNumber,
      address,
    };
    console.log(addressInfo);

    const orderInfo = {
      cartItems,
      addressInfo,
    };

    try {
      setLoading(true);
      const result = await addDoc(collection(fireDB, "orders"), orderInfo);
      setLoading(false);
      toast.success("Order placed successfully");
      handleClose()
    } catch (error) {
      setLoading(false);
      toast.error("Order failed!");
    }
  };

  return (
    <Layout loading={loading}>
      <table className="table mt-2">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => {
            return (
              <tr>
                <td>
                  <img src={item.imageURL} height="80" width="80" />
                </td>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>
                  <FaTrash onClick={() => deleteFromCart(item)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="d-flex justify-content-end">
        <h1 className="total-amount">Total Amount = ksh. {totalAmount}</h1>
      </div>
      <div className="d-flex justify-content-end mt-3">
        <button onClick={handleShow}>PLACE ORDER</button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Your Contact Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="register-form">
            <h2>Contacts</h2>
            <hr />
            <input
              type="text"
              className="form-control"
              placeholder="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />

            <input
              type="number"
              className="form-control"
              placeholder="phone number"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
            />

            <textarea
              type="text"
              className="form-control"
              rows={3}
              placeholder="address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />

            <hr />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={handleClose}>Close</button>
          <button onClick={placeOrder}>ORDER</button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default CartPage;
