import { React } from "react";
import ReactDOM from "react-dom/client";

// App Component
import App from "./App";

// CSS
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

import "./css/style.css";
import "./css/index.css";
import "./css/header.css";
import "./css/footer.css";
import "./css/singleplayer.css";
import "./css/multiplayer.css";
import "./css/account.css";
import "./css/bootloader.css";
import "./css/game.css";
import "./css/home.css";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
