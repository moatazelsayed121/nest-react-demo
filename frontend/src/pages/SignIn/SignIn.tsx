import {
  useState,
  useEffect,
  ChangeEvent,
  MouseEvent,
  useContext,
} from "react";
import styles from "../../styles/form.module.css";
import { Input } from "../../components";
import axionsInstance from "../../network/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../authContext";
import { generateErrorMessage } from "../../responseHelper";

interface NewUserData {
  email: string;
  password: string;
  [key: string]: string;
}

interface Error {
  email: string;
  password: string;
  [key: string]: string;
}

// Sign in and Sign up can be combined as one component but I would rather split to be future proof
export default function SignIn() {
  const [userData, setUserData] = useState<NewUserData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Error>>({
    email: "",
    password: "",
  });
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    setUserData((prevState) => ({
      ...prevState,
      [key]: e.target.value,
    }));
  };
  const isValidData = () => {
    return Object.keys(errors).every((key) => !errors[key]);
  };
  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    setApiErrors([]);
    // Validate input
    if (isValidData()) {
      // call backend
      axionsInstance
        .post(`auth/login`, { ...userData })
        .then(async function () {
          const userReponse = await axionsInstance.get("/auth/profile");
          setCurrentUser(userReponse.data);
          navigate("/");
        })
        .catch(function (error) {
          // handle error
          setApiErrors(generateErrorMessage(error?.response));
        });
    }
  };
  useEffect(() => {
    const errors: Partial<Error> = {};
    if (!userData.email) errors.email = "Email is empty";
    if (!userData.password) errors.password = "Password is empty";
    setErrors(errors);
  }, [isSubmitted, userData]);

  return (
    <form className={styles.formContainer}>
      <Input
        label="Email"
        error={isSubmitted ? errors.email : ""}
        value={userData.email}
        onChange={(e) => {
          handleChange("email", e);
        }}
        type="email"
      />
      <Input
        label="Password"
        error={isSubmitted ? errors.password : ""}
        value={userData.password}
        onChange={(e) => {
          handleChange("password", e);
        }}
        type="password"
      />
      <button
        onClick={(e) => {
          handleSubmit(e);
        }}
        className={styles.submitButton}
      >
        Sign in
      </button>
      {apiErrors && (
        <ul className={styles.errorsContainer}>
          {apiErrors.map((error) => {
            return <li className={styles.error}>{error}</li>;
          })}
        </ul>
      )}
    </form>
  );
}
