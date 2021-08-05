import React, { useState, useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useHistory } from "react-router";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Home = () => {
  const [expense, setExpense] = useState([]);
  const [income, setIncome] = useState([]);
  const reducer = (accumulator, curr) => accumulator + curr;
  const [button, setButton] = useState("");
  const { user, dispatch } = useContext(AuthContext);

  useEffect(() => {
    const fetchExpense = async () => {
      const res = await axios.get("http://localhost:3001/api/" + user._id);
      console.log(res.data.expenses);
      if(res.data){
        setExpense([...res.data.expense]);
        setIncome([...res.data.income]);
      }
    };
    fetchExpense();
  }, [user]);

  const handleLogout = (event) => {
    try {
      localStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });
    } catch (err) {
      console.log(err.message, "error");
    }
  };

  const handleSubmit = async (
    e,
    { setSubmitting, setErrors, setStatus, resetForm }
  ) => {
    const newExpense = {
      userId: user._id,
      password: user.password,
      expense: e.amount,
      income: null,
    };
    const newIncome = {
      userId: user._id,
      password: user.password,
      expense: null,
      income: e.amount,
    };
    if (button === 1) {
      await axios.post("http://localhost:3001/api/add", newIncome);
      setIncome([...income, e.amount]);
    } else if (button === 2) {
      await axios.post("http://localhost:3001/api/add", newExpense);
      setExpense([...expense, e.amount]);
    }
    resetForm({});
  };

  const clearAction = async () => {
    await axios.post("http://localhost:3001/api/clear/", { userId: user._id });
    dispatch({ type: "CLEAR" });
    setIncome([]);
    setExpense([]);
  };
  return (
    <div>
      <section className="">
        <header className="border-b md:flex md:items-center md:justify-between p-4 pb-0 shadow-lg md:pb-4">
          <div className="flex items-center justify-center mb-4 md:mb-0">
            <h2 className="text-4xl text-purple-800 font-bold">
              Expense Tracker
            </h2>
          </div>
          <nav>
            <ul className="list-reset md:flex md:items-center">
              <li className="md:ml-4">
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 w-16 h-8 mr-3 text-black active:bg-gray-300 font-semibold  text-sm  rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </header>
        <div>
          <Formik
            initialValues={{
              amount: "",
            }}
            onSubmit={handleSubmit}
          >
            <Form>
              <Field
                name="amount"
                type="number"
                min="0"
                className="outline-none rounded py-3 px-3 mt-8 bg-white shadow text-sm text-gray-700 placeholder-gray-400  focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent "
                placeholder="Amount"
              />
              <button
                className="mx-7 bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="submit"
                onClick={() => setButton(1)}
              >
                Income
              </button>
              <button
                className="mx-3 bg-amber-500 text-white active:bg-amber-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="submit"
                onClick={() => setButton(2)}
              >
                Expense
              </button>
            </Form>
          </Formik>

          <div className="text-right">
            <button
              onClick={clearAction}
              className="bg-red-500 w-16 h-8 mr-6 text-white active:bg-amber-600 font-semibold  text-sm  rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="submit"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="flex mb-4">
          <div className="w-1/2 bg-gray-400 h-auto mx-7 my-4 py-4 shadow-2xl rounded-md ">
            <h1 className="font-semibold text-2xl text-white">Income</h1>
            <ul className="text-left text-white mx-16 my-4 list-disc space-y-2">
              {income.map((income, index) => {
                return <li key={index}>{income}</li>;
              })}
            </ul>
          </div>
          <div className="w-1/2 bg-gray-300 h-auto mx-7 my-4 py-4 shadow-2xl rounded-md">
            <h1 className="font-semibold text-2xl text-black">Expense</h1>
            <ul className="text-left mx-16 my-4 list-disc space-y-2">
              {expense.map((expense, index) => {
                return <li key={index}>{expense}</li>;
              })}
            </ul>
          </div>
        </div>
        <div className="flex mb-4">
          <div className="w-full text-left h-auto ml-7">
            <h1 className="font-semibold text-2xl text-purple-800">
              Balance:{" "}
              {income.length && expense.length
                ? income.reduce(reducer) - expense.reduce(reducer)
                : ""}
            </h1>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
