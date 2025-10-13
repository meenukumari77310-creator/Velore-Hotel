// src/components/FormComponent.jsx
import React from "react";

export const FormSelect = ({ name, label, value, onChange, options = [], required }) => (
  <div className="mb-3">
    <label htmlFor={name} className="form-label">{label}</label>
    <select
      className="form-select"
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      required={required}
    >
      <option value="">-- Select --</option>
      {options.map((opt, i) => (
        <option key={i} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// Other components remain unchanged
export const FormInput = ({ name, label, value, onChange, type = "text", required }) => (
  <div className="mb-3">
    <label htmlFor={name} className="form-label">{label}</label>
    <input
      type={type}
      className="form-control"
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

export const FormTextArea = ({ name, label, value, onChange }) => (
  <div className="mb-3">
    <label htmlFor={name} className="form-label">{label}</label>
    <textarea
      className="form-control"
      name={name}
      id={name}
      rows="3"
      value={value}
      onChange={onChange}
    />
  </div>
);

export const FormFileInput = ({ name, label, onChange }) => (
  <div className="mb-3">
    <label htmlFor={name} className="form-label">{label}</label>
    <input
      type="file"
      className="form-control"
      name={name}
      id={name}
      onChange={onChange}
      accept="image/*"
    />
  </div>
);
