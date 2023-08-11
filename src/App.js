import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, makeStyles } from '@material-ui/core';
import WeatherPage from './WeatherPage';
import NewsPage from './NewsPage';
import MusicPage from './MusicPage';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#3f51b5',
    marginBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    marginRight: theme.spacing(2),
    '&:hover': {
      color: '#ff5722',
    },
  },
  activeLink: {
    color: '#ff5722',
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <Router>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Link to="/" className={classes.link}>
            <Typography variant="h6">Weather</Typography>
          </Link>
          <Link to="/news" className={classes.link}>
            <Typography variant="h6">News</Typography>
          </Link>
          <Link to="/music" className={classes.link}>
            <Typography variant="h6">Music</Typography>
          </Link>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Routes>
          <Route path="/" element={<WeatherPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/music" element={<MusicPage />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
