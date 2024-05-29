/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

export default () => {
  const [posts, setPosts] = useState({});

  const fetchPosts = async () => {
    const res = await axios.get("http://posts.com/posts");

    setPosts(res.data); /*setPosts será atualizado com a info contida na variável res (no caso, qndo algum novo title for inserido) -> ao posts, são atribuídos os dados
    contidos na rota especificada*/
  };

  /*useEffect pode ser usado p/ rodar um código em pontos específicos no tempo de vida de um componente -> neste caso, queremos que o fetchPosts rode apenas qndo o componente for
  exibido pela 1ª vez na tela  */
  useEffect(() => {
    fetchPosts();
  }, []); /*o array vazio dirá ao react p/ rodar essa função apenas 1x (pois não há dependência a ser executada) | dependência -> useEffect fica "na escuta" p/ qndo houver alterações, 
  a dependência ser executada (se tivesse o posts no lugar do [], por ex.) cuidado c/ loops infinitos! */

  const renderedPosts = Object.values(posts).map((post) => {
    return (
      <div
        className="card"
        style={{ width: "30%", marginBottom: "20px" }}
        key={post.id}
      >

        <div className="card-body">
          <h3>{post.title}</h3>
          <CommentList comments={post.comments} />
          <CommentCreate postId={post.id} />
        </div>
      </div>
    );
  }); // Object.values retornará um array com todos os valores de posts (inclusive id) | map -> percorre os valores do array e p/ cada valor é retornado o valor + a estilização

  return <div className="d-flex flex-row flex-wrap justify-content-between">
    {renderedPosts}
  </div>;
};
