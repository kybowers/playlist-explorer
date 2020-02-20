import React, { useState, useEffect } from "react";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import { makeStyles } from "@material-ui/core/styles";

import apiService from "../../Services/apiService";
import { Typography } from "@material-ui/core";
import ExportModal from "../ExportModal";

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

const getPlaylistImage = playlist => {
  if (playlist && playlist.images && playlist.images[0] && playlist.images[0].url) return playlist.images[0].url;
  else return ""; // TODO placeholder image
};

const PlaylistCard = props => {
  const { playlist, token } = props;
  const [playlistData, setPlaylistData] = useState(null);
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [exportOpen, setExportOpen] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleExportClick = () => {
    setExportOpen(!exportOpen);
  };

  useEffect(() => {
    const handleGetData = async () => {
      const response = await apiService.get(token, `https://api.spotify.com/v1/playlists/${playlist.id}`);
      const json = await response.json();
      setPlaylistData(json);
    };
    handleGetData();
  }, [token, playlist.id]);

  return (
    <Card>
      <CardMedia className={classes.media} image={getPlaylistImage(playlist)} />
      <CardContent>{playlist.name}</CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={handleExportClick} aria-label="save">
          <SaveAltIcon />
        </IconButton>
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
            playlistData.tracks.items.map(item => (
              <div key={item.track.id}>
                <Typography display="inline">
                  <b>{item.track.artists[0].name}</b>
                </Typography>
                <Typography display="inline">&nbsp;-&nbsp;</Typography>
                <Typography display="inline">{item.track.name}</Typography>
              </div>
            ))}
        </CardContent>
      </Collapse>
      <ExportModal
        token={token}
        open={exportOpen}
        handleClose={handleExportClick}
        playlistName={playlist.name}
        playlistData={playlistData}
      />
    </Card>
  );
};

export default PlaylistCard;
