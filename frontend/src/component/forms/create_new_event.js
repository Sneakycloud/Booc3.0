import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

import BasicTextField from "./text_field";
import TextFieldMultiline from "./text_field_multiline";
import ColorPicker from "./color_picker";
import RepeatCheckboxes from "./repeat_checkboxes";
import VisibilityPicker from "./visibility_picker";
import ButtonDirectionStack from "./button_stack";
import BasicDatePicker from "./date_picker";
import BasicTimePicker from "./time_picker";
import Selector from "./selector";

import dayjs from 'dayjs';
import {api} from '../../controllers/axiosTemplate';
import {createEvent} from '../../controllers/eventController';
import { useRevalidator } from 'react-router';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '800px',
  height: '80vh',
  bgcolor: '#f5ebe0',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto'
};


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#f5ebe0',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
  boxShadow: 'none',
  border: 'none',
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));




export default function BasicModal() {
  const [open, setOpen] = React.useState(false);

  const revalidator = useRevalidator();
  const Revalidatecallback = () => revalidator.revalidate();

  const [formData, setFormData] = React.useState ({
    title: '',
    date: dayjs(),          // default is the current date
    fromTime: dayjs(),      // default time is the current time
    toTime: dayjs(),
    location: '',
    description: '',
    color: '#0000FF',       // default color blue
    //repeat: ['never'],
    visibility: 'private',
    invitePeople: [],
  });


  const initialFormData = {
    title: '',
    date: dayjs(),          
    fromTime: dayjs(),      
    toTime: dayjs(),
    location: '',
    description: '',
    color: '#0000FF',      
    //repeat: ['never'],
    visibility: 'private',
    invitePeople: [],
  };


  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setFormData(initialFormData);   //clear the form
    setOpen(false);
  };



  //handle form input
  const handleInput = (field, value) => {
    setFormData({ ...formData, [field]: value });
  }


  //handle form submission
  const handleSubmit = async () => {
    try {
        //For some reason if i place a console.log() before the next line it will still behave as the map happened before it.
        formData.invitePeople = formData.invitePeople.map(((user) => user.split("#") ))
        console.log('Form data:', formData);        //puts the new event in the console log in the browser

        

        //const response = await api.post('/api/newEvent', formData);  
        const response = await createEvent(formData);

        
        if (response.status === 201)
        {
            alert('Event created successfully');
            Revalidatecallback();
            handleClose();      //closes the create event form
        }
        else
        {
            alert('Failed to create event');
        }
    }
    catch (error) {
        console.error('Error when creating event:', error.response?.data || error.message);
        alert('An error occurred while creating the event');
    }
  };



  return (
    <div>
      <Button onClick={handleOpen} title="Create event" sx={{ width: '100%', padding: '8px', backgroundColor: '#d66536', color: '#f5ebe0' }}>
          Create New Event
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        <Box sx={style}>
          <div style={{width: '100%', height: '100%', paddingLeft: '10px'}}>


            {/* Header - Create New Event */}
            <Grid sx={{ display: 'grid', columnGap: 10, rowGap: 5, gridTemplateColumns: 'repeat(1, 1fr)'}}>
                <Item>
                    <Typography textAlign={'center'} sx={{ fontWeight: 'bold', fontSize: 20, marginTop: -2 }}>Create New Event</Typography>
                </Item>
            </Grid>



            {/* Title */}
            <Grid sx={{ display: 'grid', width: '100%', gridTemplateColumns: 'repeat(1, 1fr)'}}>
                <Item>
                    <Typography sx = {{ textAlign: 'left', fontWeight: 'bold', color: '#d66536' }}>Title</Typography>
                    <BasicTextField 
                        value={formData.title} 
                        onChange={(newTitle) => handleInput('title', newTitle.target.value)} 
                    />
                </Item>
            </Grid>



            {/* Date */}
            <Grid sx={{ display: 'grid', width: '100%', gridTemplateColumns: 'repeat(1, 1fr)'}}>
                <Item>
                    <Typography sx = {{ textAlign: 'left', fontWeight: 'bold', color: '#d66536', marginLeft: 0 }}>Date</Typography>
                </Item>
            </Grid>

            <Grid sx={{ display: 'grid', columnGap: 1, width: '100%', gridTemplateColumns: 'repeat(3, auto)', paddingLeft: '16px', paddingRight: '30px' }}>
                <BasicDatePicker 
                    value={formData.date} 
                    onChange={(newDate) => handleInput('date', newDate)} 
                />
                <BasicTimePicker 
                    label="from" 
                    value={formData.fromTime} 
                    onChange={(newTime) => handleInput('fromTime', newTime)} 
                />
                <BasicTimePicker 
                    label="to" 
                    value={formData.toTime} 
                    onChange={(newTime) => handleInput('toTime', newTime)}
                />
            </Grid>
 


            {/* Location */}
            <Grid sx={{ display: 'grid', width: '100%', gridTemplateColumns: 'repeat(1, 1fr)', paddingTop: '15px'}}>
                <Item>
                    <Typography sx = {{ textAlign: 'left', fontWeight: 'bold', color: '#d66536' }}>Location</Typography>
                    <BasicTextField 
                        value={formData.location}
                        onChange={(newLocation) => handleInput('location', newLocation.target.value)}
                    />
                </Item>
            </Grid>



            {/* Description */}
            <Grid sx={{ display: 'grid', width: '100%', gridTemplateColumns: 'repeat(1, 1fr)'}}>
                <Item>
                    <Typography sx = {{ textAlign: 'left', fontWeight: 'bold', color: '#d66536' }}>Description</Typography>
                    <TextFieldMultiline 
                        value={formData.description}
                        onChange={(newDescription) => handleInput('description', newDescription.target.value)}
                    />
                </Item>
            </Grid>



            {/* Color */}
            <Grid sx={{ display: 'grid', width: '100%', gridTemplateColumns: 'repeat(1, 1fr)'}}>
                <Item>
                    <Typography sx = {{ textAlign: 'left', fontWeight: 'bold', color: '#d66536' }}>Color</Typography>
                    <ColorPicker 
                        value={formData.color}
                        onChange={(newColor) => handleInput('color', newColor)}
                    />
                </Item>
            </Grid>


            {/* Repeat 
             
            <Grid sx={{ display: 'grid', width: '100%', gridTemplateColumns: 'repeat(1, 1fr)'}}>
                <Item>
                    <Typography sx = {{ textAlign: 'left', fontWeight: 'bold', color: '#d66536' }}>Repeat</Typography>
                    <RepeatCheckboxes 
                        value={formData.repeat}
                        onChange={(newRepeat) => handleInput('repeat', newRepeat)}
                    />
                </Item>
            </Grid>
            */}


            {/* Visibility */}
            <Grid sx={{ display: 'grid', width: '100%', gridTemplateColumns: 'repeat(1, 1fr)'}}>
                <Item>
                    <Typography sx = {{ textAlign: 'left', fontWeight: 'bold', color: '#d66536' }}>Visibility</Typography>
                    <VisibilityPicker 
                        value={formData.visibility}
                        onChange={(newVisibility) => handleInput('visibility', newVisibility)}
                    />
                </Item>
            </Grid>



            {/* Add people */}
            <Grid sx={{ display: 'grid', width: '40%', gridTemplateColumns: 'repeat(1, 1fr)'}}>
                <Item>
                    <Typography sx = {{ textAlign: 'left', fontWeight: 'bold', color: '#d66536', paddingBottom: '5px' }}>Invite People</Typography>
                    <Selector 
                        value={formData.invitePeople}
                        onChange={(newInvitePeople) => handleInput('invitePeople', newInvitePeople)}
                    />
                </Item>
            </Grid>



            {/* Buttons - Cancel and Create */}
            <Grid sx={{ display: 'grid', width: '100%', gridTemplateColumns: 'repeat(1, 1fr)', paddingBottom: '15px'}}>
                <Item>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <ButtonDirectionStack handleClose={handleClose} handleSubmit={handleSubmit} />
                    </Box>
                </Item>
            </Grid>



          </div>
        </Box>
      </Modal>
    </div>
  );
}
