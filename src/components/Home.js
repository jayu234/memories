import Input from './Input';
import Lists from './Lists';
import { Box, CssBaseline, Grid, LinearProgress, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {

    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    
    const editMemory = async (newMemory, id, public_id, url ) => {

        let hashTags = newMemory.tags.split(", ");

        for (let index = 0; index < hashTags.length; index++) {

            let element = hashTags[index];
            hashTags[index] = element.substring(element.indexOf('#') + 1);
        }
        const res = await axios.put(`${process.env.REACT_APP_HOST}/api/v1/memories/${id}`, {
            title: newMemory.title,
            creator: newMemory.creator,
            summary: newMemory.summary,
            tags: hashTags,
            image: {
                public_id: public_id,
                url: url
            }
        });

        /* 
            const { updatedMemory } = await res.data;
            newMemories = memories;
            const indexOfUpdatedMemory = newMemories.findIndex((memory) => memory._id === id);
            newMemories[indexOfUpdatedMemory] = updatedMemory;
        */
        const { updatedMemory } = await res.data;
        let newMemories = JSON.parse(JSON.stringify(memories));

        for (let index = 0; index < newMemories.length; index++) {

            const checkNote = newMemories[index];
            if (checkNote._id === id) {
                newMemories[index].title = updatedMemory.title;
                newMemories[index].creator = updatedMemory.creator;
                newMemories[index].summary = updatedMemory.summary;
                newMemories[index].tags = updatedMemory.tags;
                newMemories[index].image = updatedMemory.image;
                break;
            }
        }
        setMemories(newMemories);

    }
    const deleteMemory = async (id) => {
        const res = await axios.delete(`${process.env.REACT_APP_HOST}/api/v1/memories/${id}`);

        const { success } = res.data;
        if (success) {
            setMemories(memories.filter(memory => memory._id !== id))
        }
    }
    const addMemory = async (memory, public_id, url) => {

        let hashTags = memory.tags.split(", ");

        for (let index = 0; index < hashTags.length; index++) {

            let element = hashTags[index];
            hashTags[index] = element.substring(element.indexOf('#') + 1);
        }

        const res = await axios.post(`${process.env.REACT_APP_HOST}/api/v1/memories/add`, {
            title: memory.title,
            creator: memory.creator,
            summary: memory.summary,
            tags: hashTags,
            image: {
                public_id: public_id,
                url: url
            }
        });
        const { newMemory } = res.data;
        setMemories(memories.concat(newMemory));
    }
    const getAllMemories = async () => {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_HOST}/api/v1/memories`);

        const { allMemories } = res.data;

        setMemories(allMemories);
        setLoading(false);

    }
    useEffect(() => {
        getAllMemories();
    }, [])
    return (
        <>
            <CssBaseline />
            <Container sx={{ padding: '1rem' }} maxWidth='sm' >
                <Typography component="h1" align='center' variant='h2' fontFamily="'Playfair Display',serif" >
                    Memories
                </Typography>
            </Container>
            <Grid container sx={{ width: '92vw', margin: 'auto', borderRadius: '14px', bgcolor: '#f3efef', boxShadow: '0px 13px 13px 1px #857e7e', overflow: 'hidden' }} >
                { (progress !== 0) && <Box sx={{ width: '100%' }} >
                    <LinearProgress value={progress}/>
                </Box> }
                <Grid item xs={12} md={6}>
                    <Input addMemory={addMemory} setProgress={setProgress} />
                    {/* <Input /> */}
                </Grid>
                <Grid item xs={12} md={6}>
                    <Lists loading={loading} memories={memories} getAllMemories={getAllMemories} setLoading={setLoading} editMemory={editMemory} deleteMemory={deleteMemory} setProgress={setProgress}/>
                    {/* <Lists /> */}
                </Grid>
            </Grid>
        </>
    )
}

export default Home