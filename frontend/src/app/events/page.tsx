"use client";

import React, { useState, useEffect } from 'react';
import { TextField, Card, CardContent, Typography, Grid, Container } from '@mui/material';
import Navbar from '../../components/Navbar';
import './events.css';
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'


const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const mockEvents = [
    // mock events for page- delete when API is finished
    { id: 1, name: 'Music Concert', category: 'Music', description: 'A live concert with top artists.' },
    { id: 2, name: 'Art Exhibit', category: 'Art', description: 'Explore local and international artworks.' },
    { id: 3, name: 'Food Festival', category: 'Food', description: 'Enjoy delicious food from various cuisines.' },
    { id: 4, name: 'Technology Conference', category: 'Tech', description: 'A conference for the latest tech innovations.' },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      // Simulate an API call with mock data- add in API when finished
      const filteredEvents = mockEvents.filter(event => 
        event.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setEvents(filteredEvents);
    };

    fetchEvents();
  }, [searchQuery]);

  return (
    
    <Container>
        <div>
            <Navbar /> 
            <h1>Events</h1>
            <p>Welcome to the events page!</p>
        </div>

      <TextField
        label="Search Events"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className = "search-box"
        sx={{
          '& .MuiInputLabel-root': {
            color: 'white', 
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: '4px', 
            '& fieldset': {
              borderColor: '#007bff', 
            },
            '&:hover fieldset': {
              borderColor: '#0056b3', 
            },
          },
          '& .MuiOutlinedInput-input': {
            color: '#333', 
          },
        }}
      />

      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{event.name}</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Category: {event.category}
                </Typography>
                <Typography variant="body2">{event.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EventsPage;
