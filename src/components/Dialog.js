import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';

export default function DialogBox({ dialog, setDialog, _id, editMemory, setProgress }) {

    const [newMemory, setNewMemory] = useState({ title: "", creator: "", summary: "", tags: "" });

    // const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/famousanonymous/image/upload';

    const [fileInput, setFileInput] = useState('');
    const [previewSource, setPreviewSource] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleOnChange = (e) => {
        setNewMemory({ ...newMemory, [e.target.name]: e.target.value });
    }

    const handleClose = () => {
        setDialog(false);
    };

    const getFile = async (formData) => {
        const res = await fetch(process.env.REACT_APP_CLOUDINARY_URL, {
            method: 'POST',
            body: formData,
        })

        const { public_id, secure_url } = await res.json();

        return { public_id, secure_url };

    }
    const handleUpdate = async(e) => {
        e.preventDefault();
        handleClose();

        const memoryToEdit = newMemory;
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
        // addMemory(memoryToAdd, public_id, secure_url);
        editMemory(memoryToEdit, _id, public_id, secure_url);

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
        <div>
            <Dialog open={dialog} onClose={handleClose} >
                <DialogTitle component="h1" variant="h5" fontFamily="'Poppins', sans-serif" >Edit a memory</DialogTitle>
                <DialogContent sx={{padding: '0px 24px'}}>
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
                        <input className='fileUpload' type="file" value={fileInput} name='upload-file' id='upload-file' accept='image/*' required onChange={handleFileInput}/>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUpdate}>Update</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
                {previewSource && <Box component='div' sx={{ display: 'flex', margin: '1rem auto', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography component="h5" variant="body1">
                        Image Preview:
                    </Typography>
                    <img src={previewSource} alt='preview' style={{ height: '155px' }} />
                </Box>}
            </Dialog>
        </div>
    );
}
