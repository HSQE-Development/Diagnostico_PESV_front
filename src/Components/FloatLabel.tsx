import React, { useState, ReactElement, useEffect, ChangeEvent } from "react";
import { InputProps, Select, SelectProps } from "antd";
import "./index.css";

interface FloatLabelProps {
  label: string;
  children: ReactElement<InputProps | SelectProps>;
  value?: string | number | undefined;
  onChange?: (value: string | number, option?: any) => void;
}

const FloatLabel: React.FC<FloatLabelProps> = ({
  label,
  children,
  value: propValue,
  onChange,
}) => {
  const [focus, setFocus] = useState(false);
  //   const [inputValue, setInputValue] = useState<string | number | undefined>(propValue);
  const initialValue =
    children.props.value !== undefined ? children.props.value : propValue; //Con esto se trae el valor del input o del hijo que proporcionen
  const [inputValue, setInputValue] = useState<string | number | undefined>(
    initialValue
  );
  //   console.log(children.props.value)

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleFocus = () => setFocus(true);
  const handleBlur = () => {
    if (!inputValue || inputValue.toString().trim() === "") {
      setFocus(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement> | any) => {
    const newValue = e.target ? e.target.value : e;
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue); // Llamar al onChange prop con el nuevo valor
    }
  };

  const handleSelectChange = (value: string | number, option: any) => {
    setInputValue(value);
    if (onChange) {
      onChange(value, option); // Llamar al onChange prop con el nuevo valor y opción
    }
  };

  const isFloating =
    focus || (inputValue && inputValue.toString().length !== 0);

  const labelClass = isFloating ? "label label-float" : "label";

  // Clonar el elemento children (Input en este caso) y pasarle las props necesarias
  const childProps = {
    onFocus: handleFocus,
    onBlur: handleBlur,
    onChange: children.type === Select ? handleSelectChange : handleChange,
    value: inputValue,
  };

  return (
    <div className="float-label">
      {React.cloneElement(children, { ...childProps, ...children.props })}
      <label className={labelClass}>{label}</label>
    </div>
  );
};

export default FloatLabel;
