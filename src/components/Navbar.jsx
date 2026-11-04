import React from 'react'
import { Link } from 'react-router-dom'
import {
    AppBar,
    Box,
    Button,
    Container,
    TextField,
    Toolbar,
} from '@mui/material';

const Navbar = () => {

    return (
        <AppBar position="static" color="inherit" elevation={1}>
            <Container>
                <Toolbar component="nav" disableGutters sx={{ gap: 2, flexWrap: 'wrap', py: 2 }}>
                    <Box component="img" src="/facebook.svg" width={40} height={40} alt="Facebook" />
                    <TextField
                        type="search"
                        disabled
                        size="small"
                        placeholder="Search Facebook"
                        sx={{ flexGrow: 1, minWidth: 180 }}
                    />
                    <Button component={Link} to="/" variant="outlined">Home</Button>
                    <Button component={Link} to="/marketplace" variant="outlined">Marketplace</Button>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Navbar