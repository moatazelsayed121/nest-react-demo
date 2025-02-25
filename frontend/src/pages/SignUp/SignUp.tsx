import {
  useState,
  useEffect,
  ChangeEvent,
  MouseEvent,
  useContext,
} from "react";
import styles from "../../styles/form.module.css";
import { Input } from "../../components";
import {
  isValidEmail,
  isValidPassword,
  isValidName,
} from "../../validationHelper.ts";
import axionsInstance from "../../network/axiosInstance.ts";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../authContext.tsx";
import { generateErrorMessage } from "../../responseHelper.ts";

interface UserData {
  name: string;
  email: string;
  password: string;
  [key: string]: string;
}

export default function SignUp() {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<UserData>>({});
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
      // Call backend
      axionsInstance
        .post(`auth/register`, { ...userData })
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
    const errors: Partial<UserData> = {};
    if (!isValidEmail(userData.email)) errors.email = "Email is invalid";
    if (!isValidPassword(userData.password))
      errors.password = "Password is invalid";
    if (!isValidName(userData.name)) errors.name = "Name is invalid";

    setErrors(errors);
  }, [userData]);

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
        label="Name"
        error={isSubmitted ? errors.name : ""}
        value={userData.name}
        onChange={(e) => {
          handleChange("name", e);
        }}
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
      <button onClick={handleSubmit} className={styles.submitButton}>
        Sign up
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
