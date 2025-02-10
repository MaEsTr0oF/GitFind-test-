import classes from './header.module.css';

export default function Header() {
  return (
    <header className={classes.header}>
      <div className="header__container container">
        <div className={classes.header__content}>
          <img src="/img/GitHub.png" className={classes.header__logo} alt="React logo" />
          <h1 className={classes.header__title}>
            GitFind repositories
          </h1>
          <a href="https://github.com/MaEsTr0oF">Creator</a>
        </div>
      </div>
    </header>
  );
}
