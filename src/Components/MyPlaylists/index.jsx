import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';

import PlaylistCard from '../PlaylistCard';
import apiService from '../../Services/apiService';


const MyPlaylists = props => {
    const [playlists, setPlaylists] = useState(null);

    useEffect(() => {
        const handleGetData = async () => {
            const response = await apiService.get('https://api.spotify.com/v1/me/playlists');
            const json = await response.json();
            setPlaylists(json);
        }
        handleGetData();
    }, []);

    return (
        <Grid container spacing={2}>
            {playlists && playlists.items ? 
            playlists.items.map(item => 
                <Grid item xs={3} key={item.id}>
                    <PlaylistCard playlist={item} />
                </Grid>)
            : <Grid item>
                No Data
            </Grid>}
        </Grid>);
}

export default MyPlaylists;