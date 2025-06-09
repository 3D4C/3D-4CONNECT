// Import Firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function signIn(auth) {
  let result;
  const email = document.getElementById("signInMail").value;
  const password = document.getElementById("signInPassword").value;

  // Check if a user with the provided credentials exists
  await signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      result = "";
    })
    .catch((error) => {
      result = extractFirebaseError(error.code);
    });
  return result;
}

export async function signUp(auth, db) {
  let result;
  const username = document.getElementById("signUpUsername").value;
  const email = document.getElementById("signUpMail").value;
  const password = document.getElementById("signUpPassword").value;

  // Creates a new user account
  await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        score: 1000,
        games: [],
        currentMatch: null,
      });
    })
    .then(() => {
      result = "";
    })
    .catch((error) => {
      result = extractFirebaseError(error.code);
    });

  return result;
}

export async function getUserData(db, user) {
  let userDocument = await getDoc(doc(db, "users", user.uid));

  if (userDocument.exists()) {
    let userData = userDocument.data();
    userData.rank = getRank(userData.score);

    // Creating custom game objects. Used for account page
    let games = [];
    for (let i = 0; i < userData.games.length; i++) {
      const gameDocument = await getDoc(doc(db, "games", userData.games[i]));
      if (gameDocument.exists()) {
        const isPlayer1 = user.uid === gameDocument.data().player_1_ID;

        const opponentId = isPlayer1 ? gameDocument.data().player_2_ID : gameDocument.data().player_1_ID;
        const opponentDocument = await getDoc(doc(db, "users", opponentId));

        let gameObject = {
          player_1: isPlayer1 ? userDocument.data().username : opponentDocument.data().username,
          player_1_ID: gameDocument.data().player_1_ID,
          player_1_score: gameDocument.data().player_1_score,
          player_2: !isPlayer1 ? userDocument.data().username : opponentDocument.data().username,
          player_2_ID: gameDocument.data().player_2_ID,
          player_2_score: gameDocument.data().player_2_score,
          winner: gameDocument.data().winner,
          timestamp: gameDocument.data().timestamp,
        };

        games.push(gameObject);
      }
    }

    // Sorting games by timestamp so that newest games are displayed first
    games.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

    return [userData, games];
  }
}

export async function logOut(auth) {
  signOut(auth).catch((error) => {
    console.log("Logout failed: " + error);
  });
}

function extractFirebaseError(error) {
  let errorMessage = error.substring(5, error.length).replace("-", " ");
  errorMessage = errorMessage[0].toUpperCase() + errorMessage.substring(1, errorMessage.length);
  console.warn("Login failed: " + errorMessage);
  return errorMessage;
}

export function getRank(score, actorName) {
  let rankDict = require("../settings/ranks.json");
  if (actorName === "Agent"){
    return "Agent";
  }
  if (actorName === "Player"){
    return "Guest";
  }

  for (const [key, value] of Object.entries(rankDict)) {
    if (score >= value[0] && score <= value[1]) {
      return key;
    }
  }
}

export function getProgress(score) {
  let rankDict = require("../settings/ranks.json");

  for (const [key, value] of Object.entries(rankDict)) {
    if (score >= value[0] && score <= value[1]) {
      if (value[0] === 0 || value[0] === 9999) {
        return 0;
      }
      let progress = ((score - value[0]) / (value[1] - value[0])) * 100;
      return parseFloat(progress.toFixed(2));
    }
  }
}
