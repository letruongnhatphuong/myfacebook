import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './firebase.js';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';

function Login() {
  const [mode, setMode] = useState('login');
  const [message, setMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isSignUp = mode === 'signup';

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    const data = new FormData(event.currentTarget);
    setMessage('');
    if (isSignUp && data.get('password') !== data.get('confirmPassword')) {
      setPasswordError('Passwords must match.');
      return;
    }
    setPasswordError('');
    if (!auth) {
      setMessage('Account access is not configured yet. Please try again later.');
      return;
    }
    setSubmitting(true);
    try {
      const email = data.get('email').trim();
      const password = data.get('password');
      if (isSignUp) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        try {
          await updateProfile(credential.user, { displayName: data.get('name').trim() });
        } catch {
          setMessage('Your account was created, but your name could not be saved. Switch to Log in to continue.');
          return;
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      window.location.assign('/marketplace');
    } catch (error) {
      const messages = {
        'auth/invalid-credential': 'The email or password is incorrect.',
        'auth/user-not-found': 'The email or password is incorrect.',
        'auth/wrong-password': 'The email or password is incorrect.',
        'auth/email-already-in-use': 'An account already uses this email. Please log in.',
        'auth/invalid-email': 'Enter a valid email address.',
        'auth/weak-password': 'Choose a stronger password with at least 8 characters.',
        'auth/password-does-not-meet-requirements': 'Your password does not meet the account password requirements.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/network-request-failed': 'Unable to connect. Check your connection and try again.',
        'auth/user-disabled': 'This account is disabled.',
      };
      setMessage(messages[error.code] || 'Unable to access your account. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box sx={{ maxWidth: 440, mx: 'auto', py: { xs: 1, sm: 5 } }}>
      <Stack alignItems="center" spacing={1} sx={{ mb: 3, textAlign: 'center' }}>
        <Box component="img" src="/not-marketplace.svg" alt="" width={56} height={56} />
        <Typography component="h1" variant="h4" fontWeight="bold">Not Marketplace</Typography>
        <Typography color="text.secondary">A place to find your next favorite thing.</Typography>
      </Stack>

      <Card sx={{ borderRadius: 3 }}>
        <Tabs
          value={mode}
          onChange={(_, value) => {
            setMode(value);
            setMessage('');
            setPasswordError('');
          }}
          variant="fullWidth"
          aria-label="Account access"
        >
          <Tab disabled={submitting} id="login-tab" aria-controls="account-panel" value="login" label="Log in" />
          <Tab disabled={submitting} id="signup-tab" aria-controls="account-panel" value="signup" label="Sign up" />
        </Tabs>
        <CardContent role="tabpanel" id="account-panel" aria-labelledby={`${mode}-tab`} sx={{ p: 3 }}>
          {isSignUp && (
            <Typography component="h2" variant="h5" sx={{ mb: 1 }}>
              Create your account
            </Typography>
          )}
          <Typography color="text.secondary" variant="body2" sx={{ mb: 3 }}>
            {isSignUp ? 'Enter your details to get started.' : 'Enter your email and password to log in.'}
          </Typography>
          <Stack component="form" key={mode} onSubmit={handleSubmit} spacing={2}>
            {isSignUp && <TextField label="Full name" name="name" autoComplete="name" required fullWidth />}
            <TextField label="Email address" name="email" type="email" autoComplete="email" required fullWidth />
            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              required
              fullWidth
              slotProps={{ htmlInput: { minLength: isSignUp ? 8 : undefined } }}
              helperText={isSignUp ? 'Use at least 8 characters.' : undefined}
              onChange={() => { setPasswordError(''); setMessage(''); }}
            />
            {isSignUp && (
              <TextField
                label="Confirm password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                fullWidth
                error={Boolean(passwordError)}
                helperText={passwordError}
                onChange={() => setPasswordError('')}
              />
            )}
            <Button disabled={submitting} type="submit" variant="contained" size="large" fullWidth>
              {submitting ? 'Please wait…' : isSignUp ? 'Create account' : 'Log in'}
            </Button>
            {message && <Alert severity="error">{message}</Alert>}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
