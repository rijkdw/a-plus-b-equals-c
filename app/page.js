"use client";

import styles from "./page.module.css";
import { useRef, useState } from "react";
import { sortKeysByValues } from "./utils";

export default function Home() {
  const [weights, setWeights] = useState({ a: 0, b: 0, c: 0 });
  const [values, setValues] = useState({ a: "", b: "", c: "" });

  function valuesAdjustedAfterChange(variableChanged, newValue) {
    let newValues = Object.assign({}, values);
    newValues[variableChanged] = newValue;
    return newValues;
  }

  function weightsAdjustedAfterChange(variableChanged) {
    let newWeights = {};
    for (const [key, value] of Object.entries(weights)) {
      newWeights[key] = value + 1;
    }
    newWeights[variableChanged] = 0;
    return newWeights;
  }

  function onChangeHandler(event, variable) {
    if (!checkIsAllowableInput(event.currentTarget.value)) {
      return;
    }
    let newWeights = weightsAdjustedAfterChange(variable);
    let newValues = valuesAdjustedAfterChange(
      variable,
      event.currentTarget.value
    );
    newValues = runCalculations(newWeights, newValues);
    setWeights(newWeights);
    setValues(newValues);
  }

  function resetCalculator() {
    setWeights({ a: 0, b: 0, c: 0 });
    setValues({ a: "", b: "", c: "" });
  }

  function setCalculatorToSomeState() {
    setWeights({ a: 1, b: 0, c: 1 });
    setValues({ a: "", b: "3", c: "" });
  }

  return (
    <>
      <div className={styles.content}>
        {/* Header */}
        <h1>
          <b>a + b = c</b> &nbsp; calculator
        </h1>
        {/* Debug state */}
        {/* <p>Values: {JSON.stringify(values)}</p>
        <p>Weights: {JSON.stringify(weights)}</p> */}
        {/* Calculator */}
        <div className={styles.calculator}>
          {/* Input group */}
          <div className={styles.group}>
            <div className={styles.groupname}>Inputs</div>
            <Field name="a" value={values.a} callback={(event) => {onChangeHandler(event, "a")}} />
            <Field name="b" value={values.b} callback={(event) => {onChangeHandler(event, "b")}} />
          </div>
          {/* Output group */}
          <div className={styles.group}>
            <div className={styles.groupname}>Output</div>
            <Field name="c" value={values.c} callback={(event) => {onChangeHandler(event, "c")}} />
          </div>
          {/* Bottom buttons */}
          <div className={styles.bottomrow}>
            <button
              className={styles.bottomrowbutton}
              onClick={resetCalculator}
            >
              Reset
            </button>
            <button
              className={styles.bottomrowbutton}
              onClick={setCalculatorToSomeState}
            >
              ?????
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ name, value, callback }) {
  return (
    <div className={styles.field}>
      <label>{name}</label>
      <input
        type="numeric"
        onChange={callback}
        value={value}
      />
    </div>
  );
}

function checkIsAllowableInput(value) {
  if (typeof value !== "string") return false;
  if (value === "") return true;
  return !isNaN(value) && !isNaN(parseFloat(value));
}

function checkIsUseableInput(value) {
  if (typeof value === "number") return true;
  return !isNaN(value) && !isNaN(parseFloat(value));
}

function runCalculations(_weights, _values) {
  const orderOfVars = sortKeysByValues(_weights, false);
  for (const variable of orderOfVars) {
    if (!checkIfValuesAvailable(variable, _values)) {
      continue;
    }
    const value = calculateValue(variable, _values);
    _values[variable] = value;
  }
  return _values;
}

function calculateValue(variable, _values) {
  if (variable === "a") {
    // a = c - b
    return parseFloat(_values.c) - parseFloat(_values.b);
  }
  if (variable === "b") {
    // b = c - a
    return parseFloat(_values.c) - parseFloat(_values.a);
  }
  if (variable === "c") {
    // c = a + b
    return parseFloat(_values.a) + parseFloat(_values.b);
  }
}

function checkIfValuesAvailable(variable, _values) {
  if (variable === "a") {
    return checkIsUseableInput(_values.b) && checkIsUseableInput(_values.c);
  }
  if (variable === "b") {
    return checkIsUseableInput(_values.a) && checkIsUseableInput(_values.c);
  }
  if (variable === "c") {
    return checkIsUseableInput(_values.a) && checkIsUseableInput(_values.b);
  }
}
