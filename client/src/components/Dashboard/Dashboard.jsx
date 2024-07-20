import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleError, handleSuccess } from "../../utils";
import { ToastContainer } from "react-toastify";
import "./Dashboard.css";

const Dashboard = () => {
  const [testCode, setTestCode] = useState();
  const [loggedInUser, setLoggedInUser] = useState("");
  const [createdTests, setCreatedTests] = useState([]);
  const [foundCreatedTests, setFoundCreatedTests] = useState(false);
  const [takenTests, setTakenTests] = useState([]);
  const [foundTakenTests, setFoundTakenTests] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  useEffect(() => {
    const fetchCreatedTests = async () => {
      try {
        await axios
          .get(`http://localhost:5000/findcreatedtests?user=${loggedInUser}`)
          .then((response) => {
            if (response.data.message === undefined)
              setCreatedTests(response.data);
            setFoundCreatedTests(true);
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
      }
    };

    const fetchTakenTests = async () => {
      try {
        await axios
          .get(`http://localhost:5000/findtakentests?user=${loggedInUser}`)
          .then((response) => {
            if (response.data.message === undefined)
              setTakenTests(response.data);
            setFoundTakenTests(true);
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
      }
    };

    if (loggedInUser) {
      fetchCreatedTests();
      fetchTakenTests();
    }
  }, [loggedInUser]);

  const getTest = async () => {
    try {
      await axios
        .get(`http://localhost:5000/taketest?code=${testCode}`)
        .then((response) => {
          const testData = response.data;
          navigate(`/taketest/${testCode}`, {
            state: [testData, loggedInUser],
          });
        })
        .catch((err) => handleError("Invalid Test Code."));
    } catch (error) {
      console.error("Error fetching test:", error);
    }
  };

  const handleLogout = (e) => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("User Logged Out.");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="contain">
      <div className="start">
        <h1>Welcome {loggedInUser}!</h1>
        <button className="logoutbtn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <button
        className="createtestbtnn"
        onClick={() => navigate("/createtest")}
      >
        Create Test
      </button>

      <div className="validtest">
        <p>Want to take a test?</p>
        <input
          className="validtesttnput"
          type="text"
          placeholder="Enter valid test code"
          value={testCode}
          onChange={(e) => setTestCode(e.target.value)}
        />
        <button className="validtestbtn" onClick={() => getTest()}>
          Get Test
        </button>
      </div>

      <div className="displayentries">
        <div className="displayentries-item1">
          <p>Tests you created appear here:</p>

          {loggedInUser && foundCreatedTests === false ? (
            <div>Loading....</div>
          ) : createdTests.length === 0 ? (
            <div>You have not created any test yet.</div>
          ) : (
            createdTests.map((test, testindex) => {
              return (
                <div className="testitems">
                  <p className="titem">
                    {testindex + 1}: {test.testName}
                  </p>
                  <p className="titem">{test.testDuration}</p>
                  <p className="titem">{test.testID}</p>
                </div>
              );
            })
          )}
        </div>

        <div className="displayentries-item2">
          <p>Tests you took appear here:</p>

          {loggedInUser && foundTakenTests === false ? (
            <div>Loading....</div>
          ) : takenTests.length === 0 ? (
            <div>You have not taken any test yet.</div>
          ) : (
            takenTests.map((test, testindex) => {
              return (
                <div className="testitems">
                  <p className="titem">
                    {testindex + 1}: {test.testName}
                  </p>
                  <p className="titem">{test.testDuration}</p>
                  <p className="titem">{test.testID}</p>
                  <p className="titem">{test.tookBy}</p>
                </div>
              );
            })
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Dashboard;
