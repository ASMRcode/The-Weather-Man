import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, TextField, List, ListItem, ListItemText } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  card: {
    width: '100%',
    maxWidth: 600,
    boxShadow: theme.shadows[5],
  },
  content: {
    paddingTop: theme.spacing(2),
  },
  searchInput: {
    marginBottom: theme.spacing(2),
  },
  musicList: {
    maxHeight: 300, // Set a maximum height for the music list
    overflowY: 'auto', // Add a vertical scrollbar when content exceeds max height
  },
  musicItem: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.spacing(1),
    backgroundColor: '#f1f1f1',
    padding: theme.spacing(2),
  },
  musicImage: {
    width: 80,
    height: 80,
    marginRight: theme.spacing(2),
    objectFit: 'cover',
  },
  duration: {
    marginLeft: 'auto',
  },
}));

const MusicPage = () => {
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    // Replace 'YOUR_LASTFM_API_KEY' with your actual Last.fm API key
    const apiKey = '14f487a1a4f5c8b6aee343444de0ddec';
    const lastfmApiUrl = `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${searchQuery}&api_key=${apiKey}&format=json`;

    fetch(lastfmApiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results.trackmatches && data.results.trackmatches.track) {
          const tracksWithImages = data.results.trackmatches.track.map((track) => ({
            ...track,
            image: track.image && track.image.find((img) => img.size === 'medium')['#text'],
          }));
          setSearchResults(tracksWithImages);
        }
      })
      .catch((error) => {
        console.error('Error fetching music data:', error);
      });
  };

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <Typography variant="h5" component="h2">
            Music Player
          </Typography>
          <TextField
            className={classes.searchInput}
            label="Search for a song or artist"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                handleSearchSubmit();
              }
            }}
            fullWidth
          />

          <List className={classes.musicList}>
            {searchResults.map((track) => (
              <ListItem key={track.mbid} className={classes.musicItem}>
                {track.image && track.image !== '' ? (
                  <img src={track.image} alt={track.name} className={classes.musicImage} />
                ) : (
                  <div className={classes.musicImage} /> // Placeholder or default image
                )}
                <ListItemText primary={track.name} secondary={track.artist} />
                <Typography variant="body2" color="textSecondary" className={classes.duration}>
                  {Math.floor(Math.random() * 5) + 2}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}
                </Typography>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicPage;
