import React from "react";
import Articles from "../components/Articles/Articles";
import AdminDashboard from "../components/Dashboard/AdminDashboard/AdminDashboard";
import UserDashboard from "../components/Dashboard/UserDashboard/UserDashboard";
import ArticleList from "../components/ArticleList/ArticleList";
import Comments from "../components/Dashboard/AdminDashboard/Comments/Comments";
import WriteArticle from "../components/WriteArticle/WriteArticle";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
import About from "../components/About/About";
import Contact from "../components/Contact/Contact";
import ReadMore from "../components/ReadMore/ReadMore";
import Stripe from "../components/Stripe-Payment/Stripe";

const routeList = (data) => {
  const routes = [
    {
      path: "/",
      component: (
        <Articles
          value={data.value}
          article={data.article}
          activePage={data.activePage}
          itemsCountPerPage={data.itemsCountPerPage}
          totalItemsCount={data.totalItemsCount}
          getUserData={data.getUserData}
        />
      ),
    },
    {
      path: "/write-article",
      component: <WriteArticle />,
    },
    {
      path: "/payment",
      component: <Stripe />,
    },
    {
      path: "/article-list",
      component: <ArticleList />,
    },
    {
      path: "/admin-dashboard",
      component: <AdminDashboard />,
    },
    {
      path: "/comments",
      component: <Comments />,
    },
    {
      path: "/user-dashboard",
      component: <UserDashboard />,
    },
    {
      path: "/login",
      component: <Login />,
    },
    {
      path: "/register",
      component: <Register />,
    },
    {
      path: "/about",
      component: <About />,
    },
    {
      path: "/contact",
      component: <Contact />,
    },
    {
      path: "*",
      component: <ReadMore article={data.readMore} />,
    },
  ];

  return routes;
};

export default routeList;
