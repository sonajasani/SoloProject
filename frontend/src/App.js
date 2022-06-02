import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Splash from "./components/Splash";
import Discover from "./components/Discover";
import SongPage from "./components/SongPage";
import UploadForm from "./components/UploadForm";
import UserProfile from "./components/UserProfile"

import { getAllSongs } from "./store/songs";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(getAllSongs());
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const songs = useSelector((state) => state.songsRed.songs);
  // console.log(songs);

  return (
    <div id="container">
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <Splash isLoaded={isLoaded} />
          </Route>
          <Route path="/discover">
            <Discover isLoaded={isLoaded} />
          </Route>
          <Route path="/songs/:songId">
            <SongPage isLoaded={isLoaded} />
          </Route>
          <Route path="/upload">
            <Navigation isLoaded={isLoaded} />
            <UploadForm />
          </Route>
          <Route to="profile">
          <Navigation isLoaded={isLoaded} />
            <UserProfile />
          </Route>
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
      )}
    </div>
  );
}

export default App;
