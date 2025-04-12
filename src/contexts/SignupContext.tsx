import React, { createContext, useContext, useState, ReactNode } from "react";

type SignUpData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  points: number;
};

type SignUpContextType = {
  signUpData: SignUpData;
  setSignUpData: (data: Partial<SignUpData>) => void;
  resetSignUpData: () => void;
};

const defaultData: SignUpData = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  points: 0,
};

const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

export const SignUpProvider = ({ children }: { children: ReactNode }) => {
  const [signUpData, setSignUpState] = useState<SignUpData>(defaultData);

  const setSignUpData = (data: Partial<SignUpData>) => {
    setSignUpState((prev) => ({ ...prev, ...data }));
  };

  const resetSignUpData = () => {
    setSignUpState(defaultData);
  };

  return (
    <SignUpContext.Provider
      value={{ signUpData, setSignUpData, resetSignUpData }}
    >
      {children}
    </SignUpContext.Provider>
  );
};

export const useSignUp = (): SignUpContextType => {
  const context = useContext(SignUpContext);
  if (!context) {
    throw new Error("useSignUp must be used within a SignUpProvider");
  }
  return context;
};
