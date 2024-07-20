import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./TakeTest.css";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../utils";
import axios from "axios";

const TakeTest = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const timeParts = state[0].testDuration.split(":");
  const totalTime =
    parseInt(timeParts[0], 10) * 3600 +
    parseInt(timeParts[1], 10) * 60 +
    parseInt(timeParts[2], 10);

  const totalQuestions = state[0].questions.length;
  let tempKey = Array(totalQuestions).fill("?").join("");

  const [time, setTime] = useState(totalTime * 1000);
  const [startTest, setStartTest] = useState(0);
  const [finishTest, setFinishTest] = useState(false);
  const [answers, setAnswers] = useState(tempKey);
  const [result, setResult] = useState(0);
  const [resok, setResOk] = useState(false);
  const [permissions, setPermissions] = useState([false, false, false]);
  const [fullscreen, setFullscreen] = useState(false);

  const handleStartTest = () => {
    handleSuccess("Test Started.");
    setTimeout(() => {
      setStartTest(1);
    }, 500);
  };

  useEffect(() => {
    if (startTest === 0) {
      const secop = state[0].security;

      if (secop[0] === true) {
        const cameraPerm = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true,
            });

            setPermissions((prevperm) => {
              const newperm = [...prevperm];
              newperm[0] = true;
              return newperm;
            });
          } catch (error) {
            console.error("Error accessing media devices:", error);
            setPermissions((prevperm) => {
              const newperm = [...prevperm];
              newperm[0] = false;
              return newperm;
            });
          }
        };

        cameraPerm();
      }

      if (secop[1] === true) {
        setPermissions((prevperm) => {
          const newperm = [...prevperm];
          newperm[1] = true;
          return newperm;
        });
      }

      if (secop[2] === true) {
        setPermissions((prevperm) => {
          const newperm = [...prevperm];
          newperm[2] = true;
          return newperm;
        });
      }
    }
  }, [startTest]);

  const handleFullScreen = () => {
    const element = document.getElementById("containerr");
    const isFullScreen = document.fullscreenElement;

    if (isFullScreen) {
      document.exitFullscreen();
      setFullscreen(false);
    } else {
      element.requestFullscreen();
      setFullscreen(true);
    }
  };

  useEffect(() => {
    window
      .matchMedia("(display-mode: fullscreen)")
      .addListener(({ matches }) => {
        if (!matches) setFullscreen(false);
        else setFullscreen(true);
      });
  }, []);

  useEffect(() => {
    const handleBlur = () => {
      if (startTest === 1 && permissions[2] === true) {
        handleError(
          `Tab switching detected!
          Refrain from it else test will be terminated!`
        );
      }
    };

    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("blur", handleBlur);
    };
  }, [permissions, startTest]);

  // useEffect(() => {
  //   if (startTest === 1 && permissions[1] === true) {
  //     window
  //       .matchMedia("(display-mode: fullscreen)")
  //       .addListener(({ matches }) => {
  //         if (!matches) {
  //           if (
  //             window.confirm(
  //               "Enable full screen mode else test will be terminated."
  //             )
  //           ) {
  //             const element = document.getElementById("containerr");
  //             element.requestFullscreen();
  //             setFullscreen(true);
  //           }
  //         } else setFullscreen(true);
  //       });
  //   }
  // }, [startTest, permissions]);

  useEffect(() => {
    if (startTest === 1 && time > 0) {
      const timer = setInterval(() => {
        setTime(time - 1000);
      }, 1000);

      return () => clearInterval(timer);
    } else if (time === 0) {
      handleFinishTest();
    }
  }, [startTest, time]);

  const getFormattedTime = (milliseconds) => {
    let total_seconds = parseInt(Math.floor(milliseconds / 1000));
    let total_minutes = parseInt(Math.floor(total_seconds / 60));
    let total_hours = parseInt(Math.floor(total_minutes / 60));

    let seconds = parseInt(total_seconds % 60);
    let minutes = parseInt(total_minutes % 60);
    let hours = parseInt(total_hours % 24);

    return `${hours} : ${minutes} : ${seconds}`;
  };

  const handleOptionChange = (e, quesIndex, optionIndex) => {
    let updatedAnswers = answers.split("");

    if (e.target.checked === false) updatedAnswers[quesIndex] = "?";
    else updatedAnswers[quesIndex] = String.fromCharCode(optionIndex + 1 + 48);

    updatedAnswers = updatedAnswers.join("");
    setAnswers(updatedAnswers);
  };

  const handleFinishTest = () => {
    console.log(answers);

    setFinishTest(true);
    setStartTest(2);
    handleSuccess("Test Submitted.");
  };

  useEffect(() => {
    const postSubmit = async () => {
      try {
        await axios
          .get(`http://localhost:5000/submittest?code=${state[0].testID}`)
          .then((response) => {
            const origanswers = response.data;

            let count = 0;
            for (let i = 0; i < answers.length; i++) {
              if (origanswers[i] === answers[i]) count++;
            }
            setResult(count);
            setResOk(true);
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
      }
    };

    if (finishTest === true && startTest === 2) postSubmit();
  }, [finishTest, startTest]);

  useEffect(() => {
    const sendData = () => {
      const str = state[1] + "/" + result + "/" + answers.length;
      const data = { testid: state[0].testID, val: str };

      console.log(data);

      axios
        .post("http://localhost:5000/submittest", data)
        .then((result) => {
          console.log(result.data);
        })
        .catch((err) => console.log(err));
    };

    if (resok === true) sendData();
  }, [resok]);

  return (
    <div className="containerr" id="containerr">
      <div className="opening">
        <h1>Take Test: {state[0].testName}</h1>
        <button
          className="backbtn"
          onClick={() => {
            navigate("/dashboard");
          }}
        >
          Go to Dashboard
        </button>
      </div>

      <div className="intro">
        <div className="intro1">
          <p>Created by: {state[0].createdBy}</p>
          <p>Test Code: {state[0].testID}</p>
          <p>Time Remaining: {getFormattedTime(time)}</p>

          <button
            className="startbtn"
            onClick={() => handleStartTest()}
            disabled={!(startTest === 0)}
          >
            Start Test
          </button>

          <button
            className="finishbtn"
            onClick={() => handleFinishTest()}
            disabled={!(startTest === 1)}
          >
            Finish Test
          </button>
        </div>

        <div className="intro2">
          {permissions[0] === true && (
            <div>
              <ul>
                <li>
                  <p>
                    This test has camera and audio proctoring. Kindly refrain
                    from cheating or making any unnecessary movements else test
                    will be terminated.
                  </p>
                </li>
              </ul>
            </div>
          )}

          {permissions[1] === true && (
            <div>
              <ul>
                <li>
                  <p>
                    Kindly keep full screen mode else test will be terminated.
                  </p>
                  <button className="fullscreenbtn" onClick={handleFullScreen}>
                    {fullscreen === false
                      ? "Enable Full Screen"
                      : "Disable Full Screen"}
                  </button>
                </li>
              </ul>
            </div>
          )}

          {permissions[2] === true && (
            <div>
              <ul>
                <li>
                  <p>
                    Kindly refrain from switching tabs or using other
                    applications while taking the test. If any such activity is
                    detected, your test will be terminated.
                  </p>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <br />

      {startTest === 2 && resok === true && (
        <div className="result">
          Your score is: {result}/{answers.length}
        </div>
      )}

      <br />
      <br />

      {startTest === 1 && finishTest === false && (
        <div>
          {state[0].questions.map((question, quesIndex) => {
            return (
              <div key={quesIndex}>
                Question {quesIndex + 1}: {question.quesText}
                <div
                  key={question.options.length + 1}
                  style={{ display: "flex" }}
                >
                  Options:
                  {question.options.map((option, optionIndex) => {
                    if (typeof option === "string") {
                      return (
                        <ul>
                          <input
                            type="checkbox"
                            checked={
                              answers[quesIndex] === "?" ||
                              answers[quesIndex].charCodeAt(0) - 48 - 1 !==
                                optionIndex
                                ? false
                                : true
                            }
                            id={optionIndex}
                            onChange={(e) =>
                              handleOptionChange(e, quesIndex, optionIndex)
                            }
                          />
                          <label for={optionIndex}>{option}</label>
                        </ul>
                      );
                    } else {
                      return (
                        <ul>
                          <input
                            type="checkbox"
                            checked={
                              answers[quesIndex] === "?" ||
                              answers[quesIndex].charCodeAt(0) - 48 - 1 !==
                                optionIndex
                                ? false
                                : true
                            }
                            id={optionIndex}
                            onChange={(e) =>
                              handleOptionChange(e, quesIndex, optionIndex)
                            }
                          />
                          <label for={optionIndex}>
                            <img
                              src={option.file}
                              alt=""
                              width="100px"
                              height="100px"
                            />
                          </label>
                        </ul>
                      );
                    }
                  })}
                </div>
                <br />
                <br />
              </div>
            );
          })}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default TakeTest;
