import {useState} from "react";
import {Link} from "react-router-dom";

export default function Register(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailChange(evt) {
    setEmail(evt.target.value);
  }

  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    props
      .onRegister({
        email,
        password,
      })
      .then(() => {
        setEmail("");
        setPassword("");
      });
  }

  return (
    <div className={"authorize"}>
      <form
        className="authorize__form"
        name="register-form"
        onSubmit={handleSubmit}>
        <h2 className="authorize__heading">Регистрация</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          className="authorize__input"
          id="authorize__email"
          name="email"
          minLength="2"
          maxLength="40"
          required
        />
        <span className="authorize__error authorize__email-error"></span>
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={handlePasswordChange}
          className="authorize__input"
          id="authorize__password"
          name="password"
          minLength="3"
          maxLength="16"
          required
        />
        <span className="authorize__error authorize__password-error"></span>
        <button type="submit" className="authorize__button">
          Зарегистрироваться
        </button>
        <Link className="authorize__login-link" to="/sign-in">
          Уже зарегистрированы? Войти
        </Link>
      </form>
    </div>
  );
}
