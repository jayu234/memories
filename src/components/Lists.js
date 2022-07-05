import React, { useState } from 'react'
import ListItem from './ListItem'
import { Typography, Container, Stack, CircularProgress, styled, Grid, InputBase } from '@mui/material'
import { Box } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(179, 179, 179, 0.15)',
  '&:hover': {
    backgroundColor: 'rgba(179, 179, 179, 0.25)',
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '18ch',
      '&:focus': {
        width: '22ch',
      },
    },
  },
}));

function Lists({ loading,  memories, editMemory, deleteMemory, setProgress }) {


  const [searchQuery, setSearchQuery] = useState("");
  // const [filteredMemories, setFilteredMemories] = useState([]);
  const [query, setQuery] = useState("");

  const [searchParams] = useState(["creator"]);

  const handleKeyDown = () => {
    setQuery(searchQuery);
    setSearchQuery("");
  }
  function search(items) {
    return items.filter((item) => {
      return searchParams.some((newItem) => {
        return (
          item[newItem]
            .toString()
            .toLowerCase()
            .indexOf(query.toLowerCase()) > -1
        );
      });
    });
    // if (query.length < 1)
    //   return items;
    // const results = items.filter((item)=> item.title === query);
    // console.log(results);
    // return results;
  }
  return (
    <>
      <Container maxWidth='sm' sx={{ marginTop: '2rem', py: '2rem' }}>

        <Grid container alignItems="center">
          <Grid item xs={12}  md={4} >
            <Typography component="h1" variant="h5" fontFamily="'Poppins', sans-serif"   >
              Your Memories
            </Typography>
          </Grid>
          {!loading && <Grid item xs={12} md={8}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search by title…"
                inputProps={{ 'aria-label': 'search' }}
                value={query}
                onChange={(e) => { setQuery(e.target.value) }}
                // onKeyDown={(e) => { e.code === "Enter" && handleKeyDown() }}
              />
            </Search>
          </Grid>}
        </Grid>

        {loading && <Box sx={{ width: '10%', margin: '4rem auto' }} >
          <CircularProgress size={60} />
        </Box>}

        {!loading && <Stack spacing={4} alignItems='center' direction='column'>
          {search(memories).map((memory) => (
            <ListItem key={memory._id} memory={memory} editMemory={editMemory} deleteMemory={deleteMemory} setProgress={setProgress} />
          )).reverse()}
        </Stack>}
      </Container>
    </>
  )
}

export default Lists