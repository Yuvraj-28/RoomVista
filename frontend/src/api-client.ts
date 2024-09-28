import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn"; // Add this import for SignIn form data

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const register = async (formData: RegisterFormData) => {
  console.log(import.meta.env.VITE_API_BASE_URL)
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  // Check if the response has a valid JSON body
  console.log(response);
  if (!response.ok) {
    const responseBody = await response.json().catch(() => {
      throw new Error("An error occurred while registering");
    });
    throw new Error(responseBody.message || "Registration failed");
  }

  // If the response is OK and has a body, return the parsed JSON
  return response.json().catch(() => {
    return {}; // In case the server does not send any JSON back
  });
};

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  // Handle errors if response is not ok
  if (!response.ok) {
    const body = await response.json().catch(() => {
      throw new Error("An error occurred while signing in");
    });
    throw new Error(body.message || "Login failed");
  }

  return response.json().catch(() => {
    return {}; 
  });
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token invalid");
  }

  return response.json().catch(() => {
    throw new Error("Failed to validate token");
  });
};

export const signOut = async ()=>{
    const response = await fetch('${API_BASE_URL}/api/auth/logout', {
        credentials: "include",
        method: "POST"
    });

    if(!response.ok) {
        throw new Error("Error during sign out");
    }
};