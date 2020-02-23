import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import PlaylistCard from "../PlaylistCard";
import apiService from "../../Services/apiService";

const MyPlaylists = props => {
  const { token } = props;
  const [playlists, setPlaylists] = useState([]);
  const [total, setTotal] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleGetData = async () => {
      const response = await apiService.get(
        token,
        `https://api.spotify.com/v1/me/playlists?offset=${scrollPosition}&limit=1`
      );
      const json = await response.json();
      setTotal(json.total);
      setPlaylists(playlists => [...playlists, ...json.items]);
    };
    handleGetData();
  }, [token, scrollPosition]);

  return (
    <>
      <Grid container spacing={2}>
        {playlists.map(item => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            <PlaylistCard playlist={item} token={token} />
          </Grid>
        ))}
      </Grid>
      {total && total > playlists.length && (
        // TODO trigger load more on scroll, no button necessary
        <Button onClick={() => setScrollPosition(scrollPosition => scrollPosition + 1)}>Load More</Button>
      )}
    </>
  );
};

export default MyPlaylists;
