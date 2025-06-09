// Import React
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Import pages
import Bootloader from "./pages/Bootloader";
import Home from "./pages/Home";
import Singleplayer from "./pages/Singleplayer";
import SingleplayerGame from "./pages/SingleplayerGame";
import Errors from "./pages/Errors";

// Import Components
import HeaderNav from "./components/HeaderNav";
import FooterNav from "./components/FooterNav";

const App = () => {
  // var backgroundMusic = new Howl({
  //   src: [backgroundMusicTrack],
  //   loop: true,
  //   volume: 0.3,
  // });

  useEffect(() => {
    let spinner = document.getElementById("spinner");
    spinner.className = "spinner-border ms-auto hide";
  }, []);

  return (
    <>
      <BrowserRouter>
        <div className="wrapper">
          <HeaderNav/>
          <Routes>
            <Route path="/" element={<Bootloader/>} />
            <Route path="/home" element={<Home/>} />
            <Route path="/singleplayer" element={<Singleplayer />} />
            <Route path="/singleplayerGame" element={<SingleplayerGame />} />
            {/* <Route path="/register" element={<Register firebase={firebase} />} />
            <Route path="/account" element={<Account firebase={firebase} />} />
            <Route path="/login" element={<Login firebase={firebase} />} /> */}
            <Route path="*" element={<Errors />} />
          </Routes>
          <FooterNav />
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
