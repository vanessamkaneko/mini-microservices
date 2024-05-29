/* eslint-disable import/no-anonymous-default-export */
import React, { useState } from "react";
import axios from "axios";

export default () => {
  const [title, setTitle] = useState('');
  // nome da variável, setNomeDaVariável = useState (setar um estado; que no caso é setado como string vazia)

  const onSubmit = async (event) => {
    event.preventDefault();

    await axios.post('http://posts.com/posts/create', {
      title
    });

    setTitle(''); // ao final do envio, o title retorna a string vazia
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            // a cada atualização, ou seja, a cada letra digitada no input, o setTitle é chamado e o valor é atualizado
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};
