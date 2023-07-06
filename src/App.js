import { useEffect, useState } from "react";
import "./App.css";
import { Range } from "react-range";

let passwordString = "";
var suffledString = "";
let selectedMethodsNumbers = [];

var SPECIAL_CHARS = "!@$%&*";
var LOWER_LETTERS = "abcdefghijklmnopqrstuvwxyz";
var UPPERCASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var NUMBERS = "0123456789";

function App() {
  const [range, setRange] = useState([0]);
  const [methods, setMethods] = useState({
    uppercase: false,
    lowercase: false,
    numbers: false,
    symbol: false,
  });
  const [parts, setParts] = useState(0);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const handlePasswordGenerate = () => {
    passwordString = "";
    selectedMethodsNumbers.map((item) => {
      for (var i = 1; i <= item.number; i++) {
        passwordString += item.arr[Math.floor(Math.random() * item.arr.length)];
      }
    });
    sufflePasswordString();
  };

  const sufflePasswordString = () => {
    suffledString = passwordString
      .split("")
      .sort(function () {
        return 0.5 - Math.random();
      })
      .join("");
    setGeneratedPassword(suffledString);
    showPasswordStrength()
  };

  const showPasswordStrength = ()=> {
    const filteredObj = Object.fromEntries(
      Object.entries(methods).filter(([key, value]) => value === true)
    );
    let objLength = Object.keys(filteredObj).length;
    if (objLength == 1) {
      setPasswordStrength("Weak");
    }
    else if (objLength == 2) {
      console.log("Medium");
      setPasswordStrength("Medium");
    }
    else if (objLength == 3 || objLength == 4) {
      setPasswordStrength("Strong");
    }
  }

  function divideIntoEqualParts(number, parts) {
    const quotient = Math.floor(number / parts);
    const remainder = number % parts;
    const result = [];
    Object.entries(methods).forEach(([key, value], index) => {
      if (value === true) {
        result.push({
          number: quotient + (index < remainder ? 1 : 0),
          method: key,
          arr:
            key === "numbers"
              ? NUMBERS
              : key === "symbol"
              ? SPECIAL_CHARS
              : key === "uppercase"
              ? UPPERCASE_LETTERS
              : LOWER_LETTERS,
        });
      }
    });
    selectedMethodsNumbers = result;
    return result;
  }

  useEffect(() => {
    divideIntoEqualParts(range[0], parts);
  }, [parts, range]);

  console.log("passwordStrength", passwordStrength);


  function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Text copied to clipboard');
  }

  return (
    <div className="App">
      <div className="generator-container">
        <h1 className="title">Password Generator</h1>
        <div className="password-field">
          <p>{generatedPassword}</p>
          <p onClick={()=> copyToClipboard(generatedPassword)}>copy</p>
        </div>
        <br />
        <div className="generater-field">
          <Range
            step={1}
            min={0}
            max={15}
            values={range}
            onChange={(values) => setRange(values)}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: "6px",
                  width: "100%",
                  backgroundColor: "#ccc",
                  marginTop: "20px",
                }}
              >
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: "42px",
                  width: "42px",
                  backgroundColor: "#999",
                }}
              >
                <p>{range}</p>
              </div>
            )}
          />
          {Object.keys(methods).map((key, index) => {
            const value = methods[key];
            console.log(key, value);
            return (
              <div key={index} className="method-selector">
                <input
                  id={key}
                  type="checkbox"
                  checked={methods[key]}
                  onChange={() => {
                    setMethods({ ...methods, [key]: !methods[key] });
                    if (!methods[key]) {
                      setParts(parts + 1);
                    } else {
                      setParts(parts - 1);
                    }
                  }}
                />
                <label htmlFor={key}>{key}</label>
              </div>
            );
          })}
          <div className="password-strength-field">
            <div>
              <p>Strength</p>
            </div>
            <div>{passwordStrength}</div>
          </div>
          <button
            onClick={() => {
              handlePasswordGenerate();
            }}
          >
            GENERATE
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
