import React from "react";
import classes from "./Category.module.css";

class Category extends React.Component {
  clickHandler = () => {
    this.props.clicked(this.props.skill);
  };

  render() {
    return (
      <div className={classes.Category}>
        {this.props.skill}
        <i
          className="fa fa-close"
          style={{ marginLeft: "10px", color: "red" }}
          onClick={this.clickHandler}
        ></i>
      </div>
    );
  }
}

export default Category;
