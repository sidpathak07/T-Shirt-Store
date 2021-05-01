import React, { useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import { createCategory } from "./helper/adminapicall";

const AddCategory = ({ history }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user, token } = isAuthenticated();

  const myCategoryForm = () => (
    <form>
      <div className="form-group">
        <p className="lead">Enter The Category</p>
        <input
          type="text"
          onChange={handleChange}
          value={name}
          autoFocus
          required
          placeholder="For Ex. Summer"
          className="form-control my-3"
        />
        <button onClick={onSubmit} className="btn btn-outline-info mb-2">
          Create Category
        </button>
      </div>
    </form>
  );

  const goBack = () => {
    return (
      <div className="mt-5">
        <Link className="btn btn-sm btn-success mb-3" to="/admin/dashboard">
          Admin Home
        </Link>
      </div>
    );
  };

  const handleChange = (e) => {
    setError("");
    setSuccess("");
    setName(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    createCategory(user._id, token, { name }).then((data) => {
      if (data.error) {
        setError(true);
      } else {
        setSuccess(true);
        setError("");
        setName("");
      }
    });
  };

  const successMessage = () => {
    if (success) {
      return <h4 className="text-success">Category Created Successfully</h4>;
    }
    setTimeout(() => {
      setSuccess("");
    }, 50000);
  };

  const errorMessage = () => {
    if (error) {
      return <h4 className="text-danger">Failed to create category</h4>;
    }
    setTimeout(() => {
      setSuccess("");
    }, 50000);
  };
  return (
    <Base
      title="Create a new Category here"
      description="Add a new category for new t-shirts"
      className="container bg-info p-4"
    >
      <div className="row bg-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {errorMessage()}
          {myCategoryForm()}
          {goBack()}
        </div>
      </div>
    </Base>
  );
};

export default AddCategory;
