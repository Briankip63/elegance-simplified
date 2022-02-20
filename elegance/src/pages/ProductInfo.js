import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getDoc, doc } from "firebase/firestore";
import fireDB from "../fireConfig";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function ProductInfo() {
  const [product, setProduct] = useState([]);
  const { cartItems } = useSelector((state) => state.cartReducer);

  const dispatch = useDispatch();

  const params = useParams();

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const productTemp = await getDoc(
        doc(fireDB, "products", params.productid)
      );

      setProduct(productTemp.data());
    } catch (error) {
      console.log(error);
    }
  }

  const addToCart = (product) => {
    dispatch({ type: "ADD-TO-CART", payload: product });
  };
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Layout>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            {product && (
              <div>
                <p>
                  <b>{product.name}</b>
                </p>
                <div>
                  <img
                    src={product.imageURL}
                    className="product-info-img"
                    alt=""
                  />
                  <hr />
                  <p>{product.description}</p>
                  <div className="d-flex justify-content-end my-3">
                    <button onClick={()=>addToCart(product)}>ADD TO CART</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductInfo;
