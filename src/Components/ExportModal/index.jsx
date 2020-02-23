import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { remote } from "electron";
import fs from "fs";

import apiService from "../../Services/apiService";

const zip = (a1, a2) => a1.map((element, index) => ({...element, ...a2[index]}));

const getValuesFromTrack = track => ({
  name: track.name,
  popularity: track.popularity,
  albumName: track.album.name
})

const convertToCSV = objArray => {
  const array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  let str = Object.keys(objArray[0]).join(",") + "\r\n";
  for (let i = 0; i < array.length; i++) {
    let line = "";
    for (let index in array[i]) {
      if (line !== "") line += ",";
      line += array[i][index];
    }
    str += line + "\r\n";
  }

  return str;
};

const generateQueryPairs = total => {
  let pairs = [];
  const limit = 2;
  let offset = 0;
  while (total > 0) {
    if (total > limit) {
      pairs = [...pairs, [offset, limit]]
    } else {
      pairs = [...pairs, [offset, total]]
    }
    total -= limit;
    offset += limit;
  }
  return pairs;
};

const getAllPlaylistTracks = async (token, playlistData) => {
  // Get all playlist tracks
  const trackResponses = await Promise.all(
    generateQueryPairs(playlistData.tracks.total).map(([offset, limit]) =>
      apiService.get(
        token,
        `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks?offset=${offset}&limit=${limit}`
      )
    )
  );
  const trackLists = await Promise.all(trackResponses.map(trackResponse => trackResponse.json()));
  const tracks = trackLists.reduce((accumulator, current) => [...accumulator, ...current.items], []);

  // Get features for all tracks
  const featuresResponse = await Promise.all(
    tracks.map(item => apiService.get(token, `https://api.spotify.com/v1/audio-features/${item.track.id}`))
  );
  const features =await Promise.all(featuresResponse.map(response => response.json()));
  return zip(tracks.map(track => (getValuesFromTrack({...track.track}))), features);
};

const ExportContent = props => {
  const { token, handleClose, playlistData } = props;
  const [working, setWorking] = useState(false);

  const handleExport = async () => {
    setWorking(true);
    if (!playlistData || !playlistData.tracks) {
      // TODO fail handle
      handleClose();
    }

    // Get audio features, and give user save dialog
    const [trackFeatures, filePathResponse] = await Promise.all([
      getAllPlaylistTracks(token, playlistData),
      remote.dialog.showSaveDialog(null, {
        defaultPath: playlistData.name,
        filters: [{ name: "CSV (.csv)", extensions: ["csv"] }]
      })
    ]);
    // Build and export CSV
    const csvBody = convertToCSV(trackFeatures);
    if (!filePathResponse.canceled) {
      fs.writeFile(filePathResponse.filePath, csvBody, err => {
        if (err) throw err;
      });
      console.log("Saved!");
      handleClose();
    } else {
      setWorking(false);
    }
  };

  return (
    <>
      <DialogTitle id="export-modal-title">Export Audio Features to CSV</DialogTitle>
      <DialogContent>
        {working ? (
          <LinearProgress />
        ) : (
          <DialogContentText>
            You are about to export the audio features for <b>{playlistData.name}</b> to a csv file.
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleExport} color="primary" autoFocus>
          Export
        </Button>
      </DialogActions>
    </>
  );
};

const ExportDialog = props => {
  const { open, handleClose } = props;

  return (
    <Dialog open={open} onClose={handleClose} aira-labelledby="export-modal-title">
      <ExportContent {...props} />
    </Dialog>
  );
};

export default ExportDialog;
