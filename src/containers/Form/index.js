import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () => new Promise((resolve) => { setTimeout(resolve, 1000); });

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    nom: null,
    prenom: null,
    type: null,
    email: null,
    message: null,
    errors: {
      nom: false,
      prenom: false,
      type: false,
      email: false,
      message: false,
    },
  });

  useEffect(() => {
    console.log("Component re-rendered with state:", formData);
  }, [formData]);

  const handleInputChange = (fieldName, value) => {
    console.log(`Changing ${fieldName} to:`, value);
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
      errors: {
        ...prevFormData.errors,
        [fieldName]: value === null || value.trim() === "",
      },
    }));
  };

  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();
  
      const newErrors = {
        nom: formData.nom === null || formData.nom.trim() === "",
        prenom: formData.prenom === null || formData.prenom.trim() === "",
        type: formData.type === null,
        email: formData.email === null || formData.email.trim() === "",
        message: formData.message === null || formData.message.trim() === "",
      };
  
      setFormData((prevFormData) => ({
        ...prevFormData,
        errors: newErrors,
      }));
  
      if (Object.values(newErrors).some((error) => error)) {
        console.log("Remplir champs");
      } else {
        setSending(true);
  
        // We try to call mockContactApi
        try {
          await mockContactApi();
          setSending(false);
          onSuccess();
        } catch (err) {
          setSending(false);
          onError(err);
        }
      }
    },
    [onSuccess, onError, formData]
  );

  return (
    <form onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          <Field
            placeholder=""
            label="Nom"
            value={formData.nom}
            onChange={(e) => handleInputChange("nom", e.target.value)}
          />
          {formData.errors.nom && <span className="error-message">Le nom est obligatoire</span>}

          <Field
            placeholder=""
            label="Prénom"
            value={formData.prenom}
            onChange={(e) => handleInputChange("prenom", e.target.value)}
          />
          {formData.errors.prenom && <span className="error-message">Le prénom est obligatoire</span>}

          <Select
            selection={["Personel", "Entreprise"]}
            onChange={(selectedValue) => handleInputChange("type", selectedValue)}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
            value={formData.type}
          />
          {formData.errors.type && <span className="error-message">Veuillez sélectionner le type</span>}

          <Field
            placeholder=""
            label="Email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          {formData.errors.email && <span className="error-message">L email est obligatoire</span>}

          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
            {sending ? "En cours" : "Envoyer"}
          </Button>
        </div>
        <div className="col">
          <Field
            placeholder="message"
            label="Message"
            type={FIELD_TYPES.TEXTAREA}
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
          />
          {formData.errors.message && <span className="error-message">Le message est obligatoire</span>}
        </div>
      </div>
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
}

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
}

export default Form;
