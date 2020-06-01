import React, { useState } from "react";
import {
  Container,
  Button,
  Form,
  Dropdown,
  FormControl,
  Alert,
} from "react-bootstrap";
import classes from "./WriteArticle.module.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Category from "./Category/Categories";
import { Redirect } from "react-router-dom";
import axios from "axios";

const WriteArticle = (props) => {
  const [value, setValue] = useState({
    selectedCategory: [],
    title: "",
    author_name: "",
  });
  const [fileValue, fileSetValue] = useState({
    fileLocation: "",
    file: null,
    fileArrayLength: 0,
    fileName: "",
  });
  const [richTextEditorValue, richTextEditorSetValue] = useState({
    text: "",
  });
  const [SubmitValue, SubmitSetValue] = useState({
    isArticleSubmitted: false,
    isError: false,
    msg: "",
    alertDismiss: true,
  });
  const categories = [
    "Entertainment",
    "Family Life",
    "Hobbies and Crafts",
    "Pets and Animals",
    "Travel",
    "Cars & Other Vehicles",
    "Finance and Business",
    "Holidays and Traditions",
    "Philosophy and Religion",
    "Work World",
    "Technology",
    "Food and Entertaining",
    "Home and Garden",
    "Relationships",
    "Education and Communications",
    "Health",
    "Personal Care and Style",
    "Sports and Fitness",
  ];
  const dropdownClickHandler = (event) => {
    let arr = [...value.selectedCategory, event];
    arr = [...new Set(arr)];
    setValue({
      selectedCategory: arr,
      title: value.title,
      author_name: value.author_name,
    });
  };
  const dropdownCategory = categories.map((category, id) => {
    return (
      <Dropdown.Item key={id} eventKey={category}>
        {category}
      </Dropdown.Item>
    );
  });

  const handleChange = (event) => {
    fileSetValue({
      file: event.target.files[0],
      fileLocation: URL.createObjectURL(event.target.files[0]),
      fileArrayLength: event.target.files.length,
      fileName: event.target.files[0].name,
    });
  };

  const titleChangeHandler = (event) => {
    event.persist();
    setValue((prevState) => {
      return {
        selectedCategory: value.selectedCategory,
        title: event.target.value,
        author_name: value.author_name,
      };
    });
  };

  const authorNameChangeHandler = (event) => {
    let data = event.target.value;
    setValue({
      selectedCategory: value.selectedCategory,
      title: value.title,
      author_name: data,
    });
  };

  const categoryDeleteHandler = (skill) => {
    const array = [...value.selectedCategory];
    const index = array.indexOf(skill);
    if (index > -1) {
      array.splice(index, 1);
    }
    setValue({
      selectedCategory: array,
      title: value.title,
      author_name: value.author_name,
    });
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    let is_approved = "";
    let user_id = -100;
    if (localStorage.getItem("api_token") === null) {
      is_approved = "No";
    } else {
      is_approved = "Yes";
      user_id = localStorage.getItem("user_id");
    }

    let form_data = new FormData();
    form_data.append("image", fileValue.file);
    form_data.append("selectedCategory", value.selectedCategory);
    form_data.append("title", value.title);
    form_data.append("authorName", value.author_name);
    form_data.append("content", richTextEditorValue.text);
    form_data.append("isApproved", is_approved);
    form_data.append("userId", user_id);

    axios
      .post("http://127.0.0.1:8000/api/add-article", form_data, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.code === 200) {
          SubmitSetValue({
            isArticleSubmitted: true,
            isError: false,
            msg: response.data.message,
            alertDismiss: true,
          });
        } else if (response.data.code === 201) {
          SubmitSetValue({
            isArticleSubmitted: true,
            isError: true,
            msg: response.data.message,
            alertDismiss: true,
          });
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const categoryTag = value.selectedCategory.map((tag, id) => {
    return <Category skill={tag} key={id} clicked={categoryDeleteHandler} />;
  });

  if (
    localStorage.getItem("api_token") !== null &&
    localStorage.getItem("is_admin") === "Yes"
  ) {
    return <Redirect to="/admin-dashboard" />;
  }

  return (
    <div>
      {SubmitValue.isArticleSubmitted && SubmitValue.alertDismiss ? (
        SubmitValue.isError ? (
          <Alert
            variant="danger"
            onClose={() =>
              SubmitSetValue({
                isArticleSubmitted: SubmitValue.isArticleSubmitted,
                isError: SubmitValue.isError,
                msg: SubmitValue.msg,
                alertDismiss: false,
              })
            }
            dismissible
            className={classes.Style}
          >
            {SubmitValue.msg}
          </Alert>
        ) : (
          <Alert
            variant="success"
            onClose={() =>
              SubmitSetValue({
                isArticleSubmitted: SubmitValue.isArticleSubmitted,
                isError: SubmitValue.isError,
                msg: SubmitValue.msg,
                alertDismiss: false,
              })
            }
            dismissible
            className={classes.Style}
          >
            {SubmitValue.msg}
          </Alert>
        )
      ) : null}
      <Container className={classes.WriteArticle}>
        <h5>Write an amazing article</h5>
        <hr />
        <Form>
          <Form.Group controlId="formBasicCategory">
            <Dropdown role="menuitemradio" onSelect={dropdownClickHandler}>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                Category
              </Dropdown.Toggle>

              <Dropdown.Menu>{dropdownCategory}</Dropdown.Menu>
            </Dropdown>
            <br />
            <Form.Label>Selected Categories</Form.Label>
            <Container className={classes.WriteArticleCategory}>
              {categoryTag}
            </Container>
          </Form.Group>
          <Form.Group controlId="formBasicTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Title"
              onBlur={titleChangeHandler}
            />
          </Form.Group>

          <Form.Group controlId="formBasicContent">
            <Form.Label>Content</Form.Label>
            <ReactQuill
              theme="snow"
              defaultValue={richTextEditorValue.text}
              onChange={(content, delta, source, editor) =>
                richTextEditorSetValue({ text: editor.getText(content) })
              }
            />
          </Form.Group>

          <Form.Group controlId="formBasicAuthorName">
            <Form.Label>Author Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Author Name"
              onBlur={authorNameChangeHandler}
            />
          </Form.Group>
          <Form.Group controlId="formBasicImageUpload">
            <label className={classes.Label}>
              Image Upload
              <FormControl
                type="file"
                accept="image/*"
                className={classes.FileUpload}
                onChange={handleChange}
              />
            </label>
            {fileValue.fileArrayLength !== 0 ? (
              <img
                src={fileValue.fileLocation}
                height="150"
                width="150"
                className={classes.Image}
                alt=""
              />
            ) : null}
          </Form.Group>
          <Button variant="primary" type="submit" onClick={onSubmitHandler}>
            Submit
          </Button>
          <hr />
          <div className={classes.WriteArticleStyle}>
            *Please note that all submissions are passed through a review
            process by our team
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default React.memo(WriteArticle);
