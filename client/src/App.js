import React from "react";
import PostCreate from "./PostCreate";
import PostList from "./PostList";

const App = () => {
  return (
    <div className="container">
      <h1>Create Post!!!!!!</h1>
      <PostCreate />
      <hr />
      <h1>Posts</h1>
      <PostList />
    </div>
  );
};

export default App;


/* Axios é uma biblioteca cliente HTTP baseada em promessas que funciona tanto no navegador quanto em node.js. 
É comumente usada para realizar requisições HTTP para se comunicar com APIs externas */