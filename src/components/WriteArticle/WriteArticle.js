import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
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
import CKEditor from "react-ckeditor-component";
import parse from "html-react-parser";
import modal from "./Modal/OTPSendModal";
import otpVerifyModal from "./Modal/OTPVerifyModal";
import logout from "../LogOut/LogOut";
// this class is used for adding article and also updating the article

const WriteArticle = (props) => {
  // ref to scroll to message
  const inputEl = useRef(null);
  // prefetch and populate article when update article option is clicked
  useEffect(() => {
    if (parseInt(localStorage.getItem("update")) === 1) {
      localStorage.setItem("update", 0);
      let data = {
        id: parseInt(localStorage.getItem("articleId")),
      };
      axios
        .post("/get-article", data, {
          headers: { Authorization: `${localStorage.getItem("api_token")}` },
        })
        .then((response) => {
          if (response.data.code === 401) {
            logout();
            localStorage.clear();
            this.props.history.push("/login");
          } else if (response.data.code === 500) {
            window.alert(response.data.message);
          } else {
            const selectedCategory = response.data.info.category.map(
              (category) => {
                return category.category;
              }
            );
            setValue({
              selectedCategory: selectedCategory,
              title: response.data.info.title,
              author_name: response.data.info.author_name,
            });
            fileSetValue({
              fileLocation: response.data.info.image_name,
            });
            richTextEditorSetValue({
              text: parse(response.data.info.content),
            });
            localStorage.setItem(
              "updateArticleUserId",
              response.data.info.user_id
            );
            localStorage.setItem(
              "updateArticleIsApproved",
              response.data.info.is_approved
            );
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [value, setValue] = useState({
    selectedCategory: [],
    title: "",
    author_name: "",
  });
  const [modalValue, modalSetValue] = useState({
    modalFlag: false,
  });
  const [mobileValue, mobileSetValue] = useState({
    mobile: "",
  });
  const [VerifyValue, VerifySetValue] = useState({
    Verified: false,
  });
  const [otpVerifyValue, otpVerifySetValue] = useState({
    otpFlag: false,
  });
  const [otpValue, otpSetValue] = useState({
    otp: "",
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
  // all the categories
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
  // dropdown handler
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

  // image handler
  const handleChange = (event) => {
    fileSetValue({
      file: event.target.files[0],
      fileLocation: URL.createObjectURL(event.target.files[0]),
      fileArrayLength: event.target.files.length,
      fileName: event.target.files[0].name,
    });
  };

  // title change handler
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

  // frontend validations
  const validations = (value, richTextEditorValue, fileValue = null) => {
    let error = "";
    if (value.selectedCategory.length === 0) {
      error = "Category cannot be null";
    } else if (value.title.length === 0) {
      error = "Title cannot be null";
    } else if (!value.title.match(/^([a-zA-z]+\s)*[a-zA-z]+$/)) {
      error = "Only Letters Allowed in Title";
    } else if (value.author_name.length === 0) {
      error = "Author Name cannot be null";
    } else if (richTextEditorValue.text.length === 0) {
      error = "Content cannot be null";
    } else if (fileValue != null) {
      if (fileValue.fileLocation === "") {
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
    }
    return error;
  };

  // on submit handler
  const onSubmitHandler = (event) => {
    event.preventDefault();
    let error = "";
    if (
      parseInt(localStorage.getItem("update")) === -1 ||
      localStorage.getItem("update") === null
    ) {
      error = validations(value, richTextEditorValue, fileValue);
    } else {
      error = validations(value, richTextEditorValue);
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
        user_id = parseInt(localStorage.getItem("api_token").slice(65));
      }
    }

    let form_data = new FormData();
    let url = "/add-article";
    let headers = {
      headers: { "content-type": "multipart/form-data" },
    };
    if (parseInt(localStorage.getItem("update")) === 0) {
      form_data.append(
        "articleId",
        parseInt(localStorage.getItem("articleId"))
      );
      url = "/update-article";
      headers = {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `${localStorage.getItem("api_token")}`,
        },
      };
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
    if (localStorage.getItem("api_token") !== null) {
      form_data.append(
        "isAdmin",
        localStorage.getItem("api_token").slice(0, 5) === "78357" ? "Yes" : "No"
      );
    }
    axios
      .post(url, form_data, headers)
      .then((response) => {
        if (response.data.code === 200) {
          window.scrollTo(0, inputEl);
          SubmitSetValue({
            isArticleSubmitted: true,
            isError: false,
            msg: response.data.message,
            alertDismiss: true,
          });
        } else {
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
        window.scrollTo(0, inputEl);
        SubmitSetValue({
          isArticleSubmitted: true,
          isError: true,
          msg: error.response.data.message,
          alertDismiss: true,
        });
      });
  };

  const handleClose = () => {
    modalSetValue({
      modalFlag: false,
    });
    otpVerifySetValue({
      otpFlag: false,
    });
  };
  const handleShow = () => {
    modalSetValue({
      modalFlag: true,
    });
  };

  const otpVerifyHandler = () => {
    if (otpValue.otp.length === 0) {
      handleClose();
      window.scrollTo(0, inputEl);
      SubmitSetValue({
        isArticleSubmitted: true,
        isError: true,
        msg: "Invalid mobile number",
        alertDismiss: true,
      });
      return;
    }
    const data = {
      mobile: mobileValue.mobile,
      otp: otpValue.otp,
    };
    axios
      .post("/otp-verify", data)
      .then((response) => {
        if (response.data.code === 200) {
          VerifySetValue({
            Verified: true,
          });
          handleClose();
        } else {
          handleClose();
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
        handleClose();
        window.scrollTo(0, inputEl);
        SubmitSetValue({
          isArticleSubmitted: true,
          isError: true,
          msg: error.response.data.message,
          alertDismiss: true,
        });
      });
  };

  const otpSendHandler = () => {
    if (
      !mobileValue.mobile.match(
        /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
      ) ||
      mobileValue.mobile.length !== 10
    ) {
      handleClose();
      window.scrollTo(0, inputEl);
      SubmitSetValue({
        isArticleSubmitted: true,
        isError: true,
        msg: "Invalid mobile number",
        alertDismiss: true,
      });
      return;
    }
    const data = {
      mobile: mobileValue.mobile,
    };
    axios
      .post("/otp-send", data)
      .then((response) => {
        if (response.data.code === 200) {
          otpVerifySetValue({
            otpFlag: true,
          });
        } else {
          handleClose();
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
        handleClose();
        window.scrollTo(0, inputEl);
        SubmitSetValue({
          isArticleSubmitted: true,
          isError: true,
          msg: error.response.data.message,
          alertDismiss: true,
        });
      });
  };
  const mobileOnChange = (event) => {
    mobileSetValue({
      mobile: event.target.value,
    });
  };
  const otpOnChange = (event) => {
    otpSetValue({
      otp: event.target.value,
    });
  };

  const onChange = (evt) => {
    var newContent = evt.editor.getData();
    richTextEditorSetValue({
      text: newContent,
    });
  };

  const categoryTag = value.selectedCategory.map((tag, id) => {
    return <Category skill={tag} key={id} clicked={categoryDeleteHandler} />;
  });

  const modalComponent = otpVerifyValue.otpFlag
    ? otpVerifyModal(
        modalValue.modalFlag,
        handleClose,
        otpVerifyHandler,
        otpOnChange,
        otpValue.otp
      )
    : modal(
        modalValue.modalFlag,
        handleClose,
        otpSendHandler,
        mobileOnChange,
        mobileValue.mobile
      );

  return (
    <div>
      {modalComponent}
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
            {/* CKEditor  */}
            <CKEditor
              activeClass="p10"
              content={richTextEditorValue.text}
              events={{
                change: onChange,
              }}
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
          <Button
            variant="primary"
            onClick={
              VerifyValue.Verified || localStorage.getItem("api_token") !== null
                ? onSubmitHandler
                : handleShow
            }
          >
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

export default React.memo(withRouter(WriteArticle));
