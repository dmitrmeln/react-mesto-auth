import Header from "./Header/Header";
import Main from "./Main/Main";
import Footer from "./Footer/Footer";
import ImagePopup from "./ImagePopup/ImagePopup";
import {api} from "../utils/api";
import EditProfilePopup from "./EditProfilePopup/EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup/EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup/AddPlacePopup";
import ConfirmationPopup from "./ConfirmationPopup/ConfirmationPopup";
import InfoTooltip from "./InfoTooltip/InfoTooltip";
import {useEffect, useState} from "react";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import FormValidator from "../utils/FormValidator";
import {validationConfig} from "../utils/constants";
import Register from "./Register/Register";
import Login from "./Login/Login";
import * as mestoAuth from "../utils/mestoAuth";
import {Routes, Route, Navigate, useNavigate} from "react-router-dom";
import ProtectedRouteElement from "./ProtectedRout/ProtectedRout";

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupState] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupState] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupState] = useState(false);
  const [isConfirmationPopupOpen, setConfirmationPopupState] = useState(false);
  const [isInfoTooltipOpen, setInfoTooltipState] = useState(false);
  const [authorizeState, setAuthorizeState] = useState(false);
  const [isImagePopupOpen, setImagePopupState] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({name: "", about: ""});
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loggedIn, setloggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  function auth(jwt) {
    if (jwt) {
      mestoAuth.tokenCheck(jwt).then((res) => {
        if (res) {
          setUserEmail(res.data.email);
          setloggedIn(true);
          navigate("/");
        } else {
          setloggedIn(false);
        }
      });
    }
  }

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    auth(jwt);
  }, []);

  useEffect(() => {
    api
      .getUserInfo()
      .then((result) => {
        setCurrentUser(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    api
      .getCardList()
      .then((result) => {
        setCards(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    function handleEscClose(evt) {
      if (evt.key === "Escape") {
        changeAllPopupsState();
      }
    }

    if (
      [
        isEditProfilePopupOpen,
        isAddPlacePopupOpen,
        isEditAvatarPopupOpen,
        isConfirmationPopupOpen,
        isImagePopupOpen,
        isInfoTooltipOpen,
      ].some((state) => {
        return state === true;
      })
    ) {
      document.addEventListener("keydown", handleEscClose);
    }

    return () => {
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [
    isEditProfilePopupOpen,
    isAddPlacePopupOpen,
    isEditAvatarPopupOpen,
    isConfirmationPopupOpen,
    isImagePopupOpen,
    isInfoTooltipOpen,
  ]);

  function changeAllPopupsState() {
    setEditAvatarPopupState(false);
    setAddPlacePopupState(false);
    setEditProfilePopupState(false);
    setImagePopupState(false);
    setConfirmationPopupState(false);
    setInfoTooltipState(false);
  }

  function closeAllPopups(evt) {
    if (evt.target.classList.contains("popup__close-button")) {
      changeAllPopupsState();
    }

    if (evt.target.classList.contains("popup_opened")) {
      changeAllPopupsState();
    }
  }

  function handleEditAvatarClick() {
    formValidators["avatar-form"].resetValidation();
    formValidators["avatar-form"].clearForm();
    setEditAvatarPopupState(true);
  }

  function handleEditProfileClick() {
    formValidators["edit-form"].resetValidation();
    setEditProfilePopupState(true);
  }

  function handleAddPlaceClick() {
    formValidators["add-form"].resetValidation();
    setAddPlacePopupState(true);
  }

  function handleCardClick(card) {
    setSelectedCard({
      id: card._id,
      src: card.link,
      title: card.name,
    });
    setImagePopupState(true);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleUpdateUser(data) {
    setIsLoading(true);
    api
      .setUserInfo(data)
      .then((result) => {
        setCurrentUser(result);
        changeAllPopupsState();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateAvatar(data) {
    setIsLoading(true);
    api
      .setUserAvatar(data)
      .then((result) => {
        setCurrentUser(result);
        changeAllPopupsState();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleAddPlaceSubmit(data) {
    setIsLoading(true);
    api
      .createNewCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        changeAllPopupsState();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleCardDelete(card) {
    setConfirmationPopupState(true);
    setSelectedCard({
      id: card._id,
      src: card.link,
      title: card.name,
    });
  }

  function handleConfirmationSubmit(selectedCard) {
    setIsLoading(true);
    api
      .deleteCard(selectedCard.id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== selectedCard.id));
        setConfirmationPopupState(false);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const formValidators = {};

  const enableValidation = (config) => {
    const formList = Array.from(document.querySelectorAll(config.formSelector));
    formList.forEach((formElement) => {
      const validator = new FormValidator(config, formElement);
      const formName = formElement.getAttribute("name");

      formValidators[formName] = validator;
      validator.enableValidation();
    });
  };

  enableValidation(validationConfig);

  function handleRegister({email, password}) {
    return mestoAuth
      .register(email, password)
      .then((res) => {
        if (res.data) {
          setAuthorizeState(true);
          setInfoTooltipState(true);
          navigate("/sign-in");
        } else {
          setAuthorizeState(false);
          setInfoTooltipState(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleLogin({email, password}) {
    return mestoAuth
      .authorize(email, password)
      .then((res) => {
        if (res.token) {
          setloggedIn(true);
          setUserEmail(email);
          localStorage.setItem("jwt", res.token);
          navigate("/");
        } else {
          setInfoTooltipState(true);
          setAuthorizeState(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function signOut() {
    localStorage.removeItem("jwt");
    setloggedIn(false);
    navigate("/sign-in");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header userEmail={userEmail} signOut={signOut} />
        <Routes>
          <Route
            path="*"
            element={
              loggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRouteElement
                element={Main}
                loggedIn={loggedIn}
                userEmail={userEmail}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                cards={cards}
              />
            }
          />
          <Route
            path="/sign-up"
            element={<Register onRegister={handleRegister} />}
          />
          <Route path="/sign-in" element={<Login onLogin={handleLogin} />} />
        </Routes>
        <Footer />
      </div>

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
        isLoading={isLoading}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
        isLoading={isLoading}
      />

      <ConfirmationPopup
        isOpen={isConfirmationPopupOpen}
        card={selectedCard}
        onClose={closeAllPopups}
        onConfirmation={handleConfirmationSubmit}
        isLoading={isLoading}
      />

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
        isLoading={isLoading}
      />

      <ImagePopup
        card={selectedCard}
        isOpen={isImagePopupOpen}
        onClose={closeAllPopups}
      />

      <InfoTooltip
        isOpen={isInfoTooltipOpen}
        isSuccess={authorizeState}
        onClose={closeAllPopups}
      />
    </CurrentUserContext.Provider>
  );
}

export default App;
