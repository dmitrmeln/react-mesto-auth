import PopupWithForm from "../PopupWithForm/PopupWithForm";
import {useContext, useEffect} from "react";
import {CurrentUserContext} from "../../contexts/CurrentUserContext";
import {useFormAndValidation} from "../../hooks/useFormAndValidation";

export default function EditProfilePopup(props) {
  const currentUser = useContext(CurrentUserContext);
  const {values, handleChange, errors, isValid, setValues, resetForm} =
    useFormAndValidation();

  useEffect(() => {
    resetForm();
    setValues(currentUser);
  }, [currentUser, props.isOpen]);

  function handleSubmit(evt) {
    evt.preventDefault();

    props.onUpdateUser({
      name: values.name,
      about: values.about,
    });
  }

  return (
    <PopupWithForm
      onClose={props.onClose}
      isOpen={props.isOpen}
      handleSubmit={handleSubmit}
      popupHeading={"Редактировать профиль"}>
      <input
        type="text"
        value={values.name}
        onChange={handleChange}
        className={
          !errors.name ? "popup__input" : "popup__input popup__input_type_error"
        }
        id="popup__name"
        name="name"
        minLength="2"
        maxLength="40"
        required
      />
      <span className="popup__error">{errors.name}</span>
      <input
        type="text"
        value={values.about}
        onChange={handleChange}
        className={
          !errors.about
            ? "popup__input"
            : "popup__input popup__input_type_error"
        }
        id="popup__about"
        name="about"
        minLength="2"
        maxLength="200"
        required
      />
      <span className="popup__error">{errors.about}</span>
      <button
        disabled={!isValid ? true : false}
        type="submit"
        className={
          !errors.about && !errors.name
            ? "popup__button"
            : "popup__button popup__button_disabled"
        }>
        {props.isLoading ? "Сохранение..." : "Сохранить"}
      </button>
    </PopupWithForm>
  );
}
