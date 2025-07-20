/**
 * Professional Calculator Application
 * Features: Basic arithmetic, keyboard support, visual feedback, error handling
 */

class Calculator {
  constructor() {
    this.previousOperandElement = document.getElementById("previousOperand");
    this.currentOperandElement = document.getElementById("currentOperand");
    this.displayElement = document.getElementById("display");
    this.clear();
    this.bindEvents();
  }

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Button click events
    document.addEventListener("click", (e) => {
      this.handleButtonClick(e);
    });

    // Keyboard support
    document.addEventListener("keydown", (e) => {
      this.handleKeyPress(e);
    });

    // Prevent context menu on long press for mobile
    document.addEventListener("contextmenu", (e) => {
      if (e.target.classList.contains("btn")) {
        e.preventDefault();
      }
    });
  }

  /**
   * Handle button click events with visual feedback
   * @param {Event} e - Click event
   */
  handleButtonClick(e) {
    const button = e.target;

    if (!button.classList.contains("btn")) return;

    // Add click animation
    this.addClickAnimation(button);

    // Handle different button types
    if (button.matches("[data-number]")) {
      this.appendNumber(button.dataset.number);
      this.updateDisplay();
    }

    if (button.matches('[data-action="operator"]')) {
      this.chooseOperation(button.dataset.operator);
      this.updateDisplay();
    }

    if (button.matches('[data-action="equals"]')) {
      this.compute();
      this.updateDisplay();
    }

    if (button.matches('[data-action="clear"]')) {
      this.clear();
      this.updateDisplay();
    }

    if (button.matches('[data-action="delete"]')) {
      this.delete();
      this.updateDisplay();
    }

    if (button.matches('[data-action="decimal"]')) {
      this.appendNumber(".");
      this.updateDisplay();
    }
  }

  /**
   * Handle keyboard input events
   * @param {Event} e - Keyboard event
   */
  handleKeyPress(e) {
    let button = null;

    // Number keys
    if (e.key >= "0" && e.key <= "9") {
      button = document.querySelector(`[data-number="${e.key}"]`);
      this.appendNumber(e.key);
      this.updateDisplay();
    }

    // Decimal point
    if (e.key === ".") {
      button = document.querySelector('[data-action="decimal"]');
      this.appendNumber(".");
      this.updateDisplay();
    }

    // Operators
    if (e.key === "+" || e.key === "-") {
      button = document.querySelector(`[data-operator="${e.key}"]`);
      this.chooseOperation(e.key);
      this.updateDisplay();
    }

    if (e.key === "*") {
      button = document.querySelector('[data-operator="×"]');
      this.chooseOperation("×");
      this.updateDisplay();
    }

    if (e.key === "/") {
      e.preventDefault();
      button = document.querySelector('[data-operator="÷"]');
      this.chooseOperation("÷");
      this.updateDisplay();
    }

    // Equals
    if (e.key === "Enter" || e.key === "=") {
      button = document.querySelector('[data-action="equals"]');
      this.compute();
      this.updateDisplay();
    }

    // Clear
    if (e.key === "Escape") {
      button = document.querySelector('[data-action="clear"]');
      this.clear();
      this.updateDisplay();
    }

    // Delete/Backspace
    if (e.key === "Backspace") {
      button = document.querySelector('[data-action="delete"]');
      this.delete();
      this.updateDisplay();
    }

    // Add keyboard press animation
    if (button) {
      this.addKeyboardAnimation(button);
    }
  }

  /**
   * Add click animation to button
   * @param {HTMLElement} button - Button element
   */
  addClickAnimation(button) {
    // Remove existing animations
    button.classList.remove("btn-clicked", "btn-pressed");

    // Force reflow to ensure class removal takes effect
    button.offsetHeight;

    // Add click animation
    button.classList.add("btn-clicked");

    // Add pressed glow for operator buttons
    if (
      button.classList.contains("btn-operator") ||
      button.classList.contains("btn-equals")
    ) {
      button.classList.add("btn-pressed");
    }

    // Remove animation classes after animation completes
    setTimeout(() => {
      button.classList.remove("btn-clicked", "btn-pressed");
    }, 300);
  }

  /**
   * Add keyboard press animation
   * @param {HTMLElement} button - Button element
   */
  addKeyboardAnimation(button) {
    button.classList.add("keyboard-pressed");
    this.addClickAnimation(button);

    setTimeout(() => {
      button.classList.remove("keyboard-pressed");
    }, 150);
  }

  /**
   * Clear all calculator state
   */
  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
  }

  /**
   * Delete last entered digit
   */
  delete() {
    if (this.currentOperand === "Error") {
      this.clear();
      return;
    }

    if (this.currentOperand.length === 1) {
      this.currentOperand = "0";
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
  }

  /**
   * Append number to current operand
   * @param {string} number - Number to append
   */
  appendNumber(number) {
    if (this.currentOperand === "Error") {
      this.clear();
    }

    // Prevent multiple decimal points
    if (number === "." && this.currentOperand.includes(".")) return;

    // Replace 0 with new number (except for decimal)
    if (this.currentOperand === "0" && number !== ".") {
      this.currentOperand = number;
    } else {
      this.currentOperand += number;
    }
  }

  /**
   * Choose mathematical operation
   * @param {string} operation - Operation symbol
   */
  chooseOperation(operation) {
    if (this.currentOperand === "Error") return;

    // Handle negative numbers
    if (this.currentOperand === "" && operation === "-") {
      this.currentOperand = "-";
      return;
    }

    // Compute previous operation if exists
    if (this.previousOperand !== "") {
      this.compute();
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }

  /**
   * Perform calculation
   */
  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    try {
      switch (this.operation) {
        case "+":
          computation = prev + current;
          break;
        case "-":
          computation = prev - current;
          break;
        case "×":
          computation = prev * current;
          break;
        case "÷":
          if (current === 0) {
            throw new Error("Division by zero");
          }
          computation = prev / current;
          break;
        default:
          return;
      }

      // Handle floating point precision issues
      if (computation.toString().length > 12) {
        if (Number.isInteger(computation)) {
          computation = computation.toString();
        } else {
          computation = parseFloat(computation.toPrecision(12)).toString();
        }
      }

      this.currentOperand = computation.toString();
      this.operation = undefined;
      this.previousOperand = "";

      // Flash effect for successful calculation
      this.displayElement.classList.add("flash");
      setTimeout(() => {
        this.displayElement.classList.remove("flash");
      }, 600);
    } catch (error) {
      this.handleError();
    }
  }

  /**
   * Handle calculation errors
   */
  handleError() {
    this.currentOperand = "Error";
    this.previousOperand = "";
    this.operation = undefined;

    // Error animation
    this.displayElement.classList.add("error");
    setTimeout(() => {
      this.displayElement.classList.remove("error");
    }, 500);
  }

  /**
   * Format number for display with proper localization
   * @param {string} number - Number to format
   * @returns {string} - Formatted number
   */
  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];

    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  /**
   * Update the calculator display
   */
  updateDisplay() {
    // Handle error state
    if (this.currentOperand === "Error") {
      this.currentOperandElement.textContent = "Error";
      this.previousOperandElement.textContent = "";
      return;
    }

    // Update current operand display
    this.currentOperandElement.textContent = this.getDisplayNumber(
      this.currentOperand
    );

    // Update previous operand and operation display
    if (this.operation != null) {
      this.previousOperandElement.textContent = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandElement.textContent = "";
    }
  }
}

/**
 * Utility functions for enhanced user experience
 */
const CalculatorUtils = {
  /**
   * Add haptic feedback on supported devices
   */
  addHapticFeedback: () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
  },

  /**
   * Prevent zoom on double tap for mobile
   */
  preventZoom: () => {
    document.addEventListener(
      "touchend",
      (e) => {
        const now = new Date().getTime();
        if (now - this.lastTouchEnd <= 300) {
          e.preventDefault();
        }
        this.lastTouchEnd = now;
      },
      false
    );
  },
};

// Initialize calculator when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const calculator = new Calculator();

  // Add utility features
  CalculatorUtils.preventZoom();

  // Add haptic feedback to all button clicks
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn")) {
      CalculatorUtils.addHapticFeedback();
    }
  });

  console.log("Professional Calculator initialized successfully!");
});
