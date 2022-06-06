import React, { useState } from 'react'
import { Card, CardHeader, CardMedia, Typography, CardContent, Avatar, IconButton, Menu, MenuItem } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogBox from './Dialog';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


export default function ListItem({ memory, editMemory, deleteMemory, setProgress }) {

    const { title, summary, creator, createdAt, _id, tags, image } = memory;
    const [anchorEl, setAnchorEl] = useState(null);

    const date = new Date(createdAt);

    const [dialog, setDialog] = useState(false);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    }
    const handleEdit = () => {
        setDialog(true);
        handleClose();
    };

    const handleDelete = () => {
        handleClose();
        deleteMemory(_id);
    };

    return (
        <>
            <DialogBox dialog={dialog} setDialog={setDialog} memory={memory} editMemory={editMemory} _id={_id} setProgress={setProgress} />
            <Card sx={{ my: '1rem', height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: 'rebeccapurple' }} aria-label="recipe">
                            {creator.charAt(0)}
                        </Avatar>
                    }
                    action={
                        <div>
                            <IconButton
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleEdit}>
                                    <EditIcon fontSize='small' sx={{ marginRight: '1rem' }} />
                                    Edit
                                </MenuItem>
                                <MenuItem onClick={handleDelete}>
                                    <DeleteIcon fontSize='small' sx={{ marginRight: '1rem' }} />
                                    Delete
                                </MenuItem>
                            </Menu>
                        </div>
                    }
                    title={creator}
                    // subheader={`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`}
                    subheader={`${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`}
                //September 14, 2016
                />
                <CardMedia
                    component="img"
                    height='200px'
                    image={image.url}
                    alt="random"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {title}
                    </Typography>
                    <Typography gutterBottom >
                        {summary}
                    </Typography>
                    {
                        tags.map((tag, index) => (
                            <Typography key={index} component="em" variant="body2" display="span" >#{tag} </Typography>
                        )
                        )
                    }
                </CardContent>
            </Card>
        </>
    )
}