export default function PopupWithForm(props) {
  return (
    <div>
      <div
        onMouseDown={props.onClose}
        className={`popup ${props.isOpen ? "popup_opened" : ""}`}>
        <div className="popup__container">
          <button type="button" className="popup__close-button"></button>
          <form
            className="popup__form"
            name="edit-form"
            onSubmit={props.handleSubmit}
            noValidate>
            <h2 className="popup__heading">{props.popupHeading}</h2>
            {props.children}
          </form>
        </div>
      </div>
    </div>
  );
}
