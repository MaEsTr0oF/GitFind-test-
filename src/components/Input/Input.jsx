import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";

export default function Input() {
  const perPage = 20;

  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState("");

  async function fetchUserRepos(username, page = 1) {
    const url = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Ошибка при получении репозиториев:", error);
      throw error;
    }
  }

  const debouncedSearch = useCallback(
    debounce((value) => {
      if (value === "") return;
      setLoading(true);
      fetchUserRepos(value, 1)
        .then((data) => {
          setRepos(data);
          setPage(1);
          setHasMore(data.length === perPage);
          setError("");
        })
        .catch((error) => {
          setError(error.message);
          setRepos([]);
          setHasMore(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 500),
    []
  );

  const handleInputChange = (event) => {
    const value = event.target.value.trim();
    setUsername(value);
    setRepos([]);
    setPage(1);
    setError("");
    debouncedSearch(value);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        setLoading(true);
        fetchUserRepos(username, page + 1)
          .then((data) => {
            if (data.length > 0) {
              setRepos((prevRepos) => [...prevRepos, ...data]);
              setPage((prevPage) => prevPage + 1);
              setHasMore(data.length === perPage);
            } else {
              setHasMore(false);
            }
          })
          .catch((error) => {
            setError(error.message);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [username, page, loading, hasMore]);

  return (
    <>
      <section className="findProject">
        <div className="findProject__container container">
          <div className="findProject__content">
            <div className="findProject__input"style={{width: "60vw",fontSize:"1.5rem",margin:"2rem auto 1rem auto"}}>
              <input
                onChange={handleInputChange}
                type="text"
                placeholder="Введите имя пользователя"
					 style={{width:"60vw",height:"40px"}}
              />
            </div>
          </div>
        </div>
      </section>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Загрузка...</p>}

      <section className="reposList">
			<div className="container">
				<div className="reposList__content" style={{}}>
        {repos.map((repo) => (
          <div key={repo.id} className="repoCard" style={{backgroundColor:"grey",border:"1px solid black",padding:"1rem"}}>
            <h3>
              {repo.name} <span>⭐ {repo.stargazers_count}</span>
            </h3>
            <p>{repo.description || "Нет описания"}</p>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              Перейти к репозиторию
            </a>
            <p>
              Обновлено: {new Date(repo.updated_at).toLocaleDateString()}
            </p>
          </div>
        ))}
		  </div>
		  </div>
      </section>
    </>
  );
}
