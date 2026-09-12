import React, { useRef, useEffect } from 'react';

export const OtpInputBoxes = ({ value = '', onChange, disabled = false, onComplete }) => {
  const inputRefs = useRef([]);

  // Split the 6-digit string into an array of 6 items
  const digits = Array(6).fill('').map((_, i) => (value && value[i]) || '');

  useEffect(() => {
    // Auto focus the first empty input or the first one on mount
    const firstEmptyIndex = digits.findIndex((d) => !d);
    const targetIndex = firstEmptyIndex === -1 ? 5 : firstEmptyIndex;
    if (inputRefs.current[targetIndex] && !disabled) {
      inputRefs.current[targetIndex].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const rawChar = e.target.value;
    const cleanDigits = rawChar.replace(/[^0-9]/g, '');

    if (!cleanDigits) {
      // User deleted character
      const newDigits = [...digits];
      newDigits[index] = '';
      const newVal = newDigits.join('');
      onChange(newVal);
      return;
    }

    // Handle single digit input
    const char = cleanDigits.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    const newVal = newDigits.join('');
    onChange(newVal);

    // Auto advance to next input if available
    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }

    // Trigger onComplete if full 6 digits filled
    if (newVal.length === 6 && onComplete) {
      onComplete(newVal);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0 && inputRefs.current[index - 1]) {
        // Current box is empty, move back and clear previous
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
        inputRefs.current[index - 1].focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const cleanPaste = pasteData.replace(/[^0-9]/g, '').slice(0, 6);

    if (cleanPaste) {
      const newDigits = Array(6).fill('').map((_, i) => cleanPaste[i] || '');
      const newVal = newDigits.join('');
      onChange(newVal);

      // Focus appropriate box
      const nextFocus = Math.min(cleanPaste.length, 5);
      if (inputRefs.current[nextFocus]) {
        inputRefs.current[nextFocus].focus();
      }

      if (cleanPaste.length === 6 && onComplete) {
        onComplete(cleanPaste);
      }
    }
  };

  return (
    <div className="otp-six-grid" onPaste={handlePaste}>
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onFocus={(e) => e.target.select()}
          className={`otp-digit-box ${digit ? 'filled' : ''}`}
          aria-label={`Digit ${idx + 1}`}
        />
      ))}
    </div>
  );
};
