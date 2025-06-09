import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";

function Multiplayer(props) {
  let navigate = useNavigate();

  const db = props.firebase.db;
  const userId = props.firebase.auth.currentUser.uid;

  useEffect(() => {
    // Enter queue by creating a matchmaking document
    (async () => {
      setDoc(doc(db, "matchmaking", userId), {
        userId: userId,
      });
    })();

    // Listen for updates in users document, successful matchmaking
    const unsubscribeListener = onSnapshot(
      doc(props.firebase.db, "users", props.firebase.auth.currentUser.uid),
      async (userDocument) => {
        if (userDocument.exists() && userDocument.data().currentMatch) {
          navigate("/multiplayerGame/", { state: { gameId: userDocument.data().currentMatch } });
        } else {
          console.log("Player entered matchmaking");
        }
      }
    );

    return () => {
      unsubscribeListener();
      deleteDoc(doc(db, "matchmaking", userId));
    };
  }, []);

  return (
    <div className="expander d-flex justify-content-center align-items-center">
      <div className="centered-box">
        <div className="row d-flex justify-content-center align-items-center py-3">
          <h1 className="text-center">Multiplayer</h1>
        </div>

        <div className="row d-flex justify-content-center align-items-center py-3">Looking for an opponent</div>

        <div className="row d-flex justify-content-center align-items-center py-3">
          <div className="spinner-border matchmaking-spinner" role="status"></div>
        </div>
      </div>
    </div>
  );
}

export default Multiplayer;
