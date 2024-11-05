// src/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const startGame = async () => {
  try {
    const response = await axios.post(`${API_URL}/start_game`);
    return response.data;
  } catch (error) {
    console.error("Error starting the game:", error);
    return null;
  }
};

export const playerDraw = async () => {
  try {
    const response = await axios.post(`${API_URL}/player_draw`);
    return response.data;
  } catch (error) {
    console.error("Error drawing card for player:", error);
    return null;
  }
};

export const dealerDraw = async () => {
  try {
    const response = await axios.post(`${API_URL}/dealer_draw`);
    return response.data;
  } catch (error) {
    console.error("Error drawing card for dealer:", error);
    return null;
  }
};

export const endGame = async () => {
  try {
    const response = await axios.post(`${API_URL}/end_game`);
    return response.data;
  } catch (error) {
    console.error("Error ending the game:", error);
    return null;
  }
};

