import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { collection, addDoc, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import fireDB from "../fireConfig";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    imageURL: "",
    category: "",
  });

  const [show, setShow] = useState(false);
  const [add, setAdd] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      setLoading(true);
      const users = await getDocs(collection(fireDB, "products"));
      const productsArray = [];

      users.forEach((doc) => {
        const obj = {
          id: doc.id,
          ...doc.data(),
        };

        productsArray.push(obj);
        setLoading(false);
      });
      setProducts(productsArray);
    } catch (error) {
      console.log(error);
    }
  }

  const editHandler = (item) => {
    setProduct(item);

    setShow(true);
  };

  const updateProduct = async () => {
    try {
      setLoading(true);
      await setDoc(doc(fireDB, "products", product.id), product);
      getData();
      handleClose();
      toast.success("Product updated successfully!");
    } catch (error) {
      toast.error("Product update failed!");
      setLoading(false);
    }
  };

  const addProduct = async () => {
    try {
      setLoading(true);
      await addDoc(collection(fireDB, "products"), product);
      getData();
      handleClose();
      toast.success("Product added successfully!");
    } catch (error) {
      toast.error("Product addition failed!");
      setLoading(false);
    }
  };

  const addHandler = () => {
    setAdd(true);
    handleShow();
  };

  const deleteProduct= async (item) =>{
      try {
          setLoading(true)
          await deleteDoc(doc(fireDB, "products", item.id))
          toast.success("Product deleted successfully")
          getData()
      } catch (error) {
          toast.error("Product delete failed!")
          setLoading(false)
      }

  }

  return (
    <Layout loading={loading}>
      <div className="d-flex justify-content-between">
        <h3>Produts List</h3>
        <button onClick={addHandler}>Add Product</button>
      </div>
      <table className="table mt-2">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>category</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => {
            return (
              <tr>
                <td>
                  <img src={item.imageURL} height="80" width="80" />
                </td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.price}</td>
                <td>
                  <FaTrash
                    color="red"
                    size={20}
                    onClick={() => {
                      deleteProduct(item);
                    }}
                  />
                  <FaEdit
                    onClick={() => editHandler(item)}
                    color="blue"
                    size={20}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {add === true ? "Add a product" : "Update Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="register-form">
            <hr />
            <input
              type="text"
              className="form-control"
              placeholder="name"
              value={product.name}
              onChange={(e) => {
                setProduct({ ...product, name: e.target.value });
              }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="image url"
              value={product.imageURL}
              onChange={(e) => {
                setProduct({ ...product, imageURL: e.target.value });
              }}
            />

            <input
              type="number"
              className="form-control"
              placeholder="price"
              value={product.price}
              onChange={(e) => {
                setProduct({ ...product, price: e.target.value });
              }}
            />

            <input
              type="text"
              className="form-control"
              placeholder="category"
              value={product.category}
              onChange={(e) => {
                setProduct({ ...product, category: e.target.value });
              }}
            />

            <hr />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={handleClose}>Close</button>
          {add ? (
            <button onClick={addProduct}>SAVE</button>
          ) : (
            <button onClick={updateProduct}>SAVE</button>
          )}
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default AdminPage;
