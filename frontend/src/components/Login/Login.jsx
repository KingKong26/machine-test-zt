import React, { useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";

// validation functions
function validateEmail(value) {
  let error;
  if (!value) {
    error = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    error = "Invalid email address format";
  }

  return error;
}

function validatePassword(value) {
  let error;
  if (!value) {
    error = "Password is required";
  } else if (value.length < 6) {
    error = "Password must be 6 characters at minimum";
  }

  return error;
}

const Login = () => {
  const { user, isFetching, error, dispatch } = useContext(AuthContext);
  const [status, setStatus] = useState("");

  const handleFormSubmit = async (
    values,
    {  setErrors, resetForm }
  ) => {
    let { email, password } = values;
    await loginCall({ email: email, password: password }, dispatch);
    if (error) {
      setStatus("Password Incorrect");
    }
  };
  return (
    <div>
      <div className="h-screen flex bg-gray-bg1">
        <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-2xl py-10 px-16">
          <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
            User Login
          </h1>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            onSubmit={handleFormSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="text-left pb-3">
                  <label htmlFor="email">Email</label>
                  <Field
                    name="email"
                    className={`w-full p-2 mt-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4  ${
                      touched.email
                        ? "focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        : errors.email
                        ? "focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        : "focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    }`}
                    validate={validateEmail}
                    placeholder="Your Email"
                  />
                  <ErrorMessage
                    component="div"
                    name="email"
                    className="font-semibold text-red-600 font-sans text-xs"
                  />
                </div>
                <div className="text-left">
                  <label htmlFor="password" className="pb-7">
                    Password
                  </label>
                  <Field
                    name="password"
                    type="password"
                    className={`w-full p-2 mt-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4  ${
                      touched.password
                        ? "focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        : errors.password
                        ? "focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        : "focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    }`}
                    placeholder="Your Password"
                    validate={validatePassword}
                  />
                  <ErrorMessage
                    component="div"
                    name="password"
                    className="font-semibold text-red-600 font-sans text-xs"
                  />
                  {status && <div className="font-semibold text-red-600 font-sans text-xs">{status}</div>}
                </div>

                <div className="flex justify-center items-center mt-6">
                  <button
                    className={`h-10 px-5 m-2 text-white transition-colors duration-150 bg-purple-600 rounded-lg focus:shadow-outline hover:bg-purple-700`}
                    type="submit"
                  >
                    {isFetching ? (
                      <CircularProgress color="inherit" size="20px" />
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
