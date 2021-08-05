import React, { useState } from "react";
import { useFinchConnect } from "react-finch-connect";
import logo from "./logo.svg";

import axios from "axios";

const queryString = require("query-string");

let CLIENT_ID = "<<YOUR_CLIENT_ID>>";
let CLIENT_SECRET = "<<YOUR_CLIENT_SECRET>>";

const PrettyPrintJson = ({ data }) => {
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

const App = () => {
  const [code, setCode] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [output, setOutput] = useState(null);
  const [individualID, setIndividualID] = useState(null);
  const [paymentID, setPaymentID] = useState(null);

  const onSuccess = ({ code }) => {
    setCode(code);
    setOutput(code);
  };
  const onError = ({ errorMessage }) => setOutput(errorMessage);
  const onClose = () => setOutput("User exited Finch Connect");

  const { open } = useFinchConnect({
    sandbox: true,
    clientId: CLIENT_ID,
    products: [
      "company",
      "directory",
      "individual",
      "employment",
      "payment",
      "pay_statement",
      // "deduction",
    ],
    // payrollProvider: "gusto",
    onSuccess,
    onError,
    onClose,
  });

  const exchangeCode = () => {
    axios({
      method: "post",
      url: "https://api.tryfinch.com/auth/token",
      headers: {
        Authorization: `Basic ${btoa(CLIENT_ID + ":" + CLIENT_SECRET)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: queryString.stringify({
        code: code,
      }),
    }).then(function (response) {
      setOutput(response.data);
      setAccessToken(response.data.access_token);
    });
  };

  const getCompany = () => {
    axios({
      method: "get",
      url: "https://api.tryfinch.com/employer/company",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Finch-API-Version": "2020-09-17",
      },
    }).then(function (response) {
      setOutput(response.data);
    });
  };

  const getDirectory = () => {
    axios({
      method: "get",
      url: "https://api.tryfinch.com/employer/directory",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Finch-API-Version": "2020-09-17",
      },
    }).then(function (response) {
      setOutput(response.data);
    });
  };

  const handleIndividualIDChange = (event) => {
    setIndividualID(event.target.value);
  };

  const getIndividual = () => {
    axios({
      method: "POST",
      url: "https://api.tryfinch.com/employer/individual",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Finch-API-Version": "2020-09-17",
      },
      data: {
        requests: [{ individual_id: individualID }],
      },
    }).then(function (response) {
      setOutput(response.data);
    });
  };

  const getEmployment = () => {
    axios({
      method: "POST",
      url: "https://api.tryfinch.com/employer/employment",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Finch-API-Version": "2020-09-17",
      },
      data: {
        requests: [{ individual_id: individualID }],
      },
    }).then(function (response) {
      setOutput(response.data);
    });
  };

  const handlePaymentIDChange = (event) => {
    setPaymentID(event.target.value);
  };

  const getPayment = () => {
    axios({
      method: "GET",
      url: "https://api.tryfinch.com/employer/payment?start_date=2019-01-01&end_date=2021-08-01",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Finch-API-Version": "2020-09-17",
      },
    }).then(function (response) {
      setOutput(response.data);
    });
  };

  const getPayStatement = () => {
    axios({
      method: "POST",
      url: "https://api.tryfinch.com/employer/pay-statement",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Finch-API-Version": "2020-09-17",
      },
      data: {
        requests: [{ payment_id: paymentID }],
      },
    }).then(function (response) {
      setOutput(response.data);
    });
  };

  return (
    <div>
      <header>
        <img src={logo} alt="Finch Logo"></img>
        <hr></hr>
        <button type="button" onClick={() => open()}>
          Open Finch Connect
        </button>
        <p>Authorization Code: {code}</p>
        <hr></hr>
        <button type="button" onClick={() => exchangeCode()}>
          exchangeCode
        </button>
        <p>Access Token: {accessToken}</p>
        <hr></hr>
        <button type="button" onClick={() => getCompany()}>
          GetCompany
        </button>
        <button type="button" onClick={() => getDirectory()}>
          GetDirectory
        </button>
        <hr></hr>
        <div>
          <input
            type="text"
            placeholder="individual_id"
            value={individualID}
            onChange={handleIndividualIDChange}
          />
          <br></br>
          <button type="button" onClick={() => getIndividual()}>
            GetIndividual
          </button>
          <button type="button" onClick={() => getEmployment()}>
            GetEmployment
          </button>
        </div>
        <hr></hr>
        <p>
          start_date=2019-01-01 <br></br> end_date=2021-08-01
        </p>
        <button type="button" onClick={() => getPayment()}>
          GetPayment
        </button>
        <hr></hr>
        <input
          type="text"
          placeholder="payment_id"
          value={paymentID}
          onChange={handlePaymentIDChange}
        />
        <br></br>
        <button type="button" onClick={() => getPayStatement()}>
          GetPayStatement
        </button>
        <hr></hr>
        <h1>Output:</h1>
        <PrettyPrintJson data={output}></PrettyPrintJson>;
      </header>
    </div>
  );
};

export default App;
