import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Link, IconButton, Box } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import RefreshIcon from '@material-ui/icons/Refresh';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    maxHeight: '800px', // Set a max height for the container
    overflowY: 'auto', // Add a vertical scrollbar when content exceeds max height
  },
  card: {
    width: '100%',
    maxWidth: 600,
    boxShadow: theme.shadows[5],
  },
  content: {
    paddingTop: theme.spacing(2),
  },
  newsItem: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[3],
    backgroundColor: '#ffffff',
  },
  newsImage: {
    width: 120,
    height: 80,
    marginRight: theme.spacing(2),
    objectFit: 'cover',
  },
  refreshButton: {
    marginLeft: 'auto',
  },
}));

const NewsPage = () => {
  const classes = useStyles();
  const [techNews, setTechNews] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = () => {
    const apiKey = '6734df7958b349ecba65232a86873747'; // Replace with your actual NewsAPI key
    const newsApiUrl = `https://newsapi.org/v2/top-headlines?category=technology&country=us&apiKey=${apiKey}`;

    fetch(newsApiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          setTechNews(data.articles);
        }
      })
      .catch((error) => {
        console.error('Error fetching tech news:', error);
      });
  };

  const handleRemoveArticle = (index) => {
    setTechNews((prevNews) => {
      const updatedNews = [...prevNews];
      updatedNews.splice(index, 1);
      return updatedNews;
    });
  };

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <Typography variant="h5" component="h2">
            Tech News
            <IconButton className={classes.refreshButton} onClick={fetchNews}>
              <RefreshIcon />
            </IconButton>
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Latest tech news from around the world.
          </Typography>

          <List>
            {techNews.map((article, index) => (
              <Box key={index} className={classes.newsItem}>
                {article.urlToImage && (
                  <img src={article.urlToImage} alt={article.title} className={classes.newsImage} />
                )}
                <div>
                  <IconButton edge="end" aria-label="close" onClick={() => handleRemoveArticle(index)}>
                    <CloseIcon />
                  </IconButton>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Link href={article.url} target="_blank" rel="noopener noreferrer">
                          {article.title}
                        </Link>
                      }
                      secondary={article.source.name}
                    />
                  </ListItem>
                </div>
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsPage;
