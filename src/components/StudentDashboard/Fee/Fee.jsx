import React, { useEffect, useState } from "react";

import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaReceipt,
  FaCheck,
  FaUpload,
  FaImage,
  FaEye,
  FaUniversity,
  FaCopy,
  FaTimes,
} from "react-icons/fa";

import API from "/src/api/api";

import "./Fee.css";

const Fee = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [fee, setFee] = useState(null);
  const [loading, setLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] =
    useState("");

  const [transactionId, setTransactionId] =
    useState("");

  const [paymentProof, setPaymentProof] =
    useState(null);

  const [submitting, setSubmitting] =
    useState(false);

  // =====================================================
  // SERVER URL
  // =====================================================

  const SERVER_URL = (
    API.defaults?.baseURL ||
    "http://localhost:5000/api"
  ).replace(/\/api\/?$/, "");

  // =====================================================
  // GET MY FEE
  // =====================================================

  const fetchFee = async () => {
    try {
      setLoading(true);

      const response = await API.get(
        "/students/my-fee"
      );

      console.log(
        "MY FEE RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        const feeData =
          response.data.data || {};

        setFee(feeData);

        setPaymentMethod(
          feeData.paymentMethod || ""
        );

        setTransactionId(
          feeData.transactionId || ""
        );
      } else {
        setFee(null);
      }
    } catch (error) {
      console.error(
        "GET FEE ERROR:",
        error
      );

      console.error(
        "GET FEE RESPONSE:",
        error.response?.data
      );

      setFee(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFee();
  }, []);

  // =====================================================
  // COPY ACCOUNT NUMBER
  // =====================================================

  const copyAccountNumber = async () => {
    if (!fee?.accountNumber) return;

    try {
      await navigator.clipboard.writeText(
        fee.accountNumber
      );

      alert("Account number copied!");
    } catch (error) {
      console.error(
        "COPY ACCOUNT ERROR:",
        error
      );

      alert(
        "Could not copy account number."
      );
    }
  };

  // =====================================================
  // FILE SELECT
  // =====================================================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setPaymentProof(null);
      return;
    }

    console.log(
      "SELECTED PAYMENT FILE:",
      {
        name: file.name,
        type: file.type,
        size: file.size,
      }
    );

    // -------------------------------------------------
    // ALLOWED FILE TYPES
    // -------------------------------------------------

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Only JPG, PNG and WEBP images are allowed."
      );

      e.target.value = "";
      setPaymentProof(null);

      return;
    }

    // -------------------------------------------------
    // MAX SIZE 5MB
    // -------------------------------------------------

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(
        "Payment screenshot must be less than 5 MB."
      );

      e.target.value = "";
      setPaymentProof(null);

      return;
    }

    setPaymentProof(file);
  };

  // =====================================================
  // REMOVE SELECTED FILE
  // =====================================================

  const removePaymentProof = () => {
    setPaymentProof(null);

    const input =
      document.getElementById(
        "paymentProofInput"
      );

    if (input) {
      input.value = "";
    }
  };

  // =====================================================
  // SUBMIT PAYMENT
  // =====================================================

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    // -------------------------------------------------
    // PAYMENT METHOD
    // -------------------------------------------------

    if (!paymentMethod) {
      alert(
        "Please select payment method."
      );

      return;
    }

    // -------------------------------------------------
    // TRANSACTION ID
    // -------------------------------------------------

    if (!transactionId.trim()) {
      alert(
        "Please enter transaction ID."
      );

      return;
    }

    // -------------------------------------------------
    // PAYMENT SCREENSHOT
    // -------------------------------------------------

    if (!paymentProof) {
      alert(
        "Please upload your payment screenshot."
      );

      return;
    }

    try {
      setSubmitting(true);

      // =================================================
      // FORM DATA
      // =================================================

      const formData = new FormData();

      formData.append(
        "paymentMethod",
        paymentMethod
      );

      formData.append(
        "transactionId",
        transactionId.trim()
      );

      // IMPORTANT
      // Must match:
      // paymentUpload.single("paymentProof")
      formData.append(
        "paymentProof",
        paymentProof
      );

      console.log(
        "SUBMITTING PAYMENT:",
        {
          paymentMethod,
          transactionId:
            transactionId.trim(),
          paymentProof: {
            name: paymentProof.name,
            type: paymentProof.type,
            size: paymentProof.size,
          },
        }
      );

      // =================================================
      // API REQUEST
      // =================================================

      const response = await API.put(
        "/students/my-fee/pay",
        formData
      );

      console.log(
        "PAYMENT SUBMIT RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        alert(
          "Payment submitted successfully. Please wait for admin verification."
        );

        setPaymentProof(null);
        setTransactionId("");

        const input =
          document.getElementById(
            "paymentProofInput"
          );

        if (input) {
          input.value = "";
        }

        await fetchFee();
      } else {
        alert(
          response.data?.message ||
            "Payment submission failed."
        );
      }
    } catch (error) {
      console.error(
        "PAYMENT ERROR:",
        error
      );

      console.error(
        "PAYMENT ERROR RESPONSE:",
        error.response?.data
      );

      const message =
        error.response?.data?.message ||
        "Payment submission failed.";

      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="student-fee-loading">
        <FaMoneyBillWave />

        <p>
          Loading fee information...
        </p>
      </div>
    );
  }

  // =====================================================
  // NO FEE DATA
  // =====================================================

  if (!fee) {
    return (
      <div className="student-fee-page">
        <div className="student-fee-empty">
          <FaMoneyBillWave />

          <h2>
            Fee Information
          </h2>

          <p>
            Your fee information is
            not available yet.
          </p>

          <button
            type="button"
            onClick={fetchFee}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // FEE DATA
  // =====================================================

  const amount = Number(
    fee.amount ??
      fee.feeAmount ??
      0
  );

  const course =
    fee.course ||
    "Quran Academy Course";

  const dueDate =
    fee.dueDate ||
    fee.feeDueDate;

  const status =
    fee.status ||
    fee.feeStatus ||
    "Pending";

  const paymentSubmitted =
    Boolean(
      fee.paymentSubmitted
    );

  const isPaid =
    status === "Paid";

  const isSubmitted =
    paymentSubmitted &&
    !isPaid;

  // =====================================================
  // PAYMENT SCREENSHOT URL
  // =====================================================

  let paymentProofUrl = "";

  if (fee.paymentScreenshot) {
    let screenshotPath =
      fee.paymentScreenshot;

    if (
      screenshotPath.startsWith(
        "http://"
      ) ||
      screenshotPath.startsWith(
        "https://"
      )
    ) {
      paymentProofUrl =
        screenshotPath;
    } else {
      screenshotPath =
        screenshotPath.replace(
          /\\/g,
          "/"
        );

      if (
        screenshotPath.startsWith(
          "/"
        )
      ) {
        paymentProofUrl =
          `${SERVER_URL}${screenshotPath}`;
      } else {
        paymentProofUrl =
          `${SERVER_URL}/${screenshotPath}`;
      }
    }
  }

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not Set";
    }

    const formattedDate =
      new Date(date);

    if (
      Number.isNaN(
        formattedDate.getTime()
      )
    ) {
      return "Not Set";
    }

    return formattedDate.toLocaleDateString(
      "en-GB"
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="student-fee-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="student-fee-header">

        <div className="student-fee-icon">
          <FaMoneyBillWave />
        </div>

        <div>
          <h1>
            My Fee
          </h1>

          <p>
            View your course fee and
            payment information.
          </p>
        </div>

      </div>

      {/* =================================================
          FEE CARD
      ================================================= */}

      <div className="student-fee-card">

        <div className="fee-course">
          <span>
            Course
          </span>

          <h2>
            {course}
          </h2>
        </div>

        <div className="fee-amount-box">
          <span>
            Total Fee
          </span>

          <strong>
            Rs.{" "}
            {amount.toLocaleString()}
          </strong>
        </div>

        <div className="fee-details">

          <div>
            <FaCalendarAlt />

            <span>
              Due Date
            </span>

            <strong>
              {formatDate(dueDate)}
            </strong>
          </div>

          <div>
            <FaReceipt />

            <span>
              Status
            </span>

            {isPaid ? (
              <strong className="paid-text">
                <FaCheckCircle />
                Paid
              </strong>
            ) : isSubmitted ? (
              <strong className="submitted-text">
                <FaReceipt />
                Payment Submitted
              </strong>
            ) : (
              <strong className="pending-text">
                <FaClock />
                Pending
              </strong>
            )}
          </div>

        </div>
      </div>

      {/* =================================================
          PAYMENT ACCOUNT
      ================================================= */}

      {!isPaid &&
        fee.accountNumber && (
          <div className="payment-account-card">

            <div className="payment-account-icon">
              <FaUniversity />
            </div>

            <div className="payment-account-content">

              <span>
                Payment Account Number
              </span>

              <strong>
                {fee.accountNumber}
              </strong>

              <small>
                Send your fee to this
                account number.
              </small>

            </div>

            <button
              type="button"
              className="copy-account-btn"
              onClick={
                copyAccountNumber
              }
            >
              <FaCopy />
              Copy
            </button>

          </div>
        )}

      {/* =================================================
          ACCOUNT NOT SET
      ================================================= */}

      {!isPaid &&
        amount > 0 &&
        !fee.accountNumber && (
          <div className="fee-account-warning">

            <FaClock />

            <div>
              <h3>
                Payment Account Not Set
              </h3>

              <p>
                Admin has not added the
                payment account number yet.
                Please check again later.
              </p>
            </div>

          </div>
        )}

      {/* =================================================
          PAID
      ================================================= */}

      {isPaid && (
        <div className="fee-success-box">

          <FaCheckCircle />

          <div>

            <h3>
              Payment Verified
            </h3>

            <p>
              Your fee has been
              successfully verified
              by the admin.
            </p>

            {fee.paymentDate && (
              <small>
                Payment Date:{" "}
                {formatDate(
                  fee.paymentDate
                )}
              </small>
            )}

            {fee.paymentMethod && (
              <small>
                Payment Method:{" "}
                {fee.paymentMethod}
              </small>
            )}

            {fee.transactionId && (
              <small>
                Transaction ID:{" "}
                {fee.transactionId}
              </small>
            )}

            {fee.paymentScreenshot &&
              paymentProofUrl && (
                <a
                  href={
                    paymentProofUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-payment-proof"
                >
                  <FaEye />
                  View Payment Screenshot
                </a>
              )}

          </div>

        </div>
      )}

      {/* =================================================
          PAYMENT SUBMITTED
      ================================================= */}

      {isSubmitted && (
        <div className="fee-submitted-box">

          <FaClock />

          <div>

            <h3>
              Payment Waiting
            </h3>

            <p>
              Your payment has been
              submitted and is waiting
              for admin verification.
            </p>

            {fee.paymentMethod && (
              <small>
                Payment Method:{" "}
                {fee.paymentMethod}
              </small>
            )}

            {fee.transactionId && (
              <small>
                Transaction ID:{" "}
                {fee.transactionId}
              </small>
            )}

            {fee.paymentScreenshot &&
              paymentProofUrl && (
                <a
                  href={
                    paymentProofUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-payment-proof"
                >
                  <FaEye />
                  View Uploaded Screenshot
                </a>
              )}

          </div>

        </div>
      )}

      {/* =================================================
          PAYMENT FORM
      ================================================= */}

      {!isPaid &&
        !isSubmitted &&
        amount > 0 &&
        fee.accountNumber && (

          <div className="payment-form-card">

            <div className="payment-form-header">

              <h2>
                Submit Payment
              </h2>

              <p>
                Pay your fee and upload
                your payment screenshot
                for verification.
              </p>

            </div>

            {/* =================================================
                INSTRUCTIONS
            ================================================= */}

            <div className="payment-instructions">

              <h3>
                Payment Instructions
              </h3>

              <div className="instruction-account">

                <FaUniversity />

                <div>

                  <span>
                    Send payment to:
                  </span>

                  <strong>
                    {fee.accountNumber}
                  </strong>

                </div>

              </div>

              <p>
                1. Send the exact fee
                amount shown above.
              </p>

              <p>
                2. Select your payment
                method.
              </p>

              <p>
                3. Take a screenshot
                after successful payment.
              </p>

              <p>
                4. Enter your transaction
                ID.
              </p>

              <p>
                5. Upload the payment
                screenshot.
              </p>

            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={
                handlePaymentSubmit
              }
            >

              {/* PAYMENT METHOD */}

              <div className="payment-form-group">

                <label>
                  Payment Method
                </label>

                <select
                  value={
                    paymentMethod
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                  required
                >

                  <option value="">
                    Select Payment Method
                  </option>

                  <option value="Easypaisa">
                    Easypaisa
                  </option>

                  <option value="JazzCash">
                    JazzCash
                  </option>

                  <option value="Bank Transfer">
                    Bank Transfer
                  </option>

                </select>

              </div>

              {/* TRANSACTION ID */}

              <div className="payment-form-group">

                <label>
                  Transaction ID
                </label>

                <input
                  type="text"
                  placeholder="Enter transaction ID"
                  value={
                    transactionId
                  }
                  onChange={(e) =>
                    setTransactionId(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              {/* PAYMENT SCREENSHOT */}

              <div className="payment-form-group">

                <label>
                  Payment Screenshot
                </label>

                <div className="payment-upload-box">

                  <FaUpload />

                  <input
                    id="paymentProofInput"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleFileChange
                    }
                  />

                  <p>
                    Upload Payment
                    Screenshot
                  </p>

                  <small>
                    JPG, PNG or WEBP
                    {" • "}
                    Maximum 5 MB
                  </small>

                </div>

                {/* SELECTED FILE */}

                {paymentProof && (
                  <div className="selected-payment-file">

                    <FaImage />

                    <div>

                      <strong>
                        {paymentProof.name}
                      </strong>

                      <small>
                        {(
                          paymentProof.size /
                          1024 /
                          1024
                        ).toFixed(2)}
                        {" "}
                        MB
                      </small>

                    </div>

                    <button
                      type="button"
                      onClick={
                        removePaymentProof
                      }
                      title="Remove file"
                    >
                      <FaTimes />
                    </button>

                  </div>
                )}

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={submitting}
              >

                <FaCheck />

                {submitting
                  ? "Uploading..."
                  : "Submit Payment"}

              </button>

            </form>

          </div>
        )}

      {/* =================================================
          FEE NOT SET
      ================================================= */}

      {!isPaid &&
        !isSubmitted &&
        amount <= 0 && (

          <div className="fee-waiting-box">

            <FaClock />

            <div>

              <h3>
                Fee Not Set Yet
              </h3>

              <p>
                Admin has not set your
                course fee yet. Please
                check again later.
              </p>

            </div>

          </div>
        )}

    </div>
  );
};

export default Fee;