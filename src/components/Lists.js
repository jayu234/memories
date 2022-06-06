import React, { useEffect } from 'react'
import ListItem from './ListItem'
import { Typography, Container, Stack, CircularProgress } from '@mui/material'
import { Box } from '@mui/system';

function Lists({ loading, setLoading, getAllMemories, memories, editMemory, deleteMemory, setProgress }) {

  useEffect(() => {
    setLoading(true);
    getAllMemories();
    setLoading(false);
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <Container maxWidth='sm' sx={{ marginTop: '2rem', py: '2rem' }}>

        <Typography component="h1" variant="h5" fontFamily="'Poppins', sans-serif"   >
          Your Memories
        </Typography>

        { loading &&  <Box sx={{ width: '10%', margin: '4rem auto' }} >
           <CircularProgress size={60}/> 
          {/* <CircularProgress size={60} /> */}
        </Box> }

        { !loading && <Stack spacing={4} alignItems='center' direction='column'>
          {memories.map((memory) => (
            <ListItem key={memory._id} memory={memory} editMemory={editMemory} deleteMemory={deleteMemory} setProgress={setProgress}/>
          )).reverse()}
        </Stack> }
      </Container>
    </>
  )
}

export default Lists