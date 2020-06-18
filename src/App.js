import React, { useState, useEffect } from "react";

import api from "./services/api";
import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    try {
      api.get("/repositories").then((response) => {
        setRepositories(response.data);
      }).catch((e) => {
        alert(`Can't list repositories. Cause: ${e.message}`);
      });
    } catch (e) {
      alert(`Can't list repositories. Cause: ${e.message}`);
    }
  }, []);

  async function handleAddRepository(event) {
    event.preventDefault();
    try {
      const title = document.getElementById("repo_title").value;
      const url = document.getElementById("repo_url").value;
      const techs = String(document.getElementById("repo_techs").value).split(",").filter((tech) => tech.trim() === "" ? false : true);
      
      // if (!title || !url || techs.length <= 0) {
      //   alert("Preencha o tittulo, url e as tecnologias!");
      //   return;
      // }

      const response = await api.post("/repositories", {
        title, url, techs
      });
      setRepositories([...repositories, response.data]);
    } catch (e) {
      alert(`Can't add this repo. Cause: ${e.message}`);
    }
  }

  async function handleRemoveRepository(id) {
    try {
      await api.delete(`/repositories/${id}`);
      setRepositories(
        repositories.filter((repo) => repo.id !== id)
      );
    } catch (e) {
      alert(`Can't remove this repo. Cause: ${e.message}`)
    }
  }

  async function handleLikeRepository(id) {
    try {
      const repository = repositories.find((repo) => repo.id === id);
      if (repository) {
        const response = await api.post(`/repositories/${id}/like`);
        setRepositories(
          repositories.map((repo) => repo.id === id ? response.data : repo )
        );
      }
    } catch (e) {
      alert(`Cant like this repo. Cause: ${e.message}`);
    }
  }
  return (
    <div >
      <ul data-testid="repository-list">
        {repositories.map((repo) => (
          <li key={repo.id}>            
            <a href={repo.url}>{repo.title}</a>
            <span>Tecnologias: {repo.techs.join()}</span>
            <button onClick={() => {handleLikeRepository(repo.id)}}>{repo.likes} Likes</button>
            <button onClick={() => handleRemoveRepository(repo.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>
      <br/>
      <br/>
      <form>
        <label htmlFor="repo_title">Nome do repositório: </label>
        <input type="text" name="repo_title" id="repo_title"/>
        <br/>
        <br/>
        <label htmlFor="repo_url">URL do repositório: </label>
        <input type="text" name="repo_url" id="repo_url"/>
        <br/>
        <br/>
        <label htmlFor="repo_techs">Tecnologias do repositório (separadas por vírgula): </label>
        <input type="text" name="repo_techs" id="repo_techs"/>
      </form>
      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
