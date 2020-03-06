import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import PlaylistCard from "../PlaylistCard";
import apiService from "../../Services/apiService";

const MyPlaylists = props => {
  const { token } = props;
  const [playlistIds, setPlaylistIds] = useState([]);
  const [total, setTotal] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleGetData = async () => {
      const response = await apiService.get(token, `https://api.spotify.com/v1/me/playlists?offset=${scrollPosition}`);
      const json = await response.json();
      setTotal(json.total);
      setPlaylistIds(playlistIds => [...playlistIds, ...json.items.map(item => item.id)]);
    };
    handleGetData();
  }, [token, scrollPosition]);

  const throwError = () => {
    throw new Error("This was a test");
  };

  return (
    <>
      <Grid container spacing={2}>
        {playlistIds.map(id => (
          <Grid item xs={12} sm={6} md={3} key={id}>
            <PlaylistCard playlistId={id} token={token} />
          </Grid>
        ))}
      </Grid>
      {total && total > playlistIds.length && (
        // TODO trigger load more on scroll, no button necessary
        <Button onClick={() => setScrollPosition(scrollPosition => scrollPosition + 20)}>Load More</Button>
      )}
      <Button onClick={throwError}>Break Something</Button>
    </>
  );
};

export default MyPlaylists;
