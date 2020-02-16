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

const ExportContent = props => {
  const { token, handleClose, playlistName, playlistData } = props;
  const [working, setWorking] = useState(false);

  const handleExport = async () => {
    setWorking(true);
    if (!playlistData || !playlistData.tracks || !playlistData.tracks.items) {
      // TODO fail handle
      handleClose();
    }
    const featuresResponse = await Promise.all(
      playlistData.tracks.items.map(item =>
        apiService.get(token, `https://api.spotify.com/v1/audio-features/${item.track.id}`)
      )
    );
    const featuresList = await Promise.all(featuresResponse.map(response => response.json()));
    const csvBody = convertToCSV(featuresList);
    const filePathResponse = await remote.dialog.showSaveDialog(null, {
      defaultPath: playlistName,
      filters: [{ name: "CSV (.csv)", extensions: ["csv"] }]
    });
    if (!filePathResponse.canceled) {
      fs.writeFile(filePathResponse.filePath, csvBody, err => {
        if (err) throw err;
        console.log("Saved!");
      });
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
        ) : playlistData ? (
          <>
            <DialogContentText>
              You are about to export the audio features for <b>{playlistName}</b> to a csv file.
            </DialogContentText>
            {/* <TextField
              label="File Name"
              id="export-file-name"
              value={fileName}
              onChange={event => setFileName(event.target.value)}
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">.csv</InputAdornment>
              }}
            /> */}
          </>
        ) : (
          <DialogContentText>Something went wrong, we couldn't find that playlist</DialogContentText>
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
