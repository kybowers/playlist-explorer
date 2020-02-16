import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import clsx from "clsx";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";

import apiService from "../../Services/apiService";

const useStyles = makeStyles({
  media: {
    height: 275
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto"
  },
  expandOpen: {
    transform: "rotate(180deg)"
  }
});

const PlaylistCard = props => {
  const { playlist, token } = props;
  const [playlistData, setPlaylistData] = useState(null);
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const handleGetData = async () => {
      const response = await apiService.get(token, `https://api.spotify.com/v1/playlists/${playlist.id}`);
      const json = await response.json();
      setPlaylistData(json);
    };
    handleGetData();
  }, []);

  console.log(playlistData);

  return (
    <Card>
      <CardMedia
        className={classes.media}
        image={playlist.images[0].url}
        //   title="Contemplative Reptile"
      />
      <CardContent>{playlist.name}</CardContent>
      <CardActions disableSpacing>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {playlistData &&
            playlistData.tracks &&
            playlistData.tracks.items &&
            playlistData.tracks.items.map(item => <div key={item.track.id}>{item.track.name}</div>)}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default PlaylistCard;
