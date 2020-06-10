import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Button,
  Form,
  Dropdown,
  FormControl,
  Alert,
} from "react-bootstrap";
import classes from "./WriteArticle.module.css";
import Category from "./Category/Categories";
import axios from "axios";

const WriteArticle = (props) => {
  const inputEl = useRef(null);

  useEffect(() => {
    if (parseInt(localStorage.getItem("update")) === 1) {
      localStorage.setItem("update", 0);
      const filteredArticle = props.articles.filter((article) => {
        return article.id === parseInt(localStorage.getItem("articleId"));
      });
      const selectedCategory = filteredArticle[0].category.map((category) => {
        return category.category;
      });
      console.log(selectedCategory);
      setValue({
        selectedCategory: selectedCategory,
        title: filteredArticle[0].title,
        author_name: filteredArticle[0].author_name,
      });
      fileSetValue({
        fileLocation: filteredArticle[0].image_name,
      });
      richTextEditorSetValue({
        text: filteredArticle[0].content,
      });
      localStorage.setItem("updateArticleUserId", filteredArticle[0].user_id);
      localStorage.setItem(
        "updateArticleIsApproved",
        filteredArticle[0].is_approved
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  console.log(richTextEditorValue.text);

  const validations = (value, richTextEditorValue, fileValue) => {
    console.log("not update");
    let error = "";
    if (value.selectedCategory.length === 0) {
      error = "Category cannot be null";
    } else if (value.title.length === 0) {
      error = "Title cannot be null";
    } else if (value.author_name.length === 0) {
      error = "Author Name cannot be null";
    } else if (richTextEditorValue.text.length === 0) {
      error = "Content cannot be null";
    } else if (fileValue.fileLocation === "") {
      error = "Please upload an image";
    } else {
      let Extension = fileValue.fileName
        .substring(fileValue.fileName.lastIndexOf(".") + 1)
        .toLowerCase();

      //The file uploaded is an image

      if (
        Extension !== "gif" &&
        Extension !== "png" &&
        Extension !== "jpeg" &&
        Extension !== "jpg"
      ) {
        error = "Image of type gif,png,jpeg and jpg allowed";
      }
    }

    return error;
  };

  const validationsUpdate = (value, richTextEditorValue) => {
    console.log("update");
    let error = "";
    if (value.selectedCategory.length === 0) {
      error = "Category cannot be null";
    } else if (value.title.length === 0) {
      error = "Title cannot be null";
    } else if (value.author_name.length === 0) {
      error = "Author Name cannot be null";
    } else if (richTextEditorValue.text.length === 0) {
      error = "Content cannot be null";
    }
    return error;
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    let error = "";
    if (
      parseInt(localStorage.getItem("update")) === -1 ||
      localStorage.getItem("update") === null
    ) {
      error = validations(value, richTextEditorValue, fileValue);
    } else {
      error = validationsUpdate(value, richTextEditorValue);
    }

    if (error !== "") {
      window.scrollTo(0, inputEl);
      SubmitSetValue({
        isArticleSubmitted: true,
        isError: true,
        msg: error,
        alertDismiss: true,
      });
      return;
    }
    let is_approved = "";
    let user_id = -100;
    if (parseInt(localStorage.getItem("update")) === 0) {
      is_approved = localStorage.getItem("updateArticleIsApproved");
      user_id =
        localStorage.getItem("updateArticleUserId") === null
          ? -100
          : parseInt(localStorage.getItem("updateArticleUserId"));
    } else {
      if (localStorage.getItem("api_token") === null) {
        is_approved = "No";
      } else {
        is_approved = "Yes";
        user_id = localStorage.getItem("user_id");
      }
    }

    let form_data = new FormData();
    let url = "http://127.0.0.1:8000/api/add-article";
    if (parseInt(localStorage.getItem("update")) === 0) {
      form_data.append(
        "articleId",
        parseInt(localStorage.getItem("articleId"))
      );
      url = "http://127.0.0.1:8000/api/update-article";
    }
    if (fileValue.file !== undefined) {
      form_data.append("image", fileValue.file);
    }
    form_data.append("selectedCategory", value.selectedCategory);
    form_data.append("title", value.title);
    form_data.append("authorName", value.author_name);
    form_data.append("content", richTextEditorValue.text);
    form_data.append("isApproved", is_approved);
    form_data.append("userId", user_id);
    // form_data.append("isAdmin", "Yes");
    if (localStorage.getItem("is_admin") !== null) {
      form_data.append("isAdmin", localStorage.getItem("is_admin"));
    }

    axios
      .post(url, form_data, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.code === 200) {
          window.scrollTo(0, inputEl);
          SubmitSetValue({
            isArticleSubmitted: true,
            isError: false,
            msg: response.data.message,
            alertDismiss: true,
          });
        } else if (response.data.code === 201) {
          window.scrollTo(0, inputEl);
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

  const richTextChange = (event) => {
    richTextEditorSetValue({
      text: event.target.value,
    });
  };

  const categoryTag = value.selectedCategory.map((tag, id) => {
    return <Category skill={tag} key={id} clicked={categoryDeleteHandler} />;
  });

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
            ref={inputEl}
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
            ref={inputEl}
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
              defaultValue={value.title}
            />
          </Form.Group>

          <Form.Group controlId="formBasicContent">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows="3"
              onChange={richTextChange}
              defaultValue={richTextEditorValue.text}
            />
          </Form.Group>

          <Form.Group controlId="formBasicAuthorName">
            <Form.Label>Author Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Author Name"
              onBlur={authorNameChangeHandler}
              defaultValue={value.author_name}
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
