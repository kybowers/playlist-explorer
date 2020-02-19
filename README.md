A music data export tool built with Electron and React.

Development will be sporadic. 

To run development: `yarn electron-dev`

To build portable app: `yarn electron-pack`

Planned features and known defects:

- Need to validate API response contains all data before rendering to prevent crashes
- Fetch more than the default 20 playlists
- Fetch more than the default 100 tracks
- Include data from track api in csv export
- Users might want to refresh
- Auth token need to be stored somewhere secure and semi-persistant
- CSV generation may not guarantee order
- Home/Login page should be more presentable
- Smooth animations for selecting playlist
- Data select tool for exporting data
- Create app bar and remove frame
