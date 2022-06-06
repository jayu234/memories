import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { CssBaseline, Stack, TextField, Button } from '@mui/material';
import { Box, Container } from '@mui/system';
import '../style/input-style.css'
// import axios from 'axios';

export default function Input({ addMemory, setProgress }) {

    const [newMemory, setNewMemory] = useState({ title: "", creator: "", summary: "", tags: "" });

    // const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/famousanonymous/image/upload';

    const [fileInput, setFileInput] = useState('');
    const [previewSource, setPreviewSource] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleOnChange = (e) => {
        setNewMemory({ ...newMemory, [e.target.name]: e.target.value });
    }

    const getFile = async (formData) => {
        const res = await fetch(process.env.REACT_APP_CLOUDINARY_URL, {
            method: 'POST',
            body: formData,
        })

        const { public_id, secure_url } = await res.json();

        return { public_id, secure_url };

    }

    const handleInput = async (e) => {

        e.preventDefault();

        const memoryToAdd = newMemory;
        setNewMemory({ title: "", creator: "", summary: "", tags: "" });

        setFileInput('');
        setPreviewSource(false);

        setProgress(10);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', process.env.REACT_APP_CLOUDINARY_UPLOAD_FOLDER);

        setProgress(50);
        const { public_id, secure_url } = await getFile(formData);
        setProgress(70);
        addMemory(memoryToAdd, public_id, secure_url);
        setProgress(0);
    }

    const previewInput = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = () => {
            setPreviewSource(reader.result);
        }
    }

    const handleFileInput = (event) => {
        const file = event.target.files[0];

        setFileInput(event.target.value);
        setSelectedFile(file);
        previewInput(file);
    }
    return (
        <>
            <CssBaseline />
            <Container maxWidth='sm' sx={{ marginTop: '2rem', py: '2rem', borderRadius: '10px' }} >
                <Typography component="h1" variant="h5" fontFamily="'Poppins', sans-serif">
                    Add a memory
                </Typography>
                <Box component='form'  >
                    <TextField
                        label='Creator'
                        id='creator'
                        fullWidth
                        margin='normal'
                        name='creator'
                        required
                        value={newMemory.creator}
                        onChange={handleOnChange}
                    />
                    <TextField
                        label='Title'
                        id='title'
                        fullWidth
                        margin='normal'
                        name='title'
                        required
                        value={newMemory.title}
                        onChange={handleOnChange}
                    />
                    <TextField
                        label='Summary'
                        id='summary'
                        fullWidth
                        margin='normal'
                        name='summary'
                        required
                        value={newMemory.summary}
                        onChange={handleOnChange}
                    />
                    <div className='userUpload' >
                        <input className='fileUpload' type="file" value={fileInput} name='upload-file' id='upload-file' accept='image/*' required onChange={handleFileInput} />
                    </div>
                    <TextField
                        label='Tags'
                        id='tags'
                        fullWidth
                        margin='normal'
                        name='tags'
                        placeholder='Enter tags saperated by coma'
                        required
                        value={newMemory.tags}
                        onChange={handleOnChange}
                    />
                    <Stack margin={1} spacing={2} direction='row'>
                        <Button type="submit" variant="contained" onClick={handleInput} > Add </Button>
                        <Button type="reset" variant="contained" > Reset </Button>
                    </Stack>
                </Box>
                {previewSource && <Box component='div' sx={{ display: 'flex', marginTop: '2rem', flexDirection: 'column', justifyContent: 'center', alignItems: 'start' }}>
                    <Typography component="h5" variant="body1">
                        Image Preview:
                    </Typography>
                    <img src={previewSource} alt='preview' style={{ width: '100%' }} />
                </Box>}
            </Container>
        </>
    );
}