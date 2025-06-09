import { React } from "react";
import { useNavigate } from "react-router-dom";

import { logOut } from "../js/account.js";
import { getRank, getProgress } from "../js/account.js";

import "bootstrap/js/dist/scrollspy.js";

function Account(props) {
  return (
    <div className="expander d-flex justify-content-center align-items-center">
      <div className="centered-box">
        {props.firebase.userData ? <UserStats firebase={props.firebase} /> : <SignInSignUp />}
      </div>
    </div>
  );
}

function getGamesList(props) {
  return (
    <div
      data-bs-spy="scroll"
      data-bs-target="#list-example"
      data-bs-smooth-scroll="true"
      className="scrollspy-example scroll-div"
      tabIndex="0"
    >
      {props.firebase.games.map((game) => (
        <div key={game.timestamp} id={game.timestamp} className="row gamelog-row">
          {getGameText(props, game)}
        </div>
      ))}
    </div>
  );
}

function addLeadingZero(uglyDate) {
  let prettyDate = uglyDate.toString();
  if (prettyDate < 10) {
    prettyDate = `0${prettyDate}`;
  }
  return prettyDate;
}

function getGameText(props, game) {
  const playerId = props.firebase.auth.currentUser.uid;
  const opponentId = playerId === game.player_1_ID ? game.player_2_ID : game.player_1_ID;

  let result = "Draw";
  if (playerId === game.winner) {
    result = "You won!";
  } else if (opponentId === game.winner) {
    result = "You lost.";
  }

  let date = new Date(game.timestamp);
  let dateConverted = `${addLeadingZero(date.getDate())}.${addLeadingZero(
    date.getMonth() + 1
  )}.${date.getFullYear()} ${addLeadingZero(date.getHours())}:${addLeadingZero(date.getMinutes())}`;

  return (
    <>
      <div className="col-4 gamelog-timestamp d-flex justify-content-start align-content-center">{dateConverted}</div>

      <div className="col-5 d-flex justify-content-center align-content-center">
        {game.player_1} ({game.player_1_score}) vs. {game.player_2} ({game.player_2_score})
      </div>

      <div
        className={
          "col-3 d-flex justify-content-end align-content-center " +
          (result === "You won!"
            ? "gamelog-result-won"
            : result === "You lost."
            ? "gamelog-result-lost"
            : "gamelog-result-draw")
        }
      >
        {result}
      </div>
    </>
  );
}

const UserStats = (props) => {
  return (
    <div>
      <div className="row mb-4 user">
        <div className="row">
          <h3>Welcome back, {props.firebase.userData.username}!</h3>
        </div>
      </div>

      <div className="row">
        <div className="col-lg user-stats d-flex align-items-center me-4 mb-4">
          <div>
            <div className="row my-1">
              <span>
                <strong>E-Mail</strong>&nbsp;&nbsp;
                {props.firebase.userData.email}
              </span>
            </div>

            <div className="row my-1">
              <span>
                <strong>Rank</strong>&nbsp;&nbsp; {getRank(props.firebase.userData.score)}
              </span>
            </div>
            <div className="row my-1">
              <span>
                <strong>Score</strong>&nbsp;&nbsp;
                {props.firebase.userData.score}
              </span>
            </div>
          </div>
        </div>

        {/* d-none hides x on all devices, .d-sm-block shows x on small devices and beyond. */}
        <div className="col-lg-auto mb-4 p-0 d-none d-lg-block user-rank">
          <img
            className="rank-image"
            src={require(`../ressources/ranks/${getRank(props.firebase.userData.score)}.png`)}
            alt="rank"
          />
          <div id="rank-progress" style={{ height: getProgress(props.firebase.userData.score) + "%" }}></div>
        </div>
      </div>

      {/* ========== Bootsstrap Scrollspy for game history */}
      <div className="row mb-4">{getGamesList(props)}</div>

      <div className="row">
        <button
          onClick={() => {
            logOut(props.firebase.auth);
          }}
          className="btn"
          type="submit"
          id="btnLogOut"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

const SignInSignUp = () => {
  let navigate = useNavigate();

  return (
    <div>
      <div className="row text-center">
        <h1>Account Menu</h1>
      </div>

      <div className="row">
        <div className="col-md-6 text-center">
          <button
            onClick={() => {
              navigate("/register");
            }}
            className="btn mt-4"
          >
            Register
          </button>
        </div>

        <div className="col-md-6 text-center">
          <button
            onClick={() => {
              navigate("/login");
            }}
            className="btn mt-4"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
